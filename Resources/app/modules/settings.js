/*global define:true, App:true*/
define(function(){

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
		console.log('Update tab!', this, e);
		$(e.target).tab('show');
	};

	Settings.prototype.render = function(){
		App.render(this);
		$('#myTab a:last').tab('show');
	};

	return new Settings();
});