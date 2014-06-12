/* jshint ignore:start */
var isClientJS = false;
function handleClientJSLoad() {
    isClientJS = true;
    console.log("ClientJS is loaded");
    //Ready: create a generic event
    var evt = document.createEvent("Events");
    //Aim: initialize it to be the event we want
    evt.initEvent("gapi.loaded", true, true);
    //FIRE!
    window.dispatchEvent(evt);
}
/* jshint ignore:end */

'use strict';

angular.module("gapi", [])
  .factory("oauthAPILoader", ["gapiLoader", "$q", function (gapiLoader, $q) {
    var deferred = $q.defer();
    var promise;

    return {
      //Loads the OAuth v2 client
      //returns a promise that resolves to the js client
      get: function () {
        if (!promise) {
          promise = deferred.promise;
          gapiLoader.get().then(function (gApi) {
            gApi.client.load("oauth2", "v2", function () {
              if(gApi.client && gApi.client.oauth2){
                deferred.resolve(gApi.client.oauth2);
              }else{
                deferred.reject('failed to load OAuth2');
              }                
            });
          });
        }
        return promise;
      }
    };    
  }])//oauthAPILoader  

  .factory('bigQueryAPILoader',['gapiLoader','$q',
    function(gapiLoader,$q){
      return {
        //Loads the BigQuery client
        //returns a promise that resolves to the js client
        get : function(){
          var deferred = $q.defer();

          gapiLoader.get()
          .then(function (gApi){
            gApi.client.load('bigquery','v2',function(){
              if(gApi.client && gApi.client.bigquery){
                deferred.resolve(gApi.client.bigquery);
              }else{
                deferred.reject('failed to load big query api');
              }
            });
          });//GET THEN
          return deferred.promise;
        }
      };
  }])//bigQueryAPILoader

  .factory("gapiLoader", ["$q", "$window", function ($q, $window) {
    return {
      //Loads Google's API JS library into our Angular App politely
      //returns a promise that resovles to the lib
      get: function () {
        var deferred = $q.defer(), gapiLoaded;

        if($window.isClientJS) {
          deferred.resolve($window.gapi);
        }

        else {
          gapiLoaded = function () {
            deferred.resolve($window.gapi);
            $window.removeEventListener("gapi.loaded", gapiLoaded, false);
          };
          $window.addEventListener("gapi.loaded", gapiLoaded, false);
        }

        return deferred.promise;
      }
    };
  }]);//gapiLoader