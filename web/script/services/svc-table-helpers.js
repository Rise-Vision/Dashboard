'use strict';

/*
* tableHelperService: handles functions for large tables
*/

angular.module('dashboard')
.factory('tableHelperService', [
  function() {
  var service = {};

  service.applyPagination = function(page,pages,pageSize,data) {
    var pageRows = []
      , rowsToTake = page < (pages-1) ? pageSize : data.length % pageSize;
    for(var i = 0; i < rowsToTake; i++){
      pageRows.push(data[(page * pageSize) + i]);
    }
    return pageRows;
  };

  service.orderBy = function(key,orderByField,data) {
    //todo
    if(key !== orderByField){
      var splitKey = key.split('.');
      if(splitKey.length === 1){
        data = _.sortBy(data,key);
      }else if(splitKey.length === 2) {
        data = _.sortBy(data,
          function(row) {
           return row[splitKey[0]][splitKey[1]] ? row[splitKey[0]][splitKey[1]] : 0;
        });
      }
    }
    data.reverse();
    return data;
  };//orderBy

  //sum the displays column for the given date
  service.sumDisplayColumn = function(date,data) {
    var sum = 0;
    _.forEach(data,function(row){
      var value = row.displays[date];
      if(typeof value === 'number'){
        sum += value;
      }
    });
    return sum;
  };//sumDisplayColumn

  return service;

}]);//tableHelperService