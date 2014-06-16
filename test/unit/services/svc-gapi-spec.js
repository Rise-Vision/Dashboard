/* jshint expr:true */

'use strict';
describe('gapi service', function() {
  // Load the module
  beforeEach(module('dashboard'));
  
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
  }));

  describe('oauthAPILoader service',function(){
    var oauthAPILoader;

    beforeEach(module(function ($provide) {
      //stub services
      $provide.service("gapiLoader", function() {
        return {
          get : function(){
            var deferred = Q.defer();
            deferred.resolve({
              client : {
                load : function(n,v,cb){
                  cb();
                },
                oauth2 : {some:'thing'}
              }
            });
            return deferred.promise;
          }
        };
      });
    }));//provide

    beforeEach(function () {
      inject(function($injector){
        oauthAPILoader = $injector.get('oauthAPILoader');
      });    
    });

    it('should get loaded', function () {
      expect(oauthAPILoader).to.not.be.undefined;
    });

    it('should get get the client', function (done) {
      return oauthAPILoader.get()
              .then(function(result){
                expect(result).to.be.truely;
                done();
              },done);      
    });
  });//oauthAPILoader

  describe('bigQueryAPILoader service',function(){
    var bigQueryAPILoader;

    beforeEach(module(function ($provide) {
      //stub services
      $provide.service("gapiLoader", function() {
        return {
          get : function(){
            var deferred = Q.defer();
            deferred.resolve({
              client : {
                load : function(n,v,cb){
                  cb();
                },
                bigquery : {some:'thing'}
              }
            });

            return deferred.promise;
          }
        };
      });
    }));//provide

    beforeEach(function () {
      inject(function($injector){
        bigQueryAPILoader = $injector.get('bigQueryAPILoader');
      });    
    });

    it('should get loaded', function () {
      expect(bigQueryAPILoader).to.not.be.undefined;
    });

    it('should get get the client', function (done) {
      return bigQueryAPILoader.get()
              .then(function(result){
                expect(result).to.be.truely;
                done();
              },done);      
    });
  });//bigQueryAPILoader

  describe('gapiLoader service', function() {
    var gapiLoader;

    beforeEach(module(function ($provide) {
      //stub services
      $provide.service("$window", function() {
        return {
          gapi:{some:'thing'},
          addEventListener : function(name,cb){
            cb();
          },
          removeEventListener : function(){
            //NOP;
          }
        };
      });
    }));

    beforeEach(function () {
      inject(function($injector){
        gapiLoader = $injector.get('gapiLoader');
      });    
    });

     it('should get loaded', function () {
      expect(gapiLoader).to.not.be.undefined;
    });

    it('should get get the client', function (done) {
      return gapiLoader.get()
              .then(function(result){
                expect(result).to.be.truely;
                done();
              },done);      
    });

  });//gapiLoader
  
});//gapi
