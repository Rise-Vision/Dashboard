'use strict';
/*global nv:false */
/*global d3:false */

angular.module('dashboard')
  .directive('dailyActiveCompaniesLineChart', ['googleBigQueryService','commonMetricService',
    function(googleBigQueryService,commonMetricService){
     return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/line-chart-with-growth-stats.html',
      link: function (scope) {
            scope.title = 'Active Companies';
            scope.id = commonMetricService.generateChartId('dailyActiveCompaniesLineChart');
            scope.showSpinner = true;
            googleBigQueryService.getActiveCompaniesByDay()
              .then(function(result){
                scope.growthStats = commonMetricService.generateGrowthStats('Active Companies Growth',result);

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
                    .axisLabel('Companies')
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
              });//getActiveDisplaysForLineChart
            }//LINK
    };//return
  }]);//directive