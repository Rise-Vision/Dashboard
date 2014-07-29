'use strict';

/*
* authenticationService: handles user authentication using google oauth
*/

angular.module('dashboard')
.factory('authenticationService', ['$q','$http','$window','API_ROOT',
  function($q,$http,$window,API_ROOT) {
  var service = {},
      authenticated = $q.defer(),
      isUserAuthenticated = false;//holds the user's internal authentication state

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
  service.login = function() {
    $window.location.replace(API_ROOT+'/auth/login');
    var deferred = $q.defer();
     $http.get(API_ROOT + '/auth/user')
                .then(function(result){

                  authenticated.resolve(result.data);
                  isUserAuthenticated = true;
                  deferred.resolve(result.data);
                });
    return deferred.promise;
  };

  //logout the user and cancel the auto refresh
  service.logout = function(){
    return $http.post(API_ROOT+'/auth/logout')
                .then(function(){
                    isUserAuthenticated = false;
                  });
  };

  //get the current authorized user's google profile
  service.getProfile = function () {
    return authenticated.promise;

  };

  //ask the server if the user is authenticated
  service.makeAuthCheck = function() {
    var deferred = $q.defer();

    $http.get(API_ROOT+'/auth/user')
    .then(function(result){
      authenticated.resolve(result.data);
      isUserAuthenticated = true;
    },function(error){
      if(error.status === 404){
        console.error('Dashboard Proxy Server is Currently Unavailable.');
      }
      deferred.reject(error);
    });
    return deferred.promise;

  };

  return service;
}]);