

'use strict';

/*
* gooddataQueryService: handles queries through our proxy to Gooddata
*/

angular.module('dashboard')
.factory('gooddataQueryService', ['$q','$http','API_ROOT',
  function($q,$http,API_ROOT) {
    var service = {};

    //query our proxy server for the gooddata dataset
    //the result is expected to be a dual column csv in the form: "date","float"
    var queryAPI = function (urlPath, key) {
      var deferred = $q.defer();

      $http.get(API_ROOT + '/query/gooddata/' + urlPath)
      .then(function(result){
        var csvArray = result.data.split('\n');
        var jsonResult = [];
        for(var i = 1; i < csvArray.length; i++){
          var row = csvArray[i].split(',');
          if(row.length < 2){
            continue;
          }
          jsonResult.push({
            x: new Date(row[0]),
            //since gooddata gives this as a string in css, we need to strip out the extra "" at the begining and end
            y: Math.round(parseFloat(row[1].substr(1,row[1].length-2)) )
          });
        }
        deferred.resolve([{key:key,values:jsonResult}]);
      })
      .then(null,function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    };

    service.getZendeskResponseTimeForLineGraph = function() {
      return queryAPI('getZenDeskResponseTime','Avg Response Time (mins)');
    };

    service.getAverageTopicResponseTimesPerDay = function() {
     return queryAPI('getAverageTopicResponseTimesPerDay','Avg First Reply (mins)');
    };
    
    service.getFullResolutionTimesPerMonth = function() {
      var deferred = $q.defer();

      $http.get(API_ROOT + '/query/gooddata/getFullResolutionTimesPerMonth')
      .then(function(result){
        var csvArray = result.data.split('\n');
        var jsonResult = [];
        for(var i = 1; i < csvArray.length; i++){
          var row = csvArray[i].split(',');
          if(row.length < 2){
            continue;
          }
          jsonResult.push({
            x: service.AwesomeMonthDateParser(row[0]),
            //since gooddata gives this as a string in css, we need to strip out the extra "" at the begining and end
            y: Math.round(parseFloat(row[1].substr(1,row[1].length-2)) )
          });
        }
        deferred.resolve([{key:'Avg Resolution (hrs)',values:jsonResult}]);
      })
      .then(null,function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    };

    //transforms the short month name to a JS date object
    //assuming last 12 months
    //note: this is exposed for unit testing purposes
    service.AwesomeMonthDateParser = function(shortMonth, now) {
      if(typeof now === 'undefined' || !now){
        now = new Date();
      }
      var shortMonthNames = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ];
      var currentYear = now.getFullYear();
      var year = now.getMonth() >= shortMonthNames.indexOf(shortMonth.toLowerCase()) ? currentYear : currentYear - 1;
      return new Date(shortMonth +' 1 ' + year);
    };

    return service;
  }]);