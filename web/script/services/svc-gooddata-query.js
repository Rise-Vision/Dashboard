

'use strict';

/*
* gooddataQueryService: handles queries through our proxy to Gooddata
*/

angular.module('dashboard')
.factory('gooddataQueryService', ['$q','$http','API_ROOT',
  function($q,$http,API_ROOT) {
    var service = {};

    service.getZendeskResponseTimeForLineGraph = function(){
      var deferred = $q.defer();

      $http.get(API_ROOT + '/query/gooddata/getZenDeskResponseTime')
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
            y: Math.round(parseFloat(row[1].substr(1,row[1].length-2)) )//since gooddata gives this as a string in css, we need to strip out the extra "" at the begining and end
          });
        }
        deferred.resolve([{key:"Avg Response Time (mins)",values:jsonResult}]);
      })
      .then(null,function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    };

    return service;
  }]);