'use strict';
/*global nv:false */
/*global d3:false */

angular.module('dashboard')
  .directive('zendeskResponseTimeLineGraph', ['gooddataQueryService',
    function(gooddataQueryService){
     return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/zendesk-response-time-line-graph.html',
      link: function (scope) {   
            scope.showSpinner = true;  
             gooddataQueryService.getZendeskResponseTimeForLineGraph()
              .then(function(result){
                result[0].color = "#45B864";

                nv.addGraph(function() {  
                  var chart = nv.models.lineChart()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .useInteractiveGuideline(true)
                                .options({
                                  margin: {left: 70, bottom: 50,right:50},
                                  showXAxis: true,
                                  showYAxis: true,
                                  transitionDuration: 250                                  
                                });

                  chart.xAxis
                  .axisLabel('Month')
                  .tickFormat(function (d) {
                    return d3.time.format("%d-%m-%y")(new Date(d));
                  });
                  chart.yAxis
                    .axisLabel('mins')
                    .tickFormat(d3.format(',.i'));

                  d3.select('#zendeskResponseTimeChart')
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