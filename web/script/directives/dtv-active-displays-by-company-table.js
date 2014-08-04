/*global _:false */

"use strict";

angular.module('dashboard')
  .directive('activeDisplaysByCompanyTable',
   ['googleBigQueryService','commonMetricService','queryHelpersService','tableHelperService',
    function(googleBigQueryService,commonMetricService,queryHelpersService,tableHelperService){
      return {
      restrict: 'E',
      scope: {},
      templateUrl: 'view/active-displays-company-table.html',
      link: function (scope) {
        scope.showSpinner = true;
        scope.reverseSort = true;
        var pageSize = 100;
        scope.page = 0;
        scope.pages = 0;
        scope.dates = queryHelpersService.generateShortMonthDates(12);
        scope.orderByField = 'displays.'+_.first(scope.dates);

        var data = [];
        googleBigQueryService.getDisplaysPerCompany()
        .then(function(result){
          data = result;
          scope.pages = Math.ceil(data.length/pageSize);
          applyPagination(0);
        })
        .then(null,function(error){
          console.error(error);
          scope.errorMessage = commonMetricService.generateErrorMessage(error);
        })
        .finally(function(){
          scope.showSpinner = false;
        });//getStatsTable

        var applyPagination = function(page) {
          scope.data = tableHelperService.applyPagination(page,scope.pages,pageSize,data);
        };

        scope.nextPage = function(gotoLast) {
          if(gotoLast){
            scope.page = scope.pages-1;
          }else{
            scope.page++;
          }
          applyPagination(scope.page);
        };

        scope.prevPage = function(gotoFirst) {
          if(gotoFirst){
            scope.page = 0;
          }else{
            scope.page--;
          }
          applyPagination(scope.page);
        };

        scope.orderBy = function(key) {
          data = tableHelperService.orderBy(key,scope.orderByField,data);
          if(key === scope.orderByField){
            scope.reverseSort = !scope.reverseSort;
          }else{
            scope.orderByField = key;
            scope.reverseSort = true;
          }
          applyPagination(scope.page);
        };

        scope.sumColumn = function(date) {
          return tableHelperService.sumDisplayColumn(date,data);
        };
      }
    };
  }]);//activeDisplaysByCompanyTable
