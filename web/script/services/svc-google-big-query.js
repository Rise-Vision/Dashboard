/*
* googleBigQueryService: handles data retrieval from Google Big Query Service
*/

angular.module('dashboard')
.factory('googleBigQueryService', ['$q', function($q) {
  var service = {};

  //Query for the data points for the 'Active Display 30 Days Map' metric
  //returns a promise that resolves to the query result
  service.getActiveDisplaysForMap = function(){
    var deferred = $q.defer();
    //TODO: make and exe query
    deferred.resolve([]);

    return deferred.promise;
  };

  //Query for the data points for 'Active Displays per Day' metric
  //returns a promise that resolves to the query result
  service.getActiveDisplaysForLineChart = function(){
    var deferred = $q.defer();
    //TODO: make and exe query
    deferred.resolve([]);

    return deferred.promise;
  };

  return service;
}]);