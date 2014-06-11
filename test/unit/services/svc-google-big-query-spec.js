/*jshint expr:true */
"use strict";

describe("Services: google big query", function() {
  var googleBigQueryService = {};

  beforeEach(module('dashboard'));
  beforeEach(module(function ($provide) {

    $provide.service("$q", function() {return Q;});
    $provide.service("bigQueryAPILoader",
      function() {
        return {
          get : function(){
            var deferred = Q.defer();

            deferred.resolve({
              jobs:{
                query : function() {
                  return {
                    execute : function(cb) { 

                      cb({
                        rows:[
                              { 
                                f : [
                                      {v:"2014-01-01"},
                                      {v:8999}
                                    ]
                              }
                            ]
                          });
                    }//exe
                  };//query
                }//resolve
              }//jobs
            });//resovle

            return deferred.promise;
          }//get
        };
      });//bigQueryAPILoader

  }));//beforeEach provide

  beforeEach(function(){
    inject(function($injector){
      googleBigQueryService = $injector.get('googleBigQueryService');
    });
  });

  it("should exist", function() {
    expect(googleBigQueryService).be.defined;
    expect(googleBigQueryService.getActiveDisplaysForLineChart).be.defined;
    expect(googleBigQueryService.getActiveDisplaysForMap).be.defined;
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
                done();
              })
              .then(null,done);
    });
  });//getActiveDisplaysForMap
});//service
