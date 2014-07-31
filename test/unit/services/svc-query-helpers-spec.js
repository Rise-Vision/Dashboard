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
    expect(queryHelpersService).to.respondTo('parseSlashDate');
    expect(queryHelpersService.shortMonthNames).to.be.an('Array');
    expect(queryHelpersService).to.respondTo('generateShortMonthDates');
    expect(queryHelpersService).to.respondTo('mapDateToValue');
    expect(queryHelpersService).to.respondTo('combineIntoArray');
    expect(queryHelpersService).to.respondTo('getMonthsAgo');
    expect(queryHelpersService).to.respondTo('isDateWithinMonths');
    expect(queryHelpersService).to.respondTo('isDateWithinMonth');
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

  describe('parseSlashDate',function(){
    it('should parse a date in the form "2014-06-25"',function(){
      var result = queryHelpersService.parseSlashDate("2014-06-25");
      expect(result).to.be.a('Date');
      expect(result.getFullYear()).to.equal(2014);
      expect(result.getMonth() + 1).to.equal(6);
      expect(result.getDate()).to.equal(25);
    });

    it('should parse a date in the form "2014-06"',function(){
      var result = queryHelpersService.parseSlashDate("2014-06");
      expect(result).to.be.a('Date');
      expect(result.getFullYear()).to.equal(2014);
      expect(result.getMonth() + 1).to.equal(6);
      expect(result.getDate()).to.equal(1);
    });
  });

  describe('generateShortMonthDates',function(){
    it('should generate the date strings',function(){
      var result = queryHelpersService.generateShortMonthDates(12);
      expect(result).to.have.length(12);
      for(var i = 0; i < result.length; i++){
        expect(result[i]).to.be.a('string');
        for(var j=1; j<result.length; j++){
          expect(result[i]).to.not.equal(result[i+j]);
        }
      }
    });
  });//generateShortMonthDates

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
  });//combineIntoArray

  describe('getMonthsAgo', function(){
    it('should set it to the first of the month if numberOfMonths === 0',function(){
      var now = new Date();
      var result = queryHelpersService.getMonthsAgo(0);
      expect(result).to.be.a('Date');
      expect(result.getMonth()).to.equal(now.getMonth());
      expect(result.getFullYear()).to.equal(now.getFullYear());
      expect(result.getDate()).to.equal(1);
      expect(result.getHours()).to.equal(0);
      expect(result.getMinutes()).to.equal(0);
      expect(result.getSeconds()).to.equal(0);
      expect(result.getMilliseconds()).to.equal(0);
    });
    it('should set in the proper number of months in the past',function(){
      var expected = new Date();expected.setDate(1);
      for(var i = 1; i <= 12; i++){
        var result = queryHelpersService.getMonthsAgo(i);
        expected.setMonth(expected.getMonth()-1);
        expect(result.getMonth()).to.equal(expected.getMonth());
      }
    });
  });//getMonthsAgo

  describe('equalDate', function(){
    it('should return true if the date parts are equal',function(){
      var d1 = new Date();d1.setHours(10);
      var d2 = new Date();d2.setHours(9);
      expect(queryHelpersService.equalDate(d1,d2)).to.be.true;
    });

    it('should return false if the date parts are not equal',function(){
      var d1 = new Date();d1.setHours(10);
      var d2 = new Date(d1);d2.setYear(2000);
      expect(queryHelpersService.equalDate(d1,d2)).to.be.false;
    });
  });//equalDate

  describe('isDateWithinMonths',function(){
    it('should return true if the date is within the range',function(){
      var d = new Date();
      expect(queryHelpersService.isDateWithinMonths(d,0,1)).to.be.true;
    });
    it('should return false if the date is after the range',function(){
      var d = new Date();
      expect(queryHelpersService.isDateWithinMonths(d,10,20)).to.be.false;
    });
    it('should return true if the date is before the range',function(){
      var d = new Date();d.setFullYear(2000);
      expect(queryHelpersService.isDateWithinMonths(d,1,2)).to.be.false;
    });
  });
  describe('isDateWithinMonth',function(){
    it('should return true if the date is within the desired month+year',function(){
      var d = new Date();
      expect(queryHelpersService.isDateWithinMonth(d,0)).to.be.true;
    });
    it('should return false if the date is after the desired month+year',function(){
      var d = new Date();
      expect(queryHelpersService.isDateWithinMonth(d,10)).to.be.false;
    });
    it('should return true if the date is before the desired month+year',function(){
      var d = new Date();d.setFullYear(2000);
      expect(queryHelpersService.isDateWithinMonths(d,1)).to.be.false;
    });
  });



});