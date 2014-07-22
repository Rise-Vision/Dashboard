/*global _:false */

"use strict";

angular.module('dashboard')
  .directive('githubStatsTable', ['githubQueryService','commonMetricService',
    function(githubQueryService,commonMetricService){
      return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/github-stats-table.html',
      link: function (scope) {
        scope.showSpinner = true; 
        scope.exposures = [
          {displayName : 'All', filter:{}},
          {displayName : 'Open Source', filter:{isPrivate:false}},
          {displayName : 'Private', filter:{isPrivate:true}}
        ];
        scope.exposure = _.first(scope.exposures);
        scope.orderByField = 'name';
        scope.reverseSort = false; 
        //scope.intToShortAgoMonth = commonMetricService.intToShortAgoMonth;

        githubQueryService.getStats()
        .then(function(result){
          scope.timelines = _.first(result).timelines;
          scope.selectedTimeline = _.first(scope.timelines);
          scope.data = result;
        })
        .then(null,function(error){
          console.error(error);
          scope.errorMessage = commonMetricService.generateErrorMessage(error);
        })
        .finally(function(){
          scope.showSpinner = false;
        });//getStatsTable    
      }
    };
  }])//githubStatsTable
.filter('sumByKey', function () {
    return function (data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
          return 0;
        }
        var splitKey = key.split('.')
        , sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
          var value  = data[i];
          for (var x = 0; x < splitKey.length; x ++){
            value = value[splitKey[x]];
          }
          var intVal = parseInt(value);
          if(!isNaN(intVal)){
            sum += intVal;
          }
        }

        return sum;
    };
});