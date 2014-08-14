'use strict';
/*global nv:false */
/*global d3:false */

angular.module('dashboard')
  .directive('lineGraphWithStats', ['googleBigQueryService','commonMetricService','githubQueryService','$q',
    function(googleBigQueryService,commonMetricService,githubQueryService,$q){
     return {
      restrict: 'E',
      scope: { graph : '=graph'},
      templateUrl: 'view/line-chart-with-growth-stats.html',
      link: function (scope) {
        var query, growthStatsTitle,yAxisLabel;
        switch(scope.graph){
          case 'Active Displays':
            scope.id = commonMetricService.generateChartId('activeDisplaysLineChart');
            query = googleBigQueryService.getActiveDisplaysForLineChart;
            growthStatsTitle = 'Displays Growth';
            yAxisLabel = 'Displays';
            break;
          case 'Active Companies':
            scope.id = commonMetricService.generateChartId('dailyActiveCompaniesLineChart');
            query = googleBigQueryService.getActiveCompaniesByDay;
            growthStatsTitle = 'Active Companies Growth';
            yAxisLabel = 'Companies';
            break;
          case 'New Companies':
            scope.id = commonMetricService.generateChartId('dailyNewCompaniesLineChart');
            query = googleBigQueryService.getNewCompaniesByDay;
            growthStatsTitle = 'Signups';
            yAxisLabel = 'Signups';
            break;
          case 'Releases':
            scope.id = commonMetricService.generateChartId('dailyReleasesLineChart');
            query = githubQueryService.getDailyReleases;
            growthStatsTitle = 'Releases';
            yAxisLabel = 'Releases';
          break;
          default:
            query = function(){
              return $q.reject('Unknown graph: '+scope.graph);
            };
          break;
        }//switch

        scope.title = scope.graph;

        scope.showSpinner = true;
        query()
        .then(function(result){
          scope.growthStats = commonMetricService.generateGrowthStats(growthStatsTitle,result);

          var colours = commonMetricService.getChartColours();
          for(var i = 0; i < result.byDay.length; i++){
            result.byDay[i].color = colours[i];
          }

          nv.addGraph(function() {
            var chart = nv.models.lineChart()
                          .x(function (d) { return d.x; })
                          .y(function (d) { return d.y; })
                          .useInteractiveGuideline(true)
                          .options(commonMetricService.getCommonChartOptions());


            chart.xAxis
             .tickFormat(commonMetricService.dateD3Format);

            chart.yAxis
              .axisLabel(yAxisLabel)
              .tickFormat(d3.format(',.i'));
            d3.select('#'+scope.id)
              .datum(result.byDay)
              .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
          });//addGraph
        })//THEN
        .then(null,function(error){
          console.error(error);
          scope.errorMessage = commonMetricService.generateErrorMessage(error);
        })
        .finally(function(){
          scope.showSpinner = false;
        });//query
      }//LINK
    };//return
  }]);//directive