/*global define:true, App:true*/
define(['jquery'], function($){
	
	var Settings = function(){};

	Settings.prototype.templates = {
		
	};

	Settings.prototype.events = {
		'click #myTab a' : 'updateTab'
	};
	
	Settings.prototype.routes = {
		'settings' : 'render'
	};

	Settings.prototype.initialize = function(){
		console.log('Initializing Settings!');
	};

	Settings.prototype.updateTab = function(e){
		$(e.target).tab('show');
	};

	Settings.prototype.render = function(){
		App.render(this);
		$('#myTab a:last').tab('show');
	};

	return new Settings();
});