/*jshint expr:true */
"use strict";

describe("Services: Authentication", function() {
  var authenticationService,localStorageService;
  beforeEach(module('dashboard'));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});

    $provide.service('localStorageService', function(){
      var mock = {};
      return {
        get : function(key){
          return mock[key];
        },
        set : function(key,value){
          mock[key]=value;
        },
        remove : function(key){
          mock[key]=null;
        }

      };
    });

    $provide.service('gapiLoader', function() {
      return {
        get : function(){
          var deferred = Q.defer();

          deferred.resolve({
            auth : {
              authorize : function(args,cb){
                cb({
                  access_token : 'token',
                  expires_in : '8999',
                  state:'state'
                });
              }
            }
          });

          return deferred.promise;
        }        
      };
    });  
  }));

  beforeEach(function(){
    inject(function($injector){
      authenticationService = $injector.get('authenticationService');
      localStorageService = $injector.get('localStorageService');      

    });
  });


  it("should exist", function() {
    expect(authenticationService).be.defined;
    expect(authenticationService.isUserAuthenticated()).be.false;
  });

  it("should set the user to authenticated", function(done) {
    return authenticationService.login()
            .then(function(result){
              expect(result).to.be.defined;
              expect(authenticationService.isUserAuthenticated()).to.be.true;
              expect(localStorageService.get('token')).to.be.an.Object;
              return authenticationService.whenAuthenticated();                     
            })
            .then(function(){done();})
            .then(null,done);
  });

  it('should set the user to not authenticated after logout', function(done){
    return authenticationService.login()
            .then(function(){              
              return authenticationService.logout();                     
            })
            .then(function(){
              expect(authenticationService.isUserAuthenticated()).to.be.false;
              expect(localStorageService.get('token')).to.be.falsely;
              done();
            })
            .then(null,done);
  });

});
