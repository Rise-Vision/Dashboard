'use strict';
/*global nv:false */
/*global d3:false */

angular.module('dashboard')
  .directive('activeDisplaysLineGraph', ['googleBigQueryService','commonMetricService',
    function(googleBigQueryService,commonMetricService){
     return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/common-line-chart.html',
      link: function (scope) {
            scope.title = 'Active Displays';
            scope.id = commonMetricService.generateChartId('activeDisplaysLineChart');
            scope.showSpinner = true;   
             googleBigQueryService.getActiveDisplaysForLineChart()
              .then(function(result){
                var colours = commonMetricService.getChartColours();
                result[0].color = colours[0];
                result[1].color = colours[1];

                nv.addGraph(function() {  
                  var chart = nv.models.lineChart()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .useInteractiveGuideline(true)
                                .options(commonMetricService.getCommonChartOptions());
                                
    
                  chart.xAxis
                   .tickFormat(commonMetricService.dateD3Format);

                  chart.yAxis
                    .axisLabel('Displays')
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