'use strict';

/*
 * commonMetricService: handles shared functionality between the line charts
 */

angular.module('dashboard')
.factory('commonMetricService',[function(){
  return {
    //Generates a relatively unique id for the chart's canvas for d3 to find
    generateChartId : function(chartName){
      return chartName + '_' + Math.floor((Math.random() * 10000000) + 1);
    },
    //generic error message generator for charts
    generateErrorMessage : function(error){
      var message = 'Failed To Load Metric';
      if(error.status === 0){
        message +=' ( Request Timed Out )';
      } else if (error.data){
        message +=' ( '+error.data.toString()+' )';
      } else if (typeof error === 'string'){
        message +=' ( '+error+' )';
      }

      return message;
    }
  };
}]);