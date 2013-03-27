/*global define:true, App:true*/
define(function(){
	var Dashboard = function(){};

	Dashboard.prototype.templates = {
		
	};
	
	Dashboard.prototype.routes = {
		'dashboard' : 'render'
	};

	Dashboard.prototype.render = function(){
		App.render(this);
	};

	return new Dashboard();
});