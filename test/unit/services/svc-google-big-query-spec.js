/*jshint expr:true */
"use strict";
/*global _:false */

describe("Services: google big query", function() {
  var googleBigQueryService = {};

  beforeEach(module('dashboard'));
  beforeEach(module(function ($provide) {
    $provide.constant('API_ROOT','');
    $provide.service("$q", function() {return Q;});
    $provide.service('$http',function(){
      return{
        get:function(url){
          var deferred = Q.defer();
          /* jshint ignore:start */
          
          /* jshint ignore:end */

          switch(url){
            case '/query/googleBigQuery/getActiveDisplaysForLineChart':
              deferred.resolve({data:{
                                jobComplete : true,                          
                                rows:[
                                      { 
                                        f : [
                                              {v:"2014-01-01"},
                                              {v:'8999'}
                                            ]
                                      },
                                      { 
                                        f : [
                                              {v:"2014-01-01"},
                                              {v:'8991'}
                                            ]
                                      },
                                      { 
                                        f : [
                                              {v:"2014-01-01"},
                                              {v:'899'}
                                            ]
                                      },
                                      { 
                                        f : [
                                              {v:"2014-01-01"},
                                              {v:'89'}
                                            ]
                                      },
                                      { 
                                        f : [
                                              {v:"2014-01-01"},
                                              {v:'8'}
                                            ]
                                      }
                                    ]
                              }});
              break;
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

  describe('getActiveDisplaysForLineChart',function(){
    it('should make a query',function(done){
      return googleBigQueryService
              .getActiveDisplaysForLineChart()
              .then(function(result){
                expect(result).to.be.truely;
                expect(result.length).to.be.above(1);
                expect(result[0].key).to.be.truely;
                expect(result[0].values[0].y).to.a('number');
                expect(result[0].values[0].y).to.equal(result[1].values[0].y);
                expect(result[0].values[0].x).to.a('Date');
                expect(result[0].values.length).to.be.below(30);
                var sum = 0;
                for (var i=0; i < result[0].values.length; i++){
                  sum += result[0].values[i].y;
                }
                
                expect(_.last(result[1].values).y).to.equal(Math.round(sum/result[0].values.length));

                done();
              })
              .then(null,done);
    });
  });//getActiveDisplaysForLineChart

  describe('getActiveDisplaysForMap (successful query)',function(){

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

  describe('getNewCompaniesByDay (successful query)',function(){

    it('should make a query',function(done){
      return googleBigQueryService
              .getNewCompaniesByDay()
              .then(function(result){
                expect(result).to.be.truely;
                expect(result).to.contain.keys('byDay','today','yesterday','thisMonth','lastMonth','last3Months','last12Months');
                expect(result.byDay).to.have.length(2);
               
                for(var i = 0; i < result.byDay[0].values.length; i++) {
                  var item = result.byDay[0].values[i];
                  expect(item).to.contain.keys('x','y');
                  expect(item.y).to.be.at.least(0);
                  expect(item.x).to.be.a('Date');
                }
                
                expect(result.today).to.equal(1);
                expect(result.yesterday).to.equal(2);

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
});//service
