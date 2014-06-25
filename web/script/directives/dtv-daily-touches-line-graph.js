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
                result[0].color = "#2D60AD";
                result[1].color = "#62FF0D";
                result[2].color = "#E5AFE8";

                nv.addGraph(function() {  
                  var chart = nv.models.lineChart()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .useInteractiveGuideline(true)
                                .options({
                                  margin: {left: 74, bottom: 50,right:50},
                                  showXAxis: true,
                                  showYAxis: true,
                                  transitionDuration: 250                                  
                                });

                  chart.xAxis
                  .axisLabel('Date')
                  .tickFormat(function (d) {
                    return d3.time.format("%d-%m-%y")(new Date(d));
                  });
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