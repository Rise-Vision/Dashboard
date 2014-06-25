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
             
            case '/query/gooddata/getAverageTopicResponseTimesPerDay':
              
            case '/query/gooddata/getFullResolutionTimesPerMonth':
              
            case '/query/gooddata/getGetSatisfactionTouchesByDay':
             
            case '/query/gooddata/getZenDeskTouchesByDay':
              deferred.resolve({data:'"Month/Year (Created)","[Biz Hrs] First Reply Time (min) [Avg]"\n"Jan 1 2014","9.5500000000000000"\n"Feb 1 2014","73.0054347826086957"\n"Mar 1 2014","9.9652777777777778"\n"Apr 1 2014","14.6138613861386139"\n'});
              break;
            case '/query/googleBigQuery/getActiveDisplaysForLineChart':
              deferred.resolve({data:{
                                jobComplete : true,                          
                                rows:[
                                      { 
                                        f : [
                                              {v:"2014-01-01"},
                                              {v:8999}
                                            ]
                                      },
                                      { 
                                        f : [
                                              {v:"2014-02-01"},
                                              {v:8991}
                                            ]
                                      },
                                      { 
                                        f : [
                                              {v:"2014-03-01"},
                                              {v:899}
                                            ]
                                      },
                                      { 
                                        f : [
                                              {v:"2014-04-01"},
                                              {v:89}
                                            ]
                                      },
                                      { 
                                        f : [
                                              {v:"2014-05-01"},
                                              {v:8}
                                            ]
                                      }
                                    ]
                              }});
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
    expect(gooddataQueryService.getFullResolutionTimesPerMonth).to.be.defined;    
    expect(gooddataQueryService.getTouchesByDay).to.be.defined;        
    /* jshint ignore:end */            

  });
  
  describe('getZendeskResponseTimeForLineGraph',function(){
    it('should parse the returned csv into a JS object',function(done){
      return gooddataQueryService.getZendeskResponseTimeForLineGraph()
      .then(function(result){
        expect(result).to.be.an('Array');
        expect(result.length).to.be.above(0);
        expect(result[0].values[0].x).to.be.a('Date');
        /* jshint ignore:start */  
        expect(result[0].values[0].x).to.be.truely;
        /* jshint ignore:end */            
        expect(result[0].values[0].y).to.be.a('Number');
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
        expect(result[0].values[0].x).to.be.a('Date');
        /* jshint ignore:start */      
        expect(result[0].values[0].x).to.be.truely;
        /* jshint ignore:end */
        expect(result[0].values[0].y).to.be.a('Number');
        done();
      })
      .then(null,done);
    });
  });
  describe('getFullResolutionTimesPerMonth',function(){
    it('should parse the returned csv into a JS object',function(done){
      return gooddataQueryService.getFullResolutionTimesPerMonth()
      .then(function(result){
        expect(result).to.be.an('Array');
        expect(result.length).to.be.above(0);
        expect(result[0].values[0].x).to.be.a('Date');
        /* jshint ignore:start */            
        expect(result[0].values[0].x).to.be.truely;
        /* jshint ignore:end */
        expect(result[0].values[0].y).to.be.a('Number');
        done();
      })
      .then(null,done);
    });
  });


describe('getTouchesByDay',function(){
    it('should parse the returned csv into a JS object',function(done){
      return gooddataQueryService.getTouchesByDay()
      .then(function(result){
        
        expect(result).to.be.an('Array');
        expect(result).to.have.length(3);
        for (var i = 0; i < 3; i++) {
          expect(result[i].values[0].x).to.be.a('Date');
          /* jshint ignore:start */            
          expect(result[i].values[0].x).to.be.truely;
          /* jshint ignore:end */
          expect(result[i].values[0].y).to.be.a('Number');
          expect(result[i].values[0].y).to.be.least(0);

        }
        done();
      })
      .then(null,done);
    });
  });
  


});