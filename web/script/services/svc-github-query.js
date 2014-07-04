'use strict';

/*
* githubQueryService: handles data retrieval from github
*/

angular.module('dashboard')
.factory('githubQueryService', ['$http','API_ROOT','$q',
 function($http,API_ROOT,$q) {
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
  return service;
}]);