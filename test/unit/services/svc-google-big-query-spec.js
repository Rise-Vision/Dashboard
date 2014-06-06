/*jshint expr:true */
"use strict";

describe("Services: google big query", function() {
  var googleBigQueryService = {};

  beforeEach(module('dashboard'));

  beforeEach(function(){
    inject(function($injector){
      googleBigQueryService = $injector.get('googleBigQueryService');
    });
  });

  it("should exist", function() {
    expect(googleBigQueryService).be.defined;
  });
});
