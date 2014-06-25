describe('Services: Query Helpers', function(){
  var queryHelpersService;

  beforeEach(module('dashboard'));

  beforeEach(function(){
    inject(function($injector){
      queryHelpersService = $injector.get('queryHelpersService');
    });
  });

  it('should load', function(){
    expect(queryHelpersService).to.respondTo('calculateNormalizedValues');
    expect(queryHelpersService).to.respondTo('awesomeMonthDateParser');    
  });


  describe('awesomeMonthDateParser',function(){
    var testDate = new Date('June 1 2014');

    it('should parse a month that has already occured in the current year',function(){ 
      var result = queryHelpersService.awesomeMonthDateParser('Mar',testDate);
      expect(result).to.be.a('Date');
      expect(result.toString()).to.equal(new Date('March 1 2014').toString());
    });

    it('should parse a month that is the current month',function(){ 
      var result = queryHelpersService.awesomeMonthDateParser('Jun',testDate);
      expect(result).to.be.a('Date');
      expect(result.toString()).to.equal(testDate.toString());
    });

    it('should parse a month that has  occured in the previous year',function(){ 
      var result = queryHelpersService.awesomeMonthDateParser('Dec',testDate);
      expect(result).to.be.a('Date');
      expect(result.toString()).to.equal(new Date('December 1 2013').toString());
    });
  });

  describe('calculateNormalizedValues',function(){
    
    it('should calcute the normalized average',function(){
      var testArray = [{x:1,y:1},{x:2,y:2},{x:3,y:3},{x:4,y:4}]; 
      var result = queryHelpersService.calculateNormalizedValues(testArray,3);
      expect(result).to.be.an('Array');
      expect(result.length).to.equal(testArray.length);
      for(var i = 0; i < testArray.length; i++) {
        expect(result[i].x).to.equal(testArray[i].x);
      }
      expect(result[0].y).to.equal(testArray[0].y);
      expect(result[1].y).to.equal(Math.round((testArray[0].y + testArray[1].y ) / 2));
      expect(result[2].y).to.equal(Math.round((testArray[0].y + testArray[1].y + testArray[2].y) / 3));
      expect(result[3].y).to.equal(Math.round((testArray[1].y + testArray[2].y + testArray[3].y) / 3));

    });
  });

  describe('mapDateToValue',function(){
    it('should transform the chart array into a mapped object', function(){
      var testArray = [{x:'a',y:1},{x:'bb',y:2},{x:'ccc',y:3},{x:'dddd',y:4}];
      var result = queryHelpersService.mapDateToValue(testArray);
      expect(result).to.be.an('object');
      for(var i = 0; i < testArray.length; i++) {
        expect(result[testArray[i].x]).to.equal(testArray[i].y);
      }
    });
  });

   describe('combineIntoArray',function(){
    it('should merge the arrays into one array with each y value being the sum of the two input array\'s y values', function(){
      var key1 = new Date('Jan 1 2014')
        , key2 = new Date('Feb 1 2014')
        , testObject = {};

      testObject[key1] = 1;
      testObject[key2] = 2;

      var result = queryHelpersService.combineIntoArray(testObject,testObject);
      expect(result).to.be.an('Array');
      expect(result[0].x.toString()).to.equal(key1.toString());
      expect(result[1].x.toString()).to.equal(key2.toString());

      for(var i = 0; i < result.length; i++) {
        expect(result[i].y).to.equal( (i+1) * 2);
      }
    });

    it('should handle cases where the arrays do not align', function(){
      var key1 = new Date('Jan 1 2014')
        , key2 = new Date('Feb 1 2014')
        , key3 = new Date('Mar 1 2014')
        , testObject1 = {}
        , testObject2 = {};

      testObject1[key1] = 1;
      testObject1[key2] = 2;
      testObject2[key2] = 2;
      testObject2[key3] = 3;


      var result = queryHelpersService.combineIntoArray(testObject1,testObject2);
      expect(result).to.be.an('Array');
      expect(result[0].x.toString()).to.equal(key1.toString());
      expect(result[0].y).to.equal(1);

      expect(result[1].x.toString()).to.equal(key2.toString());
      expect(result[1].y).to.equal(4);

      expect(result[2].x.toString()).to.equal(key3.toString());
      expect(result[2].y).to.equal(3);


      
    });

  });
});