'use strict';

// Create a module for our core Store services
angular.module('dashboard')
.controller('indexController',['authenticationService','$scope','$window','activeTabService',
  function(authenticationService,$scope,$window,activeTabService) {
    $scope.currentYear = new Date().getFullYear();
    $scope.isAuthenticated = false;
    $scope.logingIn = false;
    $scope.tabs = ['Displays','Software','Companies','Support'];
    $scope.activeTab = activeTabService;

    //log the user out of the system
    $scope.logout = function(){
      authenticationService.logout()
      .then(function(){
        $window.location.reload();
      },function(error){console.error(error);});
    };

    //login the user and set display scope variables for the header
    $scope.login = function(){
      $scope.logingIn = true;
      authenticationService.login()
      .then(null, function(error){
        $scope.logingIn = false;
        if(error.status === 404 || error.status === 502){
          $scope.loginErrorMessage = 'Proxy Server Is Unavailable At The Moment.';
        }else{
          $scope.loginErrorMessage = 'Failed to login: ' + error.toString();
        }
      });
    };

    //see if the user is already authenticated
    authenticationService.makeAuthCheck()
    .then(null,function(e){
      $scope.logingIn = false;
      if(e.status === 404 || e.status === 502) {
        $scope.loginErrorMessage = 'Proxy Server Is Unavailable At The Moment. Dashboard Can Not Load.';
      }else if(e.status !== 401){
        $scope.loginErrorMessage = 'Failed to login: ' + e.toString();
      }
    });

    //when the user becomes autheniticated, update the UI
    authenticationService
    .whenAuthenticated()
    .then(function(){
      $scope.logingIn = true;
      return authenticationService.getProfile();
    })
    .then(function(result){
      $scope.userName = result.displayName;
      $scope.isAuthenticated = true;
    })
    .then(null,function(error){
      console.error(error);
    })
    .finally(function(){
      $scope.logingIn = false;
    });
  }
]); //mainController