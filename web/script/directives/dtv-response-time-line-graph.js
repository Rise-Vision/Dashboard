'use strict';
/*global nv:false */
/*global d3:false */

angular.module('dashboard')
  .directive('responseTimeLineGraph', ['gooddataQueryService','commonMetricService', '$q',
    function(gooddataQueryService,commonMetricService,$q){
     return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/common-line-chart.html',
      link: function (scope) {   
            scope.title = 'Average Response Time';
            scope.id = commonMetricService.generateChartId('ResponseTimeChart');
            scope.showSpinner = true; 
            $q.all([
                     gooddataQueryService.getAverageTopicResponseTimesPerDay(),
                     gooddataQueryService.getZendeskResponseTimeForLineGraph()
              ]) 
              .then(function(results){
                var dataSet = _.flatten(results,true);
                var colours = commonMetricService.getChartColours();
                for(var i = 0; i < dataSet.length; i++){
                  dataSet[i].color = colours[i];                  
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
                    .axisLabel('Minutes')
                    .tickFormat(d3.format(',.i'));

                  d3.select('#'+scope.id)
                    .datum(dataSet)
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