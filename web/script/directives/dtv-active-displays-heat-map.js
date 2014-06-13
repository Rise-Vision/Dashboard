"use strict";
/*global google:false */
/*global MarkerClusterer:false */

angular.module('dashboard')
  .directive('activeDisplaysHeatMap', ['googleBigQueryService','markerClusterService',
    function(googleBigQueryService,markerClusterService){
      return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/active-displays-heat-map.html',
      link: function (scope) {
        scope.showSpinner = true;   
        var mapOptions = {
          center: new google.maps.LatLng(30.775646, -25.820313),
          zoom: 2,
          mapTypeControl : false,
          streetViewControl : false,
          mapTypeControlOptions : false
        };
        
        var tmp = document.getElementById("map-canvas");
        
        var map = new google.maps.Map(tmp, mapOptions);
        googleBigQueryService.getActiveDisplaysForMap()
        .then(function(result){
          var markers = [];
          angular.forEach(result,function(item){
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.lat,item.lng),
                title:item.id
            });
            markers.push(marker);
          });
          var markerCluster = new MarkerClusterer(map, markers);
          
          markerCluster.setCalculator(markerClusterService.getClusterCalculator());
        })
        .then(null,function(error){
          console.error(error);
          scope.errorMessage = 'Failed to Load. See Console For More Details';
        })
        .finally(function(){
          scope.showSpinner = false;
        });//getActiveDisplaysForLineChart    
      }
    };
  }]);