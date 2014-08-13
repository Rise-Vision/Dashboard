/*global _:false */

"use strict";

angular.module('dashboard')
  .directive('activeDisplaysTable',
   ['googleBigQueryService','commonMetricService','queryHelpersService','tableHelperService',
    function(googleBigQueryService,commonMetricService,queryHelpersService,tableHelperService){
      return {
      restrict: 'E',
      scope: {groupingTitle : '=grouping'},
      templateUrl: 'view/active-displays-table.html',
      link: function (scope) {
        scope.showSpinner = true;
        scope.reverseSort = true;
        var pageSize = 100;
        var data = [];
        scope.page = 0;
        scope.pages = 0;
        scope.dates = queryHelpersService.generateShortMonthDates(12);

        var query;
        switch(scope.groupingTitle ? scope.groupingTitle.toLowerCase():''){
          case 'company':
            query = googleBigQueryService.getDisplaysPerCompany;
          break;
          case 'country':
            query = googleBigQueryService.getDisplaysPerCountry;
          break;
          default:
            throw new Error('Unknown grouping: '+scope.groupingTitle);
        }

        query()
        .then(function(result){
          data = result;
          scope.orderBy('displays.'+_.first(scope.dates));
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
