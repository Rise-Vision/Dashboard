"use strict";

angular.module('dashboard')
  .directive('activeDisplaysHeatMap', ['googleBigQueryService',
    function(googleBigQueryService){
      return {
      restrict: 'E',
      scope: {
        'ngModel': '=',
      },
      templateUrl: 'view/active-displays-heat-map.html',
      link: function (scope, element, attrs) {
        console.log('activeDisplaysHeatMap',googleBigQueryService,scope, element, attrs);
      }
    };
  }]);