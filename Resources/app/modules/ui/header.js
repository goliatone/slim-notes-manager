/*global define:true, App:true*/
define(function(){
	var Header = function(){};

	Header.prototype.templates = {};
	
	Header.prototype.routes = {
		'*' : 'render'
	};

	Header.prototype.render = function(){
		App.render(this);
	};

	return new Header();
});