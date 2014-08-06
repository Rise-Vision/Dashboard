angular.module('dashboard')
.filter('growthNumber', function () {
    return function (number,tail) {
        if (typeof number === 'undefined' || number === null || !isFinite(number)){
          return 'N/A';
        }
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return (typeof tail !== 'undefined') ? parts.join(".") + tail : parts.join(".");
    };
});