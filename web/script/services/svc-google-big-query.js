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
  service.getActiveDisplaysForMap = function() {
    var deferred = $q.defer();

    bigQueryAPILoader.get()
      .then(function (bigquery) {
         bigquery.jobs.query(
          {
            projectId : 'rise-core-log',
            /* jshint ignore:start */            
            query : "SELECT a.displayId, NTH(1, latitude) lat, NTH(1, longitude) lng FROM (select A.displayId,  INTEGER(PARSE_IP(A.ip)) as ip,   INTEGER(PARSE_IP(A.ip)/(256*256)) as classB from (select displayId, startTime, ip from [coreLog.displayRequests] where appId='s~rvaserver2') as A join (select displayId, max(startTime) as maxTime from [coreLog.displayRequests] where appId='s~rvaserver2' and startTime >= DATE_ADD(CURRENT_DATE(), -29, 'DAY') group by displayId) as B on A.displayId = B.displayId and A.startTime = B.maxTime group by A.displayId, ip, classB order by 1 ) AS a JOIN EACH [fh-bigquery:geocode.geolite_city_bq_b2b] AS b ON a.classB = b.classB WHERE a.ip BETWEEN b.startIpNum AND b.endIpNum AND city != '' GROUP BY countryLabel, a.displayId ORDER BY 1 DESC",
            /* jshint ignore:end */
            useQueryCache : true,
            timeoutMs : 45000 //45 seconds
          })         
          .execute(function (result) {
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
          });//EXECUTE
        });//THEN GET
    return deferred.promise;
  };//getActiveDisplaysForMap

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
            query : "select date, count(distinct displayId, 1000000) from (select DATE(startTime) as date, displayId from [coreLog.displayRequests] where appId='s~rvaserver2') group by date order by date",
            /* jshint ignore:end */
            useQueryCache : true,
            timeoutMs : 20000 //20 seconds
          })         
          .execute(function (result) {
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
                                      y : parseInt(item.f[1].v)
                                    };
                                  });
                
                //calculate the normalized daily active displays over 30 days
                var displaysLength = displays.length;
                for(var i=0; i < displaysLength; i++ ) {
                  var past30 = 0;
                  var j=i;
                  for(; (j >= 0) && (j > i - 30); j--) {
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
          });//REQUEST EXE
      });//GET THEN
  
    
    return deferred.promise;
  };

  return service;
}]);