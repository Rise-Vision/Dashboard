/*jshint expr:true */
"use strict";

describe("Services: Authentication", function() {
  var authenticationService = {};

  beforeEach(module('dashboard'));

  beforeEach(function(){
    inject(function($injector){
      authenticationService = $injector.get('authenticationService');
    });
  });

  it("should exist", function() {
    expect(authenticationService).be.defined;
  });
});
