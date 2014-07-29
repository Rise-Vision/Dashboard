'use strict';
/*global nv:false */
/*global d3:false */

angular.module('dashboard')
  .directive('zendeskResolutionTimeLineGraph', ['gooddataQueryService','commonMetricService',
    function(gooddataQueryService,commonMetricService){
     return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/common-line-chart.html',
      link: function (scope) {
            scope.title = 'Zendesk Resolution Time';
            scope.id = commonMetricService.generateChartId('zendeskResolutionTimeChart');
            scope.showSpinner = true;
             gooddataQueryService.getFullResolutionTimesPerMonth()
              .then(function(result){
                result[0].color = "#2D60AD";

                nv.addGraph(function() {
                  var chart = nv.models.lineChart()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .useInteractiveGuideline(true)
                                .options(commonMetricService.getCommonChartOptions());

                  chart.xAxis
                   .tickFormat(commonMetricService.dateD3Format);

                  chart.yAxis
                    .axisLabel('Hours')
                    .tickFormat(d3.format(',.i'));

                  d3.select('#'+scope.id)
                    .datum(result)
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