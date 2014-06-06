'use strict';

// Create a module for our core Store services
angular.module('dashboard')
.controller('mainController',['authenticationService',
  function(authenticationService) {
    console.log('main controller',authenticationService);
  }
]); //mainController