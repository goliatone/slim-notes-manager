/*global define:true, App:true*/
define(function(){
	var Header = function(){};

	Header.prototype.routes = {
		'*' : 'renderHeader'
	};

	Header.prototype.renderHeader = function(){
		App.render(this);
	};

	return new Header();
});