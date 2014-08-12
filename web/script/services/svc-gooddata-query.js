

'use strict';
/*global _:false */

/*
* gooddataQueryService: handles queries through our proxy to Gooddata
*/

angular.module('dashboard')
.factory('gooddataQueryService', ['$q','$http','API_ROOT','queryHelpersService','googleBigQueryService',
  function($q,$http,API_ROOT,queryHelpersService,googleBigQueryService) {
    var service = {};

    //query our proxy server for the gooddata dataset
    //the result is expected to be a dual column csv in the form: "date","float"
    var queryAPI = function (urlPath, key, expectShortMonth) {
      var deferred = $q.defer();

      $http.get(API_ROOT + '/query/gooddata/' + urlPath,{cache:true})
      .then(function(result) {
        //since gooddata gives the values as a string in csv, we need to strip out the extra "" at the begining and end using split
        if(typeof result.data !== 'string'){
          throw new Error('Gooddata API failed to return data in csv');
        }

        var csvArray = result.data.split('"\n"');
        var jsonResult = [];
        for(var i = 1; i < csvArray.length; i++){
          var row = csvArray[i].split('","');
          if(row.length < 2){
            continue;
          }
          jsonResult.push({
            x: expectShortMonth ? queryHelpersService.awesomeMonthDateParser(row[0]) : new Date(row[0]),
            y: Math.round(parseFloat(row[1]))
          });
        }
        deferred.resolve([{ key : key, values : _.sortBy(jsonResult,'x') }]);
      })
      .then(null,function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    };

    service.getZendeskResponseTimeForLineGraph = function() {
      return queryAPI('getZenDeskResponseTime','Zendesk');
    };

    service.getAverageTopicResponseTimesPerDay = function() {
     return queryAPI('getAverageTopicResponseTimesPerDay','Community');
    };

    service.getFullResolutionTimesPerMonth = function() {
      return queryAPI('getFullResolutionTimesPerMonth','Avg Resolution (hrs)');
    };

   service.getTouchesByDay = function() {
      var deferred = $q.defer();

      $q.all([queryAPI('getZenDeskTouchesByDay','ZD Touches'),
              queryAPI('getGetSatisfactionTouchesByDay','GS touches'),
              googleBigQueryService.getActiveDisplaysForLineChart(true/*dont include normalized calcution*/)])
        .then(function(results){
          var zdResult = results[0][0].values
            , gsResult = results[1][0].values
            , avgActiveDisplaysByDay = queryHelpersService.mapDateToValue(results[2].byDay[1].values,true);

          //calculate the combined ZD and GS touches
          var combinedTouches = queryHelpersService.combineIntoArray(queryHelpersService.mapDateToValue(zdResult),queryHelpersService.mapDateToValue(gsResult));

          var divideByActiveDiplays = function(val) {
            var displays = avgActiveDisplaysByDay[val.x.toDateString()];
            return { x : val.x, y : (typeof displays === 'undefined'|| !displays|| displays <= 0)? 0 : Math.round((val.y / displays * 1000) * 100) / 100};
          };
          //calculate the average touches for the pass 60 days (normalize over 60days)
          //and then divide by the number of active displays for
           var normCount = 60 //days
            , normZDTouchesOverDisplays = _.map(queryHelpersService.calculateNormalizedValues(zdResult, normCount), divideByActiveDiplays)
            , normGSTouchesOverDisplays = _.map(queryHelpersService.calculateNormalizedValues(gsResult, normCount), divideByActiveDiplays)
            , normCombinedTouchesOverDisplays = _.map(queryHelpersService.calculateNormalizedValues(combinedTouches,normCount), divideByActiveDiplays);
          deferred.resolve([
                            { key : 'Combined', values : normCombinedTouchesOverDisplays },
                            { key : 'Zendesk', values : normZDTouchesOverDisplays },
                            { key : 'GetSatisfaction', values : normGSTouchesOverDisplays }
                           ]);
        })
        .then(null,function(error){
          deferred.reject(error);
        });

      return deferred.promise;
    };






    return service;
  }]);