/*jshint expr:true */
"use strict";

describe("Services: githubQueryService", function() {
  var githubQueryService,queryHelpersService;
  beforeEach(module('dashboard'));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.constant('API_ROOT','');
    $provide.service("$http",function(){

      return {
        get : function(url){
          var deferred = Q.defer();
          switch(url){
            case '/query/github/getStats':
            deferred.resolve({data:[
                {
                  "name" : "common",
                  "fullName" : "Rise-Vision/common",
                  "isPrivate" : false,
                  "timelines" : ["last7Days","thisMonth","lastMonth","twoMonths","threeMonths","fourMonths","fiveMonths", "sixMonths"],
                  "authors" : {
                      "last7Days" : 2,
                      "thisMonth" : 2,
                      "lastMonth" : 3,
                      "twoMonths" : 3,
                      "threeMonths" : 1,
                      "fourMonths" : 0,
                      "fiveMonths" : 0,
                      "sixMonths" : 0
                  },
                  "commits" :  {
                      "last7Days" : 2,
                      "thisMonth" : 2,
                      "lastMonth" : 3,
                      "twoMonths" : 3,
                      "threeMonths" : 1,
                      "fourMonths" : 0,
                      "fiveMonths" : 0,
                      "sixMonths" : 0
                  },
                  "releases" : {
                      "last7Days" : 0,
                      "thisMonth" : 0,
                      "lastMonth" : 0,
                      "twoMonths" : 0,
                      "threeMonths" : 0,
                      "fourMonths" : 0,
                      "fiveMonths" : 0,
                      "sixMonths" : 0
                  },
                  "pullRequests" :  {
                      "last7Days" : 2,
                      "thisMonth" : 2,
                      "lastMonth" : 3,
                      "twoMonths" : 3,
                      "threeMonths" : 1,
                      "fourMonths" : 0,
                      "fiveMonths" : 0,
                      "sixMonths" : 0
                  },
                  "forked" : 0,
                  "watched" : 0,
                  "starred" : 0,
                  'openIssues' : 0,
                  'tests':0
                }
              ]});
            break;//getStats
            case '/query/github/getReleasesByDay':
                var getDateString = function(date){
                 return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
                };

                var data = [];
                var days = 357*2;
                for(var i = days; i >= 0; i--){
                  var date = new Date();date.setDate(date.getDate() - i);
                  data.push({
                    x: getDateString(date),
                    y: days - i
                  });
                }
              deferred.resolve({data:data});
            break;//
            default:
            deferred.reject('ERROR. Unexpected url: '+url);
          }
          return deferred.promise;
        }
      };
    });

  }));

  beforeEach(function(){
    inject(function($injector){
      githubQueryService = $injector.get('githubQueryService');
      queryHelpersService = $injector.get('queryHelpersService');
    });
  });


  it("should exist", function() {
    expect(githubQueryService).to.respondTo('getStats');
    expect(githubQueryService).to.respondTo('getDailyReleases');
  });

  describe('getStats',function(){
    it('make the query', function(done) {
      return  githubQueryService.getStats()
              .then(function(result){
                expect(result).to.be.an('Array');
                expect(result).to.have.length.above(0);
                var expectedProperties = ['name','fullName','isPrivate','authors','commits','forked','watched','starred','releases','pullRequests','timelines','openIssues','tests'];
                for(var i = 0; i < expectedProperties.length; i++) {
                  expect(result[0]).to.have.property(expectedProperties[i]);
                }
                done();
              })
              .then(null,done);
    });
  });

  describe('getDailyReleases',function(){
    it('shoud query github',function(done){
      return githubQueryService.getDailyReleases()
              .then(function(result){
                expect(result).to.be.an('object');
                expect(result).to.be.truely;
                expect(result).to.contain.keys('byDay','today','yesterday','total','thisMonth','lastMonth','last3Months','last12Months');
                done();
              })
              .then(null,done);
    });
    it('should get byDay',function(done){
      return githubQueryService.getDailyReleases()
              .then(function(result){
                expect(result.byDay).to.be.an('Array');
                expect(result.byDay).to.have.length.at.least(2);
                for(var i = 0; i < result.byDay.length; i++){
                  expect(result.byDay[i]).to.contain.keys('key','values');
                  expect(result.byDay[i].key).to.be.a('string');
                  expect(result.byDay[i].values).to.be.an('Array');
                }
                done();
              })
              .then(null,done);
    });

    it('should calculate today',function(done){
      return githubQueryService.getDailyReleases()
              .then(function(result){
                expect(result.today).to.be.a('number');
                expect(result.today).to.equal(result.byDay[0].values.length-1);
                done();
              })
              .then(null,done);
    });

    it('should calculate yesterdays count',function(done){
      return githubQueryService.getDailyReleases()
              .then(function(result){
                expect(result.yesterday).to.be.a('number');
                expect(result.yesterday).to.equal(result.byDay[0].values.length -2 )
                done();
              })
              .then(null,done);
    });

    it('should calculate last 7 days count',function(done){
      return githubQueryService.getDailyReleases()
              .then(function(result){
                expect(result.last7Days).to.be.a('number');
                var expectedSum = 0;
                for(var i=0; i < 7; i++){
                  expectedSum+=(result.byDay[0].values.length - i - 1);
                }
                expect(result.last7Days).to.equal(expectedSum);
                done();
              })
              .then(null,done);
    });

    it('should calculate the total count',function(done){
      return githubQueryService.getDailyReleases()
              .then(function(result){
                expect(result.total).to.be.a('number');
                var sum = 0;
                for(var i=0; i< result.byDay[0].values.length; i++)
                  sum += i;
                expect(result.total).to.equal(sum);
                done();
              })
              .then(null,done);
    });

    it('should calculate this months growth',function(done){
      return githubQueryService.getDailyReleases()
              .then(function(result){
                expect(result.thisMonth).to.be.a('number');
                var now = new Date();
                var thisMonth = _.where(result.byDay[0].values,function(item){
                  return item.x.getMonth() === now.getMonth() &&
                          item.x.getFullYear() === now.getFullYear();
                });
                var expectedSum = 0;
                for(var i = 0; i<thisMonth.length; i++){
                  expectedSum+= thisMonth[i].y;
                }

                var lastMonth = new Date();lastMonth.setMonth(lastMonth.getMonth() -1);
                var lastMonthItems = _.where(result.byDay[0].values,function(item){
                  return item.x.getMonth() === lastMonth.getMonth() &&
                          item.x.getFullYear() === lastMonth.getFullYear();
                });
                var expectedLastSum = 0;
                for(var i = 0; i<lastMonthItems.length; i++){
                  expectedLastSum+= lastMonthItems[i].y;
                }
                expect(result.thisMonth).to.equal((expectedSum - expectedLastSum) / expectedLastSum * 100);
                done();
              })
              .then(null,done);
    });

    it('should calculate last month growth',function(done){
      return githubQueryService.getDailyReleases()
              .then(function(result){
                expect(result.lastMonth).to.be.a('number');
                var lastMonth = new Date();lastMonth.setMonth(lastMonth.getMonth() -1);
                var lastMonthItems = _.where(result.byDay[0].values,function(item){
                  return item.x.getMonth() === lastMonth.getMonth() &&
                          item.x.getFullYear() === lastMonth.getFullYear();
                });
                var expectedLastSum = 0;
                for(var i = 0; i<lastMonthItems.length; i++){
                  expectedLastSum+= lastMonthItems[i].y;
                }

                var last2Month = new Date();last2Month.setMonth(last2Month.getMonth() -2);
                var last2MonthItems = _.where(result.byDay[0].values,function(item){
                  return item.x.getMonth() === last2Month.getMonth() &&
                          item.x.getFullYear() === last2Month.getFullYear();
                });
                var expected2Months = 0;
                for(var i = 0; i<last2MonthItems.length; i++){
                  expected2Months+= last2MonthItems[i].y;
                }
                expect(result.lastMonth).to.equal((expectedLastSum - expected2Months) / expected2Months * 100);

                done();
              })
              .then(null,done);
    });

    it('should calculate the growth of the last 3 months',function(done){
      return githubQueryService.getDailyReleases()
              .then(function(result){
                expect(result.last3Months).to.be.a('number');
                expect(result.last3Months).to.be.above(0);
                done();
              })
              .then(null,done);
    });

    it('should calculate the growth of the last 12 months',function(done){
      return githubQueryService.getDailyReleases()
              .then(function(result){
                expect(result.last12Months).to.be.a('number');
                expect(result.last12Months).to.be.above(0);

                done();
              })
              .then(null,done);
    });
  });


});
