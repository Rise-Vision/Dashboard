/*jshint expr:true */
"use strict";

describe("Services: githubQueryService", function() {
  var githubQueryService;
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
                  "starred" : 0
                }
              ]});
            break;
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
    });
  });


  it("should exist", function() {
    expect(githubQueryService).to.respondTo('getStats');
  });

  describe('getStats',function(){
    it('make the query', function(done) {
      return  githubQueryService.getStats()
              .then(function(result){
                expect(result).to.be.an('Array');
                expect(result).to.have.length.above(0);
                var expectedProperties = ['name','fullName','isPrivate','authors','commits','forked','watched','starred','releases','pullRequests','timelines'];
                for(var i = 0; i < expectedProperties.length; i++) {
                  expect(result[0]).to.have.property(expectedProperties[i]);
                }
                done();
              })
              .then(null,done);


    });
  });


});
