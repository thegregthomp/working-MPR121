var i2c = require('i2c');
var mpr121 = new i2c(0x5a,{device:'/dev/i2c-1'});

//uncomment to get 100% cpu usage instead of a crash!
/*
process.on( 'SIGSEGV', function() {
});
*/

test();

function test() {
mpr121.readBytes(0x5a,2,function(err,res) {
console.log( res );
setTimeout( test, 1 ); //speed up time it takes to get sig pipe overflow
});
}