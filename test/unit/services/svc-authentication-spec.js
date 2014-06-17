/*jshint expr:true */
"use strict";

describe("Services: Authentication", function() {
  var authenticationService;
  beforeEach(module('dashboard'));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});  
    $provide.service("$window",function(){
      return { 
        location:{
          replace:function(){}
        }
      };
    });

    $provide.service("$http",function(){
      
      return { 
        get : function(){
          var deferred = Q.defer();
          deferred.resolve({data:123});
          return deferred.promise;          
        },
        post:function(){
          var deferred = Q.defer();
          deferred.resolve({data:123});
          return deferred.promise;
        }
      };
    });

  }));

  beforeEach(function(){
    inject(function($injector){
      authenticationService = $injector.get('authenticationService');
    });
  });


  it("should exist", function() {
    expect(authenticationService).be.defined;
    expect(authenticationService.isUserAuthenticated()).be.false;
  });

  it("should set the user to authenticated", function(done) {
    return  authenticationService.login()
            .then(function(result){
              expect(result).to.be.defined;
              expect(authenticationService.isUserAuthenticated()).to.be.true;
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
              done();
            })
            .then(null,done);

  });

});
