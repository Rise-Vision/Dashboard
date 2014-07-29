"use strict";
/*global google:false */
/*global MarkerClusterer:false */

angular.module('dashboard')
  .directive('activeDisplaysHeatMap', ['googleBigQueryService','markerClusterService','commonMetricService','$timeout',
    function(googleBigQueryService,markerClusterService,commonMetricService, $timeout){
      return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/active-displays-heat-map.html',
      link: function (scope) {
        scope.showSpinner = true;
        scope.id = commonMetricService.generateChartId('activeDisplaysMap');
        var map, mapOptions = {
          center: new google.maps.LatLng(30.775646, -25.820313),
          zoom: 2,
          mapTypeControl : false,
          streetViewControl : false,
          mapTypeControlOptions : false,
          scrollwheel : false
        };

        //let the html render first, and then go and get our element for the map
        $timeout(function(){
          map = new google.maps.Map(document.getElementById(scope.id), mapOptions);
        },0);

        googleBigQueryService.getActiveDisplaysForMap()
        .then(function(result){
          var markers = [];
          angular.forEach(result,function(item){
            var marker = new google.maps.Marker(
                              {
                                position: new google.maps.LatLng(item.lat,item.lng),
                                title:item.id
                              });
            markers.push(marker);
          });
          var markerCluster = new MarkerClusterer(map, markers);

          markerCluster.setCalculator(markerClusterService.getClusterCalculator());
          markerCluster.setMinimumClusterSize(1);
        })
        .then(null,function(error){
          console.error(error);
          scope.errorMessage = commonMetricService.generateErrorMessage(error);
        })
        .finally(function(){
          scope.showSpinner = false;
        });//getActiveDisplaysForLineChart

        scope.allowScroll = function(){
          if(!mapOptions.scrollwheel){
            mapOptions.scrollwheel = true;
            map.setOptions(mapOptions);
          }
        };

      }
    };
  }]);