angular.module('dashboard')
.filter('sumByKey', function () {
    return function (data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
          return 0;
        }
        var splitKey = key.split('.')
        , sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
          var value  = data[i];
          for (var x = 0; x < splitKey.length; x ++){
            value = value[splitKey[x]];
          }
          var intVal = parseInt(value);
          if(!isNaN(intVal)){
            sum += intVal;
          }
        }

        return sum;
    };
});