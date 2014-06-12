/*jshint expr:true */
"use strict";
/*global _:false */

describe("Services: google big query", function() {
  var googleBigQueryService = {};

  beforeEach(module('dashboard'));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
  }));//beforeEach provide

 


  describe('getActiveDisplaysForLineChart',function(){
    beforeEach(module(function ($provide) {
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
                          jobComplete : true,                          
                          rows:[
                                { 
                                  f : [
                                        {v:"2014-01-01"},
                                        {v:8999}
                                      ]
                                },
                                { 
                                  f : [
                                        {v:"2014-01-01"},
                                        {v:8991}
                                      ]
                                },
                                { 
                                  f : [
                                        {v:"2014-01-01"},
                                        {v:899}
                                      ]
                                },
                                { 
                                  f : [
                                        {v:"2014-01-01"},
                                        {v:89}
                                      ]
                                },
                                { 
                                  f : [
                                        {v:"2014-01-01"},
                                        {v:8}
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

    beforeEach(module(function ($provide) {
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

  describe('getActiveDisplaysForMap (failed query)',function(){

    beforeEach(module(function ($provide) {
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
                          jobComplete : false,                          
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

    it('should handled a query that did not complete',function(done){
      return googleBigQueryService
              .getActiveDisplaysForMap()
              .then(done,function(error){
                expect(error).to.be.truely;
                done();
              })
              .then(null,done);
    });
  });//getActiveDisplaysForMap Failed
});//service
