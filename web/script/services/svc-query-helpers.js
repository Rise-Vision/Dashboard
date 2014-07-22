'use strict';
/*global _:false */

/*
 * queryHelpersService: provides shared functions for the query services
 * broken into seperate service to aid in unit testing
 */

angular.module('dashboard')
.factory('queryHelpersService',[function(){
  return {

    //takes an array in the form [{x:__,y:___}]
    //and an array in the same form with y being set 
    // to the average of the previous {maxPrevItemsInculded} items in array
    calculateNormalizedValues : function(array, maxPrevItemsInculded){
      var normalizedResult = [];
      for(var i = 0; i < array.length; i++ ) {
        var pastX = 0;
        for(var j = i; (j >= 0) && (j > i - maxPrevItemsInculded); j--) {
          pastX += array[j].y;
        }//for j

        normalizedResult.push({ x : array[i].x,
                                y : Math.round(pastX/Math.min(maxPrevItemsInculded,i+1))});
      }//for i
      return normalizedResult;
    },

    //transforms the short month name to a JS date object
    //assuming last 12 months
    //note: {now} is exposed for unit testing purposes
    awesomeMonthDateParser : function(shortMonth, now) {
      if(typeof now === 'undefined' || !now){
        now = new Date();
      }
      var shortMonthNames = [ "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec" ];
      var currentYear = now.getFullYear();
      var year = now.getMonth() >= shortMonthNames.indexOf(shortMonth.toLowerCase()) ? currentYear : currentYear - 1;
      return new Date(shortMonth +' 1 ' + year);
    },

    //Since JS is WAT, we need a special date parser for dates in the form "2013-12-31"
    //
    parseSlashDate : function(dateStr) {
      var parts = dateStr.split('-');
      if(parts.length >= 3){
        return new Date(parts[0], parts[1]-1, parts[2],0,0,0,0); // Note: months are 0-based
      }
      else {
        return new Date(parts[0], parts[1]-1, 1,0,0,0,0);
      }
    },

    //transforms an array in the form [{x:__,y:___}] into an object in the form
    // { x1 : y1, x2 : y2, ....} 
    // UNLESS useShortDateString === true, { x1.toDateString() : y1, x2.toDateString() : y2, ....} 
    mapDateToValue : function(xyArray, useShortDateString) {
      var result = {};
      for(var i = 0; i < xyArray.length; i++) {
        if(useShortDateString) {
          result[xyArray[i].x.toDateString()] = xyArray[i].y;
        }else{
          result[xyArray[i].x] = xyArray[i].y;
        }
      }
      return result;
    },

    //transforms 2 objects in the form {x1:y1, x2:y2}] into an array 
    //in the form [{ xa1 : ya1 + yb1 },{ xa2 : ya2 + yb2 },...]
    combineIntoArray : function(a1,a2) {

      var result  =  _.merge(a1, a2, function(a,b) {
        if(typeof a === 'number' && typeof b === 'number'){
          return a + b;
        }if (typeof a !== 'number'){
          return b;
        }
        return a;
      });
      result = _.map(result, function(num,index) {return { x : new Date(index), y : num };});

      return _.sortBy(result,'x');
    },

    //takes a {{numberOfMonths}} ago, and returns a Date object set to the first of that month
    getMonthsAgo : function (numberOfMonths) {
      var result = new Date();
      result.setMonth(result.getMonth() - numberOfMonths);
      result.setDate(1);
      result.setHours(0);
      result.setMinutes(0);
      result.setSeconds(0);
      result.setMilliseconds(0);
      return result;
    },
    //returns true if the date parts of the Dates {{d1}} and {{d2}} are equal
    equalDate : function(d1, d2){
      return (d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate());
    },
    //returns true if the Date {{d}} is within range {{monthsAgoStart}}  {{monthsAgoEnd}}
    isDateWithinMonths : function(d,monthsAgoStart,monthsAgoEnd) {
      if(monthsAgoStart > monthsAgoEnd){
        console.error('queryHelpersService: monthsAgoStart > monthsAgoEnd! inverted range');
      }

      var start = this.getMonthsAgo(monthsAgoStart)
      ,   end = this.getMonthsAgo(monthsAgoEnd);


      return (((d.getFullYear() === end.getFullYear() &&
              d.getMonth() >= end.getMonth()) ||
              (d.getFullYear() > end.getFullYear() )) &&                                                          
              ((d.getFullYear() === start.getFullYear() &&
              d.getMonth() <= start.getMonth()) ||
              (d.getFullYear() < start.getFullYear() )));


    },
    //returns true if {{d}} is in the same month + year as {{monthsAgo}} from now
    isDateWithinMonth : function(d,monthsAgo) {
      var d2 = this.getMonthsAgo(monthsAgo);
      return (d.getFullYear() === d2.getFullYear() && d.getMonth() === d2.getMonth());
    }
  };//return
}]);