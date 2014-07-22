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
    expect(commonMetricService).to.respondTo('generateGrowthStats');
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

  describe('generateGrowthStats',function(){
    it('should map the values',function(){
      var test = {
                today : 1,
                yesterday : 2,
                total : 3,
                thisMonth :4,
                lastMonth : 5,
                last3Months :6,
                last12Months : 7
              };
      var result = commonMetricService.generateGrowthStats('TEST',test);
      expect(result.title).to.equal('TEST');
      for(var key in test){
        expect(result[key]).to.equal(test[key]);
      }
    });

    it('should display N/A when no value is provided', function(){
      var test = {
                today : 1,
                yesterday : 2,
                total : 3,
                lastMonth : 5,
                last3Months :6,
                last12Months : 1/0
              };
      var result = commonMetricService.generateGrowthStats('TEST',test);
      expect(result.thisMonth).to.equal('N/A');      
      expect(result.last12Months).to.equal('N/A');
    });
  });//generateGrowthStats
});//service
