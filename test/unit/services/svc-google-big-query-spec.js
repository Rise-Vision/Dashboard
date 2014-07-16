/*jshint expr:true */
"use strict";
/*global _:false */

describe("Service: BigQuery", function() {
  var googleBigQueryService = {};
  beforeEach(module('dashboard'));
  beforeEach(module(function ($provide) {
    $provide.constant('API_ROOT','');
    $provide.service("$q", function() {return Q;});
  }));
  describe("",function(){
    beforeEach(module(function ($provide) {
     $provide.service('$http',function(){
        return{
          get:function(url){
            var deferred = Q.defer();
            switch(url){
              case  '/query/googleBigQuery/getActiveDisplaysForMap':           
                deferred.resolve({data:{
                                  jobComplete : true,
                                  rows:[
                                        { 
                                          f : [
                                                {v:"id"},
                                                {v:8999},
                                                {v:-899}
                                              ]
                                        }
                                      ]
                                }});
                break;
              case '/query/googleBigQuery/getActiveDisplaysForLineChart':
              /* jshint ignore:start */
                var getDateString = function(date){
                 return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                };
                
                var rows = [];
                for(var i = 500; i >= 0; i--){
                  var date = new Date();date.setDate(date.getDate() - i);
                  rows.push({
                    f:[
                      {v:getDateString(date)},
                      {v:i.toString()}
                    ]
                  });
                }
                deferred.resolve({data:{
                  jobComplete:true,
                  rows:rows
                }});
              /* jshint ignore:end */
              break;
              case '/query/googleBigQuery/getNewCompaniesByDay':
              /* jshint ignore:start */
                var getDateString = function(date){
                 return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                };
                var today = new Date();
                var yesterday = new Date();yesterday.setDate(yesterday.getDate()-1);
                var thisMonth = new Date();thisMonth.setDate(1);
                var rows = [
                            {
                              f:[
                                {v:getDateString(today)},
                                {v:'1'}
                              ]
                            },
                            {
                              f:[
                                {v:getDateString(yesterday)},
                                {v:'2'}
                              ]
                            },
                            {
                              f:[
                                {v:getDateString(thisMonth)},
                                {v:'3'}
                              ]
                            }
                          ];
                for(var i = 1; i < 24; i++){
                  var date = new Date();date.setDate(1);date.setMonth(date.getMonth() - i);
                  rows.push({
                    f:[
                      {v:getDateString(date)},
                      {v:(i + 3).toString()}
                    ]
                  });
                }
                deferred.resolve({data:{
                  jobComplete:true,
                  rows:rows
                }});
              /* jshint ignore:end */

              break;
            case '/query/googleBigQuery/getTotalCompaniesByMonth':
              /* jshint ignore:start */
              var getDateString = function(date){
                return date.getFullYear()+'-'+(date.getMonth()+1);
              };
              var rows = [];
              for(var i = 1; i < 24; i++){
                var date = new Date();date.setDate(1);date.setMonth(date.getMonth() - i);
                rows.push({
                  f:[
                    {v:getDateString(date)},
                    {v:i.toString()}
                  ]
                });
              }
              deferred.resolve({data:{
                jobComplete:true,
                rows:rows
              }});
            /* jshint ignore:end */            
            break;
            default:
              deferred.reject('unexpected url: '+url);
              break;
            }
            return deferred.promise;
          }
        };
      });
    }));//beforeEach provide

    beforeEach(function(){
      inject(function($injector){
        googleBigQueryService = $injector.get('googleBigQueryService');
      });
    });

    describe('getActiveDisplaysForLineChart', function() {

       it('should get the expected fields',function(done){
        return googleBigQueryService
                .getActiveDisplaysForLineChart()
                .then(function(result){
                  expect(result).to.be.truely;
                  expect(result).to.contain.keys('byDay','today','yesterday','total','thisMonth','lastMonth','last3Months','last12Months');
                  expect(result.byDay).to.have.length(2);
                  done();
                })                  
                .then(null,done);
      });

      it('should get the the byDay values',function(done){
        return googleBigQueryService
                .getActiveDisplaysForLineChart()
                .then(function(result){
                  for(var i = 0; i < result.byDay[0].values.length; i++) {
                    for(var j = 0; j < result.byDay.length; j++) {
                      var item = result.byDay[j].values[i];
                      expect(item).to.contain.keys('x','y');
                      expect(item.y).to.be.at.least(0);
                      expect(item.x).to.be.a('Date');
                    }
                  }
                  done();
                })                  
                .then(null,done);
      });

      it('should calculate the today count',function(done){
        return googleBigQueryService
                .getActiveDisplaysForLineChart()
                .then(function(result){
                  var last2Days = _.last(result.byDay[1].values,2);
                  expect(result.today).to.equal(last2Days[1].y - last2Days[0].y);
                  done();
                })                  
                .then(null,done);
      });

      it('should calculate the yesterday count',function(done){
        return googleBigQueryService
                .getActiveDisplaysForLineChart()
                .then(function(result){
                  var last3AvgDisplays = _.last(result.byDay[1].values,3)
                  expect(result.yesterday).to.equal(last3AvgDisplays[2].y - last3AvgDisplays[1].y);
                  done();
                })                  
                .then(null,done);  
      });

      it('should calculate the total count',function(done){
        return googleBigQueryService
                .getActiveDisplaysForLineChart()
                .then(function(result){                  
                  expect(result.total).to.equal(_.last(result.byDay[1].values).y);
                  done();
                })                  
                .then(null,done);
      });

      it('should calculate the growth rates',function(done){
        return googleBigQueryService
                .getActiveDisplaysForLineChart()
                .then(function(result){
                  var thisMonthCount = _.last(result.byDay[1].values).y;
                  var lastDayOfLastMonth = new Date();lastDayOfLastMonth.setDate(0);
                  expect(lastDayOfLastMonth.getDate()).to.be.at.least(28);
                  expect(lastDayOfLastMonth.getDate()).to.be.at.most(31);
                  var endOfLastMonthCount = _.first(_.filter(result.byDay[1].values,function(i){
                                                       return (i.x.getFullYear() === lastDayOfLastMonth.getFullYear() &&
                                                                i.x.getMonth() === lastDayOfLastMonth.getMonth() &&
                                                                i.x.getDate() === lastDayOfLastMonth.getDate());;
                                                    })).y;
                  expect(result.thisMonth).to.equal((thisMonthCount-endOfLastMonthCount)/endOfLastMonthCount * 100);
                  
                  var lastDayOf2MonthsAgo = new Date();lastDayOf2MonthsAgo.setMonth(lastDayOf2MonthsAgo.getMonth()-1);lastDayOf2MonthsAgo.setDate(0);
                  var endOf2MonthsAgoCount = _.first(_.filter(result.byDay[1].values,function(i){
                                                       return (i.x.getFullYear() === lastDayOf2MonthsAgo.getFullYear() &&
                                                                i.x.getMonth() === lastDayOf2MonthsAgo.getMonth() &&
                                                                i.x.getDate() === lastDayOf2MonthsAgo.getDate());;
                                                    })).y;
                  expect(result.lastMonth).to.equal((endOfLastMonthCount-endOf2MonthsAgoCount)/endOf2MonthsAgoCount * 100);
                  
                  var lastDayOf4MonthsAgo = new Date();lastDayOf4MonthsAgo.setMonth(lastDayOf4MonthsAgo.getMonth()-3);lastDayOf4MonthsAgo.setDate(0);
                  var endOf4MonthsAgoCount = _.first(_.filter(result.byDay[1].values,function(i){
                                                       return (i.x.getFullYear() === lastDayOf4MonthsAgo.getFullYear() &&
                                                                i.x.getMonth() === lastDayOf4MonthsAgo.getMonth() &&
                                                                i.x.getDate() === lastDayOf4MonthsAgo.getDate());;
                                                    })).y;
                  expect(result.last3Months).to.equal((endOfLastMonthCount-endOf4MonthsAgoCount)/endOf4MonthsAgoCount * 100);
                  


                  var lastDayOf13MonthsAgo = new Date();lastDayOf13MonthsAgo.setMonth(lastDayOf13MonthsAgo.getMonth()-12);lastDayOf13MonthsAgo.setDate(0);
                  var endOf13MonthsAgoCount = _.first(_.filter(result.byDay[1].values,function(i){
                                                       return (i.x.getFullYear() === lastDayOf13MonthsAgo.getFullYear() &&
                                                                i.x.getMonth() === lastDayOf13MonthsAgo.getMonth() &&
                                                                i.x.getDate() === lastDayOf13MonthsAgo.getDate());;
                                                    })).y;
                  expect(result.last12Months).to.equal((endOfLastMonthCount-endOf13MonthsAgoCount)/endOf13MonthsAgoCount * 100);
                  

                  done();
                })                  
                .then(null,done);
      });
    });//getActiveDisplaysForLineChart

    describe('getActiveDisplaysForMap',function(){

      it('should make a query',function(done){
        return googleBigQueryService
                .getActiveDisplaysForMap()
                .then(function(result){
                  expect(result).to.be.truely;
                  expect(result.length).to.be.above(0);
                  expect(result[0]).to.deep.equal({id:"id",lat:8999,lng:-899});

                  done();
                })
                .then(null,done);
      });
    });//getActiveDisplaysForMap

    describe('getNewCompaniesByDay',function(){

      it('should get the expected fields',function(done){
        return googleBigQueryService
                .getNewCompaniesByDay()
                .then(function(result){
                  expect(result).to.be.truely;
                  expect(result).to.contain.keys('byDay','today','yesterday','total','thisMonth','lastMonth','last3Months','last12Months');
                  expect(result.byDay).to.have.length(2);
                  done();
                })                  
                .then(null,done);
      });

      it('should get the the byDay values',function(done){
        return googleBigQueryService
                .getNewCompaniesByDay()
                .then(function(result){
                  for(var i = 0; i < result.byDay[0].values.length; i++) {
                    for(var j = 0; j < result.byDay.length; j++) {
                      var item = result.byDay[j].values[i];
                      expect(item).to.contain.keys('x','y');
                      expect(item.y).to.be.at.least(0);
                      expect(item.x).to.be.a('Date');
                    }
                  }
                  done();
                })                  
                .then(null,done);
      });

      it('should calculate the today count',function(done){
        return googleBigQueryService
                .getNewCompaniesByDay()
                .then(function(result){
                  expect(result.today).to.equal(1);
                  done();
                })                  
                .then(null,done);
      });

      it('should calculate the yesterday count',function(done){
        return googleBigQueryService
                .getNewCompaniesByDay()
                .then(function(result){
                  expect(result.yesterday).to.equal(2);
                  done();
                })                  
                .then(null,done);  
      });

      it('should calculate the total count',function(done){
        return googleBigQueryService
                .getNewCompaniesByDay()
                .then(function(result){
                  var expectedTotalNewCompanies = 0;
                  for (var x = 0; x < result.byDay[0].values.length; x++) {
                    expectedTotalNewCompanies += (x+1);
                  }
                  expect(result.total).to.equal(expectedTotalNewCompanies);
                  done();
                })                  
                .then(null,done);
      });

      it('should calculate the growth rates',function(done){
        return googleBigQueryService
                .getNewCompaniesByDay()
                .then(function(result){
                  var thisMonthCount = 0
                    , lastMonthCount = 0;
                  if(new Date().getDate() === 1){
                    //dont include yesterday count 
                    thisMonthCount = 1 + 3;
                    lastMonthCount = 2 + 4;
                  }
                  else {
                    thisMonthCount = 1 + 2 + 3;
                    lastMonthCount = 4;
                  }
                  expect(result.thisMonth).to.equal(thisMonthCount/1 * 100);
                  expect(result.lastMonth).to.equal(lastMonthCount/2 * 100);
                  expect(result.last3Months).to.equal((lastMonthCount + 5 + 6 + 7)  / 5 * 100 );
                  expect(result.last12Months).to.equal((lastMonthCount + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12+13+14+15+16) / 14 * 100 );

                  done();
                })                  
                .then(null,done);
      });
    });//getActiveDisplaysForMap
  });//successful

  describe('(failed queries)',function(){
    var expectedError = 'reason';
    beforeEach(module(function ($provide) {
      $provide.service('$http',function(){
        return{
          get:function(){
            var deferred = Q.defer();
            deferred.reject(expectedError);
            return deferred.promise;
          }
        }
      });
    }));
    beforeEach(function(){
      inject(function($injector){
        googleBigQueryService = $injector.get('googleBigQueryService');
      });
    });
    
    it('getActiveDisplaysForLineChart should handle failures',function(done){
      return googleBigQueryService
              .getActiveDisplaysForLineChart()
              .then(done,function(e){
                expect(e).to.be.truely;
                expect(e).to.equal(expectedError)
                done();
              });
    });

    it('getActiveDisplaysForMap should handle failures',function(done){
      return googleBigQueryService
              .getActiveDisplaysForMap()
              .then(done,function(e){
                expect(e).to.be.truely;
                expect(e).to.equal(expectedError)
                done();
              });
    });

    it('getNewCompaniesByDay should handle failures',function(done){
      return googleBigQueryService
              .getNewCompaniesByDay()
              .then(done,function(e){
                expect(e).to.be.truely;
                expect(e).to.equal(expectedError)
                done();
              });
    });

  });//failed
  
});//service
