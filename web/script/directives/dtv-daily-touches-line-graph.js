'use strict';
/*global nv:false */
/*global d3:false */

angular.module('dashboard')
  .directive('dailyTouchesLineGraph', ['gooddataQueryService','commonMetricService',
    function(gooddataQueryService,commonMetricService){
     return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/common-line-chart.html',
      link: function (scope) {   
            scope.title = 'Touch Index';
            scope.id = commonMetricService.generateChartId('dailyTouchesLineGraph');
            scope.showSpinner = true;  
             gooddataQueryService.getTouchesByDay()
              .then(function(result){
                var colours = commonMetricService.getChartColours();
                for(var i = 0; i < 3; i++) {
                  result[i].color = colours[i];
                  result[i].data = result[i].values;
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
                    .axisLabel('Touches')
                    .tickFormat(d3.format(',.f.2'));

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