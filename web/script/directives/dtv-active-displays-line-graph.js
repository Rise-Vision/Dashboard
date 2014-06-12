'use strict';
/*global nv:false */
/*global d3:false */

angular.module('dashboard')
  .directive('activeDisplaysLineGraph', ['googleBigQueryService',
    function(googleBigQueryService){
     return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/active-displays-line-graph.html',
      link: function (scope) {   
            scope.showSpinner = true;   
             googleBigQueryService.getActiveDisplaysForLineChart()
              .then(function(result){
                result[0].color = "#45B864";
                result[1].color = "#2D60AD";

                nv.addGraph(function() {  
                  var chart = nv.models.lineChart()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .useInteractiveGuideline(true)
                                .options({
                                  margin: {left: 100, bottom: 100,right:50},
                                  showXAxis: true,
                                  showYAxis: true,
                                  transitionDuration: 250
                                });
                  // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly,

                  chart.xAxis
                  .axisLabel('Date')
                  .tickFormat(function (d) {
                    return d3.time.format("%d-%m-%y")(new Date(d));
                  });
                  chart.yAxis
                    .axisLabel('Displays')
                    .tickFormat(d3.format(',.i'));

                  d3.select('#chart')
                    .datum(result)
                    .call(chart);

                  nv.utils.windowResize(chart.update);

                    return chart;
                  });//addGraph
              })//THEN
              .then(null,function(error){
                console.error(error);
                scope.errorMessage = 'Failed to Load. See Console For More Details';
              })
              .finally(function(){
                scope.showSpinner = false;
              });//getActiveDisplaysForLineChart      
            }//LINK
    };//return
  }]);//directive