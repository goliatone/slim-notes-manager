/*global define:true, App:true, EpicEditor:true*/
define(function(){

    var NotesController = function(){};

    NotesController.prototype.dependencies = {
        'bootstrap-datepicker': '../javascripts/vendors/bootstrap/bootstrap.datepicker',
        'date.format': '../javascripts/vendors/js-yaml',
        'js-yaml': '../javascripts/vendors/date.format',
        'epiceditor': '../plugins/epiceditor/js/epiceditor'
    };

    NotesController.prototype.templates = {
        'notes/create':'',
        'notes/edit':'',
        'notes/list':''
    };

    NotesController.prototype.routes = {
        'note/list' : 'list',
        'note/edit' : 'edit',
        'note/delete' : 'delete',
        'note/create' : 'create'
    };

    NotesController.prototype.list = function(data){
        console.log('>>> list notes');
         var data = { notes: [
         {id:1, title:'Hello YotoManager', date:'2013-03-17', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
         {id:2, title:'I can Haz Templates', date:'2013-03-18', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
         {id:3, title:'This is a title', date:'2013-03-07', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
         {id:4, title:'Handlebars in tha house', date:'2013-04-17', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'}
        ]};
        this.render(data, 'notes/list');
    };

    NotesController.prototype.edit = function(data){
        console.log('edit notes');
        this.render(data, 'notes/edit');
    };

    NotesController.prototype.create = function(data){
        
        console.log('create notes');
        this.render(data, 'notes/create');

        if(!this.editor){
            var self = this;
            var $textarea = $('textarea[name=content]');
            $textarea.hide();
            var opts =
            {
                container: 'epiceditor',
                basePath:'../plugins/epiceditor',
                textarea:$textarea,
                focusOnLoad: true
            };
            // console.log('textarea ', $('textarea[name=content]'));
            // console.log('epiceditor ', $('body').html());
            self.editor = new EpicEditor(opts);//.load();
            
            self.editor.load();
        }
    };

    NotesController.prototype.delete = function(data){
        console.log('delete notes');
        this.render(data, 'notes/delete');
    };

    NotesController.prototype.render = function(data, templateId){
        console.log('NotesController render ', data, templateId);
       
        App.render(this, data, templateId);
        console.log('---------------');
    };

    return new NotesController();
});