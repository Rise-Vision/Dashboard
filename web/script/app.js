'use strict';

// Create a module for our core Store services
angular.module('dashboard', ['ngRoute'])
.run(function () {
   // console.log('started');
})
.constant('API_ROOT','/api')
.config(function($routeProvider) {
  $routeProvider
   .when('/', {
      redirectTo: '/displays',
    })
   .when('/displays',{
      templateUrl: 'view/displays.html',caseInsensitiveMatch: true
   })
   .when('/software',{
      templateUrl: 'view/software.html',caseInsensitiveMatch: true
   })
   .when('/companies',{
      templateUrl: 'view/companies.html',caseInsensitiveMatch: true
   })
   .when('/support',{
      templateUrl: 'view/support.html',caseInsensitiveMatch: true
   })
   ;
});