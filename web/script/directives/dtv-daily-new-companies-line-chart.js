'use strict';
/*global nv:false */
/*global d3:false */

angular.module('dashboard')
  .directive('dailyNewCompaniesLineChart', ['googleBigQueryService','commonMetricService',
    function(googleBigQueryService,commonMetricService){
     return {
      restrict: 'E',
      scope: {},
      /*TODO need new template to include the additional stats*/
      templateUrl: 'view/new-companies.html',
      link: function (scope) {
            scope.title = 'New Companies';
            scope.id = commonMetricService.generateChartId('dailyNewCompaniesLineChart');
            scope.showSpinner = true;   
             googleBigQueryService.getNewCompaniesByDay()
              .then(function(result){
                scope.growthStats = {
                  today : result.today,
                  yesterday : result.yesterday,
                  thisMonth : Math.round(result.thisMonth),
                  lastMonth : Math.round(result.lastMonth),
                  last3Months : Math.round(result.last3Months),
                  last12Months : Math.round(result.last12Months)
                };
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
                    .axisLabel('Signups')
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