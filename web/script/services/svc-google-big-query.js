'use strict';
/*global _:false */

/*
* googleBigQueryService: handles data retrieval from Google Big Query Service
*/

angular.module('dashboard')
.factory('googleBigQueryService', ['$q','$http','API_ROOT','queryHelpersService',
 function($q,$http,API_ROOT,queryHelpersService) {
  var service = {};

  //Query for the data points for the 'Active Display 30 Days Map' metric
  //returns a promise that resolves to the query result
  service.getActiveDisplaysForMap = function() {
    var deferred = $q.defer();

    $http.get(API_ROOT+'/query/googleBigQuery/getActiveDisplaysForMap',{timeout:60000})
      .then(function(response){
        var result = response.data;
        if(result.error || !result.jobComplete){
          deferred.reject(result.error || 'big query job failed to complete');
          return;
        }
        try{
          deferred.resolve(_.map(result.rows,function(row) {
              return {
                id : row.f[0].v,
                lat : row.f[1].v,
                lng : row.f[2].v 
              };
            }
          ));
        }catch(e){
          deferred.reject(e);
        }
      })
      .then(null,function(error){
        deferred.reject(error);
      });

    return deferred.promise;
  };//getActiveDisplaysForMap

  //Query for the data points for 'Active Displays per Day' metric
  //returns a promise that resolves to the query result for display
  service.getActiveDisplaysForLineChart = function(){
    var deferred = $q.defer();
    
   $http.get(API_ROOT+'/query/googleBigQuery/getActiveDisplaysForLineChart',{timeout:60000})
       .then(function(response){
          var result = response.data;
          if(result.error|| !result.jobComplete){
            deferred.reject(result.error || 'big query job failed to complete');
            return;
          }
          try {
              
            var displays = _.map(result.rows,
                              function(item){
                                 return { 
                                    x : queryHelpersService.parseSlashDate(item.f[0].v),
                                    y : Math.round(parseInt(item.f[1].v))
                                  };
                              });

            deferred.resolve([{ key : "Actual", values : displays },
                              { key : "Average", values : queryHelpersService.calculateNormalizedValues(displays,30) }]);
          }catch(e){
            deferred.reject(e);
          }
       })
      .then(null,function(error){
        deferred.reject(error);
      });
   return deferred.promise;

    
  };

  return service;
}]);