/*jshint expr:true */
"use strict";

describe("Services: marker cluster", function() {
  var markerClusterService;
  beforeEach(module('dashboard'));
  beforeEach(function(){
    inject(function($injector){
      markerClusterService = $injector.get('markerClusterService');

    });
  });

  it("should exist", function() {
    expect(markerClusterService).be.defined;
    expect(markerClusterService.getClusterCalculator).be.defined;
  });

  describe("getClusterCalculator",function(){
    var calc,generateMakers;
    beforeEach(function(){
      calc = markerClusterService.getClusterCalculator();
      generateMakers = function(count){
        var array =[];
        for(var i=0; i< count; i++){
          array.push({});
        }
        return array;
      };
    });

    it("should group counts under 50 in group 0", function() {
      expect(calc(generateMakers(0)).index).to.equal(0);
      expect(calc(generateMakers(49)).index).to.equal(0);
    });  
    it("should group counts between 51 and 100  in group 1", function() {
      expect(calc(generateMakers(51)).index).to.equal(1);
      expect(calc(generateMakers(100)).index).to.equal(1);
    });  
    it("should group counts between 101 and 200  in group 2", function() {
      expect(calc(generateMakers(101)).index).to.equal(2);
      expect(calc(generateMakers(200)).index).to.equal(2);
    });  
    it("should group counts between 201 and 500  in group 3", function() {
      expect(calc(generateMakers(201)).index).to.equal(3);
      expect(calc(generateMakers(500)).index).to.equal(3);
    });  
    it("should group counts above 500  in group 4", function() {
      expect(calc(generateMakers(501)).index).to.equal(4);
    });  
  });//getClusterCalculator
});//service
