"use strict";

describe("Services: table helpers", function() {
  var tableHelperService;
  beforeEach(module('dashboard'));
  beforeEach(function(){
    inject(function($injector){
      tableHelperService = $injector.get('tableHelperService');
    });
  });

  it("should exist", function() {
    expect(tableHelperService).be.defined;
    expect(tableHelperService).to.respondTo('applyPagination');
    expect(tableHelperService).to.respondTo('orderBy');
    expect(tableHelperService).to.respondTo('sumDisplayColumn');
  });

  describe('applyPagination',function(){
    it('should return the full page',function(){
      var result = tableHelperService.applyPagination(0,2,2,[1,2,3,4])
      expect(result).to.deep.equal([1,2]);
    });

    it('should return the remaining items of the last page',function(){
      var result = tableHelperService.applyPagination(1,2,2,[1,2,3])
      expect(result).to.deep.equal([3]);
    });
  });//applyPagination

  describe('orderBy',function(){
    it('should switch the order',function(){
      var result = tableHelperService.orderBy('key','key',[1,2,3]);
      expect(result).to.deep.equal([3,2,1]);
    });

    it('should order the company column',function(){
      var result = tableHelperService.orderBy('company','somthing',[{company:1},{company:2},{company:3}]);
      expect(result).to.deep.equal([{company:3},{company:2},{company:1}]);
    });

    it('should order the country column',function(){
      var result = tableHelperService.orderBy('country','somthing',[{country:1},{country:2},{country:3}]);
      expect(result).to.deep.equal([{country:3},{country:2},{country:1}]);
    });

    it('should order the displays columns',function(){
      var result = tableHelperService.orderBy('displays.Feb 2014','somthing',[
        {displays:{'Feb 2014':1}},
        {displays:{'Feb 2014':1000}},
        {displays:{'March 2014':1}},
      ]);
      expect(result).to.deep.equal([
        {displays:{'Feb 2014':1000}},
        {displays:{'Feb 2014':1}},
        {displays:{'March 2014':1}}
        ]);
    });
  });//orderBy

  describe('sumDisplayColumn',function(){
    it('should calculate the sum',function(){
      var result = tableHelperService.sumDisplayColumn('Feb 2014',[
        {displays:{'Feb 2014':1}},
        {displays:{'Feb 2014':1000}},
        {displays:{'March 2014':1}},
      ]);
      expect(result).to.equal(1001);
    });
  });//sumDisplayColumn
});//tableHelperService