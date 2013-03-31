/*global define:true, App:true*/
define(function(){
	var NoteWidget = function(){};

	NoteWidget.prototype.initialize = function(){
		console.log('NoteWidget init ', arguments);
	};

	NoteWidget.prototype.render = function(){
		//App.render(this);
	};

	return NoteWidget;
});