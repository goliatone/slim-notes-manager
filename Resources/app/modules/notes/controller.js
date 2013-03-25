/*global define:true, App:true*/
define(function(){
	var NotesController = function(){};

	NotesController.prototype.routes = {
		'*' : 'render',
		'note/list' : 'list',
		'note/edit' : 'edit',
		'note/delete' : 'delete',
		'note/create' : 'create'
	};

	NotesController.prototype.list = function(){

	};

	NotesController.prototype.edit = function(){

	};

	NotesController.prototype.create = function(){
		this.render();
	};

	NotesController.prototype.delete = function(){

	};

	NotesController.prototype.render = function(){
		var data = { notes: [
	     {id:1, title:'Hello YotoManager', date:'2013-03-17', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
	     {id:2, title:'I can Haz Templates', date:'2013-03-18', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
	     {id:3, title:'This is a title', date:'2013-03-07', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
	     {id:4, title:'Handlebars in tha house', date:'2013-04-17', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'}
	    ]};
		App.render(this, data);
	};

	return new NotesController();
});