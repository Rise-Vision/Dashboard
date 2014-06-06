'use strict';

/*
* authenticationService: handles user authentication using google oauth
*/

angular.module('dashboard')
.factory('authenticationService', ['$q', function($q) {
  var service = {};
  var authenticated = $q.defer();
  var isUserAthenticated = false;//holds the user's internal authentication state
  
  //is the user authenticated?
  //true -> yes
  service.isUserAthenticated = function(){
    return isUserAthenticated;
  };
  

  //returns a promise that resolves  when the user becomes authenticated
  service.whenAuthenticated = function(){
    return authenticated.promise;
  };

  //login in the user
  service.login = function() {
    //TODO: insert google OAUTH stuff here

    isUserAthenticated = true;
    authenticated.resolve();
  };



  //logout the user
  service.logout = function(){
    //TODO: insert google OAUTH stuff here

    isUserAthenticated = false;
  };

  return service;
}]);