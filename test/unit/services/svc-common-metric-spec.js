/*jshint expr:true */
"use strict";

describe("Services: common metric", function() {
  var commonMetricService;
  beforeEach(module('dashboard'));
  beforeEach(function(){
    inject(function($injector){
      commonMetricService = $injector.get('commonMetricService');

    });
  });

  it("should exist", function() {
    expect(commonMetricService).be.defined;
    expect(commonMetricService).to.respondTo('generateChartId');
    expect(commonMetricService).to.respondTo('generateErrorMessage');
    expect(commonMetricService).to.respondTo('getChartColours');
    expect(commonMetricService).to.respondTo('intToShortAgoMonth');
    expect(commonMetricService).to.respondTo('getCommonChartOptions');
    expect(commonMetricService).to.respondTo('dateD3Format');
  });

  describe("generateChartId",function(){
    it("should include the given prefix at the start of the id", function() {
      expect(commonMetricService.generateChartId('someTitle')).to.match(/^someTitle/);      
    });  
    it("should generate unique* ids", function() {
      for(var i = 0; i < 100000; i ++){
        expect(commonMetricService.generateChartId('someTitle')).to.not.equal(commonMetricService.generateChartId('someTitle'));
      }      
    });  
  });//generateChartId

  describe('generateErrorMessage', function(){
    it('should generate timeout error messages',function(){
      expect(commonMetricService.generateErrorMessage({status:0}).toLowerCase().indexOf('timed out')).to.be.above(-1);
    });

    it('should include the error response\'s body if present',function(){
      expect(commonMetricService.generateErrorMessage({data:'error message'}).toLowerCase().indexOf('error message')).to.be.above(-1);
    });

    it('should include the error if it is just a string',function(){
      expect(commonMetricService.generateErrorMessage('error message').toLowerCase().indexOf('error message')).to.be.above(-1);
    });
  });//generateErrorMessage
});//service
