angular.module('dashboard')
.factory('markerClusterService', [ function() {
  return {
    getClusterCalculator : function(){
      return function (markers) {
                var index = 0;
                var title = "";
                var count = markers.length;

                if(count < 50){
                  index = 0;
                }else if(count <= 100){
                  index = 1;
                }else if (count <= 200){
                  index = 2;
                }else if(count <= 500){
                  index = 3;
                }else{
                  index = 4;
                }

                return {
                    text: count,
                    index: index,
                    title: title
                };
            };
    }
  };//return
}]);//factory markerClusterService