'use strict';

/*
* authenticationService: handles user authentication using google oauth
*/

angular.module('dashboard')
.factory('authenticationService', ['$q','gapiLoader', 'oauthAPILoader','$interval','localStorageService',
  function($q, gapiLoader,oauthAPILoader,$interval,localStorageService) {
  var service = {},
      autoAuthRefreshInterval,
      authenticated = $q.defer(),
      isUserAuthenticated = false,//holds the user's internal authentication state
      token = localStorageService.get('token'),//if the user already has a token in localstorage, use it
      CLIENT_ID = '810443916453-vjmrchhc179t6na1rgq1v8qdvqtab0h0.apps.googleusercontent.com',
      SCOPES = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      LOCAL_STORAGE_KEY = 'token';

  //is the user authenticated?
  //true -> yes
  service.isUserAuthenticated = function(){
    return isUserAuthenticated;
  };
  

  //returns a promise that resolves  to the user's google profile when the user becomes authenticated
  service.whenAuthenticated = function(){
    return authenticated.promise;
  };

  //login in the user. if successful, put the token in localStorage, and set the user to authenticated
  service.login = function(silentCheck) {
    var deferred = $q.defer();
    gapiLoader.get().then(function (gApi) {
      gApi.auth.authorize({ client_id: CLIENT_ID, scope: SCOPES, immediate: silentCheck,approval_prompt:'auto'}, function (authResult) {
        if(authResult && !authResult.error){
          token = {
                    access_token: authResult.access_token,
                    expires_in:authResult.expires_in,
                    state:authResult.state
                  };
          
          localStorageService.set(LOCAL_STORAGE_KEY,token);
          isUserAuthenticated = true;
          authenticated.resolve();
          deferred.resolve(authResult);
        }else{
          localStorageService.remove(LOCAL_STORAGE_KEY);
          deferred.reject(authResult);
        }
      });
    });
    return deferred.promise;
  };

  //logout the user and cancel the auto refresh
  service.logout = function(){
    var deferred = $q.defer();

    $interval.cancel(autoAuthRefreshInterval);
    localStorageService.remove(LOCAL_STORAGE_KEY);

    token = null;
    isUserAuthenticated = false;
    deferred.resolve();
    return deferred.promise;
  };     

  //get the current authorized user's google profile
  service.getProfile = function () {
    var deferred = $q.defer();
    oauthAPILoader.get().then(function (gApi) {
      var request = gApi.client.oauth2.userinfo.get({});
      request.execute(function (resp) {
        deferred.resolve(resp);
      });
    });
    return deferred.promise;
  };

  //set up the service to auto refresh token once the user signs in
  service.whenAuthenticated()
  .then(function(){
    autoAuthRefreshInterval = $interval(function(){ service.checkAuth(true); }, 55 * 60 * 1000);//every 55 mins
  });

  //see if there was a token in localstorage, use it
  //if invalid, user will have to login (which overwrites it)
  gapiLoader.get()
  .then(function (gApi) {
    if(typeof token !== 'undefined' && token){
      gApi.auth.setToken(token);
      
      //see if auth token is still valid
      service.getProfile()
      .then(function(result){
        if(result &&!result.error){
          authenticated.resolve(result);
          isUserAuthenticated = true;
        }
      });
    }
  });

  return service;
}]);