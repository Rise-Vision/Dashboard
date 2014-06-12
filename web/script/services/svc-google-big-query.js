'use strict';
/*global _:false */

/*
* googleBigQueryService: handles data retrieval from Google Big Query Service
*/

angular.module('dashboard')
.factory('googleBigQueryService', ['$q','bigQueryAPILoader', function($q,bigQueryAPILoader) {
  var service = {};

  //Query for the data points for the 'Active Display 30 Days Map' metric
  //returns a promise that resolves to the query result
  service.getActiveDisplaysForMap = function(){
     var deferred = $q.defer();

    deferred.resolve('TODO');
    return deferred.promise;
  };

  //Query for the data points for 'Active Displays per Day' metric
  //returns a promise that resolves to the query result for display
  service.getActiveDisplaysForLineChart = function(){
    var deferred = $q.defer();
  
    bigQueryAPILoader.get()
      .then(function (bigquery) {
         bigquery.jobs.query(
          {
            projectId : 'rise-core-log',
            /* jshint ignore:start */            
            query : "select date, count(distinct displayId, 1000000) from (select DATE(startTime) as date, displayId from [coreLog.displayRequests] where appId='s~rvaserver2') group by date order by date"
            /* jshint ignore:end */
          })         
          .execute(function (result) {
            if(result.error){
              deferred.reject(result.error);
              return;
            }
            try{
                var displays = [],
                    normalizedDisplays = [];
                displays = _.map(result.rows,
                                  function(item){
                                    return { 
                                      x : new Date(item.f[0].v),
                                      y : parseInt(item.f[1].v)
                                    };
                                  });
                
                //calculate the normalized daily active displays over 30 days
                var displaysLength = displays.length;
                for(var i=0; i < displaysLength; i++ ) {
                  var past30 = 0;
                  for(var j=i; (j < i + 30) && (j < displaysLength); j++) {
                    past30 += displays[j].y;
                  }//for j
                  normalizedDisplays.push({ x : displays[i].x,
                                            y : Math.floor(past30/Math.min(30,displaysLength-i))});
                }//for i

                deferred.resolve([{ key : "Actual", values : displays },
                                  { key : "Average", values : normalizedDisplays }]);
            }catch(e){
              deferred.reject(e);
            }
          });//REQUEST EXE
      });//GET THEN
  
    
    return deferred.promise;
  };

  return service;
}]);