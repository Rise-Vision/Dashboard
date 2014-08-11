"use strict";

describe("Services: activeTabService", function() {
  var activeTabService;
  beforeEach(module('dashboard'));
  beforeEach(module(function ($provide) {
    $provide.service("$location",function(){
      return {
        path:function(){
          return '/Location';
        }
      };
    });
  }));

  beforeEach(function(){
    inject(function($injector){
      activeTabService = $injector.get('activeTabService');
    });
  });

  it('should exist',function(){
    expect(activeTabService).to.be.truely;
    expect(activeTabService).to.be.a('function');
  })

  it('should match the lower case strings',function(){
    expect(activeTabService('/location')).to.be.true;
  });

  it('should not match the lower case strings',function(){
    expect(activeTabService('/notAt/Match')).to.be.false;
  });
});//activeTabService