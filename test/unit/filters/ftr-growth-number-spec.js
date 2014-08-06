
/*jshint expr:true */
"use strict";

describe("Filters: Growth Number", function() {

  beforeEach(module('dashboard'));
  var $filter, growthNumber;

  beforeEach(function () {
    inject(function (_$filter_) {
      $filter = _$filter_;
      growthNumber = $filter('growthNumber');

    });
  });

  it("should exist", function() {
    expect(growthNumber).to.be.truely;
    expect(growthNumber).to.be.a('function');
  });

  it('should return N/A if no data provided',function(){

    expect(growthNumber()).to.equal('N/A');
  });

  it('should return N/A if an invalid number is provided',function(){
    expect(growthNumber(1/0)).to.equal('N/A');
  });

  it('should not attach the tail if the number is invalid',function(){
    expect(growthNumber(1/0,'tail')).to.equal('N/A');
  });

  it('should return the number in comma seperated format',function(){
    expect(growthNumber(10000.01)).to.equal('10,000.01');
  });

  it('should append the tail if a number is provided',function(){
    expect(growthNumber(10000.01,'test')).to.equal('10,000.01test');
  });

});//growthNumber
