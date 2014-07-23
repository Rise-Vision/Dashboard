'use strict';
/*global d3:false */

/*
 * commonMetricService: handles shared functionality between the line charts directives
 */

angular.module('dashboard')
.factory('commonMetricService',[function(){
  return {
    //Generates a relatively unique id for the chart's canvas for d3 to find
    generateChartId : function(chartName){
      return chartName + '_' + Math.floor((Math.random() * 10000000000000) + 1);
    },
    //generic error message generator for charts
    generateErrorMessage : function(error){
      var message = 'Failed To Load Metric';
      if(error.status === 0){
        message +=' ( Request Timed Out )';
      } else if (error.data){
        message +=' ( ' + error.status+' '+error.data.toString()+' )';
      } else if (typeof error === 'string'){
        message +=' ( '+error.status+' '+error+' )';
      }

      return message;
    },
    //returns an array of hex colours to use for the line charts
    getChartColours : function() {
      return ["#2D60AD","#62FF0D","E5AFE8"];
    },
    //takes a number of {{monthsAgo}} from {{now}} and returns the short month name
    intToShortAgoMonth : function(monthsAgo, now) {
      if(typeof now === 'undefined'){
        now = new Date();
      }
      var shortMonthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
      now.setMonth(now.getMonth() - monthsAgo);
      return shortMonthNames[now.getMonth()];
    },
    //shared nvd3 line chart options
    getCommonChartOptions : function() {
      return {
                margin: {left: 74, bottom: 25,right:25},
                showXAxis: true,
                showYAxis: true,
                transitionDuration: 250             
              };
    },
    //common date format for nvd3 charts
    dateD3Format : function (d) {
      return d3.time.format("%d-%b-%y")(new Date(d));
    },
    //maps the growth stats and title into the common scope object for display in line-chart-with-growth-stats.html
    generateGrowthStats : function(title,result) {
      return {
                title:title,
                today : result.today,
                yesterday : result.yesterday,
                last7Days : result.last7Days,
                total : result.total,
                thisMonth :isFinite(result.thisMonth) ?  Math.round(result.thisMonth) : 'N/A',
                lastMonth : isFinite(result.lastMonth) ? Math.round(result.lastMonth) : 'N/A',
                last3Months :isFinite(result.last3Months) ?  Math.round(result.last3Months) : 'N/A',
                last12Months : isFinite(result.last12Months) ? Math.round(result.last12Months) : 'N/A'
              };
    }

  };
}]);