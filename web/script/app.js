'use strict';

// Create a module for our core Store services
angular.module('dashboard', ['ngRoute','gapi'])
.run(function () { 
   // console.log('started');
})

.config(function($routeProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'view/main.html',
    //controller: 'mainController'
  });
});