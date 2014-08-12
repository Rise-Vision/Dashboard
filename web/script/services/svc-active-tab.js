
angular.module('dashboard')
.factory('activeTabService', ['$location' ,function($location) {
  return function(tabName){
    return ($location.path().toLowerCase() === tabName.toLowerCase());
  };
}]);