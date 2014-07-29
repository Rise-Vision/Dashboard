'use strict';

/*
* githubQueryService: handles data retrieval from github
*/

angular.module('dashboard')
.factory('githubQueryService', ['$http','API_ROOT','$q','queryHelpersService',
 function($http,API_ROOT,$q,queryHelpersService) {
  var service = {};

  //gets the complete list of repositories associated with RiseVision
  service.getStats = function() {
    var deferred = $q.defer();

    $http.get(API_ROOT + '/query/github/getStats',{timeout:45000})
    .then(function(result){
      deferred.resolve(result.data);
    })
    .then(null,deferred.reject);

    return deferred.promise;
  };

  //get a chartable array of releases per day starting at the date of the first release
  service.getDailyReleases = function() {
    var deferred = $q.defer();
    $http.get(API_ROOT + '/query/github/getReleasesByDay',{timeout:45000})
    .then(function(result){
      var todayCount = 0
      , yesterdayCount = 0
      , last7DaysCount = 0

      , thisMonthCount = 0
      , lastMonthCount = 0
      , previousMonthCount = 0

      , last3MonthsCount = 0
      , previous3MonthsCount = 0 //3month period before current one

      , last12MonthsCount = 0
      , previous12MonthsCount = 0 //12 month period before current one

      , totalCount = 0;

      var today = new Date();
      var yesterday = new Date();yesterday.setDate(yesterday.getDate() -1);
      var sevenDaysAgo = new Date();sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);sevenDaysAgo.setHours(0);sevenDaysAgo.setMinutes(0);sevenDaysAgo.setSeconds(0);sevenDaysAgo.setMilliseconds(0);
      var releases = _.map(result.data,
                              function(item){
                                 var result =  {
                                    x : queryHelpersService.parseSlashDate(item.x),
                                    y : parseInt(item.y)
                                  };

                                  //SR note: while bigquery will only return only return 1 record per day, for unit testing simplisty purposes, there may be more than 1 entry
                                  if( result.x.getFullYear() === today.getFullYear() &&
                                      result.x.getMonth() === today.getMonth() &&
                                      result.x.getDate() === today.getDate()) {
                                    todayCount += result.y;
                                  } else if (result.x.getFullYear() === yesterday.getFullYear() &&
                                              result.x.getMonth() === yesterday.getMonth() &&
                                              result.x.getDate() === yesterday.getDate()){
                                    yesterdayCount += result.y;
                                  }

                                  if(result.x >= sevenDaysAgo){
                                    last7DaysCount += result.y;
                                  }

                                  if(queryHelpersService.isDateWithinMonth(result.x,0)){
                                    thisMonthCount += result.y;
                                  }
                                  if(queryHelpersService.isDateWithinMonth(result.x,1)){
                                    lastMonthCount += result.y;
                                  }else if (queryHelpersService.isDateWithinMonth(result.x,2) ){
                                    previousMonthCount += result.y;
                                  }

                                  //do not include current month
                                  if(queryHelpersService.isDateWithinMonths(result.x,1,4)) {
                                    last3MonthsCount += result.y;
                                  }else if (queryHelpersService.isDateWithinMonths(result.x,5,8)){
                                    previous3MonthsCount += result.y;
                                  }

                                  //do not include current month
                                  if(queryHelpersService.isDateWithinMonths(result.x,1,13)) {
                                    last12MonthsCount += result.y;
                                  }else if(queryHelpersService.isDateWithinMonths(result.x,14,26)) {
                                    previous12MonthsCount += result.y;
                                  }

                                  totalCount += result.y;

                                  return result;
                              });
      var averageReleases = queryHelpersService.calculateNormalizedValues(releases,30);

      deferred.resolve({
        byDay :[
          { key : "Actual", values : releases },
          { key : "Average", values : averageReleases }
        ],
        today : todayCount,
        yesterday : yesterdayCount,
        last7Days : last7DaysCount,
        total : totalCount,
        thisMonth : (thisMonthCount - lastMonthCount) / lastMonthCount  * 100,
        lastMonth : (lastMonthCount - previousMonthCount) / previousMonthCount  * 100 ,
        last3Months : (last3MonthsCount - previous3MonthsCount)/ previous3MonthsCount * 100,
        last12Months : (last12MonthsCount - previous12MonthsCount) / previous12MonthsCount * 100
      });
    })
    .then(null,deferred.reject);

    return deferred.promise;
  };
  return service;
}]);