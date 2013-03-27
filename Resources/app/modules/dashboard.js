/*global define:true, App:true*/
define(function(){
	var Dashboard = function(){};

	Dashboard.prototype.templates = {
		
	};
	
	Dashboard.prototype.routes = {
		'' : 'render',
		'dashboard' : 'render'
	};

	Dashboard.prototype.render = function(){
		App.render(this);
	};

	return new Dashboard();
});