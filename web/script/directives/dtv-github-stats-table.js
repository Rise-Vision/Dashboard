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
  }]);//githubStatsTable
