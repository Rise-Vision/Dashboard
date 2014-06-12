"use strict";

angular.module('dashboard')
  .directive('activeDisplaysHeatMap', ['googleBigQueryService',
    function(googleBigQueryService){
      return {
      restrict: 'A',
      scope: {
        'ngModel': '=',
      },
      templateUrl: 'view/active-displays-heat-map.html',
      link: function (scope, element, attrs) {
        console.log(googleBigQueryService,scope, element, attrs);
      }
    };
  }]);