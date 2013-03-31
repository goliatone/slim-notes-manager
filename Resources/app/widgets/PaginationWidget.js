/*global define:true, App:true*/
define(function(){
	var PaginationWidget = function(){};

	PaginationWidget.prototype.initialize = function(){
		console.log('PaginationWidget init ', arguments);
	};

	PaginationWidget.prototype.render = function(){
		//App.render(this);
	};

	return PaginationWidget;
});