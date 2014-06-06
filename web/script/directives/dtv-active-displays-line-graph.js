'use strict';

angular.module('dashboard')
  .directive('activeDisplaysLineGraph', ['googleBigQueryService',
    function(googleBigQueryService){
      return {
      restrict: 'E',
      scope: {
        'ngModel': '=',
      },
      templateUrl: 'view/active-displays-line-graph.html',
      link: function (scope, element, attrs) {
        console.log('activeDisplaysLineGraph',googleBigQueryService,scope, element, attrs);
      }
    };
  }]);