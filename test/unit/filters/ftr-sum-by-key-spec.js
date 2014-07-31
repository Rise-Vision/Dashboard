// /*jshint expr:true */
// "use strict";

// describe('', function(){
//   //var sumByKey;

//   beforeEach(module('dashboard'));

//   beforeEach(function(){
//     inject(function($injector){
//       authenticationService = $injector.get('authenticationService');
//     });
//   });

//   it('should exist',function(){
//
//   });

//
// });//sumByKey

/*jshint expr:true */
"use strict";

describe("Filters: Sum By Key", function() {

  beforeEach(module('dashboard'));
  var $filter;

  beforeEach(function () {

    inject(function (_$filter_) {
      $filter = _$filter_;
    });
  });

  it("should exist", function() {
    var sumByKey = $filter('sumByKey');
    expect(sumByKey).to.be.truely;
    expect(sumByKey).to.be.a('function');
  });

  it('should return 0 if no data provided',function(){
    var sumByKey = $filter('sumByKey');

    expect(sumByKey()).to.equal(0);
  });

  it('should return 0 if no key is provided',function(){
    var sumByKey = $filter('sumByKey');

    expect(sumByKey(['as'])).to.equal(0);

  });

  it('should handle 1 property deep',function(){
    var sumByKey = $filter('sumByKey');

    expect(sumByKey([{test:1},{test:1},{notTest:1}],'test')).to.equal(2);
  });

  it('should handle more than 1 property deep',function(){
    var sumByKey = $filter('sumByKey');

    expect(sumByKey([
      {test:{key:1}},
      {test:{key:1}}
      ],'test.key')).to.equal(2);

  });

});//sumByKey
