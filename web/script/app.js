'use strict';

// Create a module for our core Store services
angular.module('dashboard', ['ngRoute'])
.run(function () { 
   // console.log('started');
})
.constant('API_ROOT','http://devtools1.risevision.com:5000/api')
.config(function($routeProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'view/main.html',
    //controller: 'mainController'
  });
});