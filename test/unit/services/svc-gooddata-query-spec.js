describe("Services: Gooddata Query", function() {
  var gooddataQueryService = {};

  beforeEach(module('dashboard'));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.constant('API_ROOT','');
              /* jshint ignore:start */

    $provide.service('$http',function(){
      return{
        get:function(url){
          var deferred = Q.defer();
            
          switch(url){
            case '/query/gooddata/getZenDeskResponseTime':
              deferred.resolve({data:'"Month/Year (Created)","[Biz Hrs] First Reply Time (min) [Avg]"\n"Mar 2014","9.5500000000000000"\n"Apr 2014","73.0054347826086957"\n"May 2014","9.9652777777777778"\n"Jun 2014","14.6138613861386139"\n'});
              break;
            case '/query/gooddata/getAverageTopicResponseTimesPerDay':
              deferred.resolve({data:'"Month/Year (Created)","[Biz Hrs] First Reply Time (min) [Avg]"\n"Mar 2014","9.5500000000000000"\n"Apr 2014","73.0054347826086957"\n"May 2014","9.9652777777777778"\n"Jun 2014","14.6138613861386139"\n'});
              break;
            default:
              deferred.reject('unexpected url:'+url);
              break;
          }
          return deferred.promise;
        }
      };
    });
/* jshint ignore:end */
  }));//beforeEach provide

  beforeEach(function(){
    inject(function($injector){
      gooddataQueryService = $injector.get('gooddataQueryService');
    });
  });

  it('should load',function(){
    /* jshint ignore:start */            
    expect(gooddataQueryService).to.be.defined;
    expect(gooddataQueryService.getZendeskResponseTimeForLineGraph).to.be.defined;    
    expect(gooddataQueryService.getAverageTopicResponseTimesPerDay).to.be.defined;    
    /* jshint ignore:end */            

  });
  
  describe('getZendeskResponseTimeForLineGraph',function(){
    it('should parse the returned csv into a JS object',function(done){
      return gooddataQueryService.getZendeskResponseTimeForLineGraph()
      .then(function(result){
        expect(result).to.be.an('Array');
        expect(result.length).to.be.above(0);
        expect(result[0].values[0].x).to.be.an('Date');
        expect(result[0].values[0].y).to.be.an('Number');
        done();
      })
      .then(null,done);
    });
  });

  describe('getAverageTopicResponseTimesPerDay',function(){
    it('should parse the returned csv into a JS object',function(done){
      return gooddataQueryService.getAverageTopicResponseTimesPerDay()
      .then(function(result){
        expect(result).to.be.an('Array');
        expect(result.length).to.be.above(0);
        expect(result[0].values[0].x).to.be.an('Date');
        expect(result[0].values[0].y).to.be.an('Number');
        done();
      })
      .then(null,done);
    });
  });

});