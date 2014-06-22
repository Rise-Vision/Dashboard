'use strict';
/*global _:false */

/*
* googleBigQueryService: handles data retrieval from Google Big Query Service
*/

angular.module('dashboard')
.factory('googleBigQueryService', ['$q','$http','API_ROOT', function($q,$http,API_ROOT) {
  var service = {};

  //Query for the data points for the 'Active Display 30 Days Map' metric
  //returns a promise that resolves to the query result
  service.getActiveDisplaysForMap = function() {
    var deferred = $q.defer();

    $http.get(API_ROOT+'/query/googleBigQuery/getActiveDisplaysForMap',{timeout:45000})
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
    
   $http.get(API_ROOT+'/query/googleBigQuery/getActiveDisplaysForLineChart',{timeout:20000})
       .then(function(response){
          var result = response.data;
          if(result.error|| !result.jobComplete){
            deferred.reject(result.error || 'big query job failed to complete');
            return;
          }
          try{
              var displays = [],
                  normalizedDisplays = [];
              displays = _.map(result.rows,
                                function(item){
                                  return { 
                                    x : new Date(item.f[0].v),
                                    y : Math.round(parseInt(item.f[1].v))
                                  };
                                });
              
              //calculate the normalized daily active displays over 30 days
              var displaysLength = displays.length;
              for(var i=0; i < displaysLength; i++ ) {
                var past30 = 0;
                for(var j = i; (j >= 0) && (j > i - 30); j--) {
                  past30 += displays[j].y;
                }//for j

                normalizedDisplays.push({ x : displays[i].x,
                                          y : Math.round(past30/Math.min(30,i+1))});
              }//for i

              deferred.resolve([{ key : "Actual", values : displays },
                                { key : "Average", values : normalizedDisplays }]);
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