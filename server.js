var i2c = require('i2c'),
	async = require('async');

var EventEmitter = require('events').EventEmitter;
var Gpio = require('onoff').Gpio,        // Constructor function for Gpio objects.
    button = new Gpio(18, 'in', 'both', {
    	debounceTimeout : 250,
        persistentWatch : true
    });


var address = 0x5a;
var wire = new i2c(address, {device: '/dev/i2c-1', debug: false}); // point to your i2c address, debug provides REPL interface

var MHD_R = 0x2B;
var NHD_R = 0x2C;
var NCL_R = 0x2D;
var FDL_R = 0x2E;
var MHD_F = 0x2F;
var NHD_F = 0x30;
var NCL_F = 0x31;
var FDL_F = 0x32;
var ELE0_T = 0x41;
var ELE0_R = 0x42;
var ELE1_T = 0x43;
var ELE1_R = 0x44;
var ELE2_T = 0x45;
var ELE2_R = 0x46;
var ELE3_T = 0x47;
var ELE3_R = 0x48;
var ELE4_T = 0x49;
var ELE4_R = 0x4A;
var ELE5_T = 0x4B;
var ELE5_R = 0x4C;
var ELE6_T = 0x4D;
var ELE6_R = 0x4E;
var ELE7_T = 0x4F;
var ELE7_R = 0x50;
var ELE8_T = 0x51;
var ELE8_R = 0x52;
var ELE9_T = 0x53;
var ELE9_R = 0x54;
var ELE10_T = 0x55;
var ELE10_R = 0x56;
var ELE11_T = 0x57;
var ELE11_R = 0x58;
var FIL_CFG = 0x5D;
var ELE_CFG = 0x5E;
var GPIO_CTRL0 = 0x73;
var GPIO_CTRL1 = 0x74;
var GPIO_DATA = 0x75;
var GPIO_DIR = 0x76;
var GPIO_EN = 0x77;
var GPIO_SET = 0x78;
var GPIO_CLEAR = 0x79;
var GPIO_TOGGLE = 0x7A;
var ATO_CFG0 = 0x7B;
var ATO_CFGU = 0x7D;
var ATO_CFGL = 0x7E;
var ATO_CFGT = 0x7F;

var TOU_THRESH = 0x06;
var REL_THRESH = 0x0A;

function readData(address){
	wire.writeByte(0x00, null);
	wire.writeByte(0x01, null);
	wire.readBytes(function(err, res1) {
		if (err) return console.log(err+',read failed');
		var msb = res1;
	    wire.readBytes(function(err, res2) {
	    	if (err) return console.log(err+',read failed');
	    	var lsb = res2;
		      if (!err) {
		        var touch = (msb << 8) | lsb;
		        console.log("touched " + touch);
		      }
	    });
	});
}

function setup(address){

	wire.writeBytes(ELE_CFG, 0x00, null)

	// Section A - Controls filtering when data is > baseline.

	wire.writeBytes(MHD_R, [0x01], null)
	wire.writeBytes(NHD_R, [0x01], null)
	wire.writeBytes(NCL_R, [0x00], null)
	wire.writeBytes(FDL_R, [0x00], null)

	// Section B - Controls filtering when data is < baseline.

	wire.writeBytes(MHD_F, [0x01], null)
	wire.writeBytes(NHD_F, [0x01], null)
	wire.writeBytes(NCL_F, [0xFF], null)
	wire.writeBytes(FDL_F, [0x02], null)	

	//Section C - Sets touch and release thresholds for each electrode

	wire.writeBytes(ELE0_T, [TOU_THRESH], null)
	wire.writeBytes(ELE0_R, [REL_THRESH], null)

	wire.writeBytes(ELE1_T, [TOU_THRESH], null)
	wire.writeBytes(ELE1_R, [REL_THRESH], null)

	wire.writeBytes(ELE2_T, [TOU_THRESH], null)
	wire.writeBytes(ELE2_R, REL_THRESH, null)

	wire.writeBytes(ELE3_T, [TOU_THRESH], null)
	wire.writeBytes(ELE3_R, [REL_THRESH], null)

	wire.writeBytes(ELE4_T, [TOU_THRESH], null)
	wire.writeBytes(ELE4_R, [REL_THRESH], null)

	wire.writeBytes(ELE5_T, [TOU_THRESH], null)
	wire.writeBytes(ELE5_R, [REL_THRESH], null)

	wire.writeBytes(ELE6_T, [TOU_THRESH], null)
	wire.writeBytes(ELE6_R, [REL_THRESH], null)

	wire.writeBytes(ELE7_T, [TOU_THRESH], null)
	wire.writeBytes(ELE7_R, [REL_THRESH], null)

	wire.writeBytes(ELE8_T, [TOU_THRESH], null)
	wire.writeBytes(ELE8_R, [REL_THRESH], null)

	wire.writeBytes(ELE9_T, [TOU_THRESH], null)
	wire.writeBytes(ELE9_R, [REL_THRESH], null)

	wire.writeBytes(ELE10_T, [TOU_THRESH], null)
	wire.writeBytes(ELE10_R, [REL_THRESH], null)

	wire.writeBytes(ELE11_T, [TOU_THRESH], null)
	wire.writeBytes(ELE11_R, [REL_THRESH], null)	

	// Section D
	// Set the Filter Configuration
	// Set ESI2

	wire.writeBytes(FIL_CFG, [0x04], null)

	// Section E
	// Electrode Configuration
	// Set ELE_CFG to 0x00 to return to standby mode

	wire.writeBytes(ELE_CFG, [0x0C], null)  //Enables all 12 Electrodes	

}

setup();
var loop = setInterval(function(){
	touchData = readData(address);
	//console.log(touchData);
},2000);

