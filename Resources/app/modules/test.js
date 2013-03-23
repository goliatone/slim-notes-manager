define([], function() {
    var test = function(){};
    test.prototype.hola = function(){
    	console.log('hola');
    };

    return test;
});