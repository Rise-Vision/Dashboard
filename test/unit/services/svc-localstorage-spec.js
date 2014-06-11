/* jshint expr:true */

'use strict';
describe('localstorage service', function() {
  var cache;
  // Load the module
  beforeEach(module('dashboard'));
  // Reset mock data;
  beforeEach(function () {
    inject(function($injector){
      cache = $injector.get('localStorageService');
    });    
  });

  it('should get loaded', function () {
    expect(cache).to.not.be.undefined;
  });

  it('push(key, val) should push the value onto array referenced by "key"', function() {
    cache.set('items', 'hello');
    expect(cache.get('items')).to.equal('hello');
    cache.remove('items');    
    expect(cache.get('items')).to.be.falsely;
  });
});
