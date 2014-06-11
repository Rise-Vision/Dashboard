/*
* localStorageService: handles localstorage (mainly for unit testing purposes)
*/

angular.module('dashboard')
.factory('localStorageService', [ function() {
  var service = {};

  service.get = function(key){
    var val = localStorage.getItem(key);
    if (!val) {
      return null;
    }

    if (val.indexOf('[') >= 0  || val.indexOf('{') >= 0) {
      return JSON.parse(val);
    }
    else {
      return val;
    }
  };

  service.set = function(key, val){
    if (angular.isArray(val) || angular.isObject(val)) {
      val = JSON.stringify(val);
    }
    localStorage.setItem(key, val);
  };

  service.remove = function(key){
    localStorage.removeItem(key);
  };

  return service;
}]);