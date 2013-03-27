/*global define:true, App:true*/
define(function(){
	var Settings = function(){};

	Settings.prototype.templates = {
		
	};
	
	Settings.prototype.routes = {
		'settings' : 'render'
	};

	Settings.prototype.render = function(){
		App.render(this);
	};

	return new Settings();
});