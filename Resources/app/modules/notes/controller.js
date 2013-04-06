/*global define:true, App:true, EpicEditor:true*/
define(['jquery'], function($){

    var NotesController = function(){
        this.notes = { notes: [
         {id:1, title:'Hello YotoManager', date:'2013-03-17', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
         {id:2, title:'I can Haz Templates', date:'2013-03-18', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
         {id:3, title:'This is a title', date:'2013-03-07', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
         {id:4, title:'Handlebars in tha house', date:'2013-04-17', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'}
        ]};
    };

    NotesController.prototype.events = {
        'click .trigger' : 'handleTriggers',
        'click #create-note-save' : 'handleCreateButton',
        'click #create-note-cancel' :'handleCancelButton',
        'click #create-note-add-parameter': 'handleAddParameterButton'
    };

    

    NotesController.prototype.dependencies = {
        'Sync': 'utils/sync',
        'Binder': 'utils/binder',
        // 'helpers':'utils/helpers',
        // 'jsyaml': 'libs/js-yaml',
        'date.format': 'libs/date.format',
        'epiceditor': 'libs/epiceditor/js/epiceditor',
        'bootstrap-datepicker': 'libs/bootstrap/bootstrap.datepicker',
        'Note': 'modules/notes/model'
        //TODO: Ideally we would get this from DOM and then load.
        ,'NoteWidget':'widgets/NoteWidget'
        ,'PaginationWidget':'widgets/PaginationWidget'
    };

    NotesController.prototype.templates = {
        'notes/create':'empty',
        'notes/edit':'empty',
        'notes/list':'empty'
    };

    NotesController.prototype.routes = {
        'note/list'   : 'routeList',
        'note/edit'   : 'routeEdit',
        'note/delete' : 'routeDelete',
        'note/create' : 'routeCreate'
    };

    NotesController.prototype.render = function(data, templateId){
        console.log('NotesController render ', data, templateId);
       
        App.render(this, data, templateId);
    };

    /**
     * Module method that will be fired after dependencies
     * and templates are loaded and before we are rendering
     * the inial route.
     * On subsecuent routes this will not be called.
     *
     */
    NotesController.prototype.processed = function(){
        //scope, mappings, post
        var mapping = [
            {
                key:'dropbox',
                setter:$.proxy( this.Sync.setService, this.Sync )
            },
            {
                key:'yamlParser',
                setter:$.proxy( this.Sync.setParser, this.Sync )
            }
        ];

        var onMapped = function(){console.log('We are mapped!!')};

        App.injector.solveMappings(this, mapping, onMapped);
    };


/////////////////////////////////////////////////////////
//  ROUTES HANDLERS
/////////////////////////////////////////////////////////
    NotesController.prototype.routeList = function(data){
        console.log('>>> list notes ', this.helpers);
        // var notes = this.Sync.getAllNotes(this.doRouteLis);
        var callback = $.proxy(this.doRouteList, this);
        console.log('callback ',callback);
        var notes = this.Sync.getAllNotes(callback);
    };

    NotesController.prototype.doRouteList = function(notes){
        console.log('============================');
        /*
        var note = new this.Note();
        note.title = 'test';
        note.content = 'hola, how are you doing';
        console.log('This is a note ', note);*/
        
        console.log(notes);
        //TODO: Rename directory notes to note, so that
        //it matches url pattern.
        this.render(notes, 'notes/list');

        //TODO:Move pagination stuff here. Use pagination as
        //widget, we listen to events from here. Pagination
        //does not need to know about us, we just care about
        //events, and to update its data/view.
        this.pagination = new this.PaginationWidget();
        this.pagination.owner = this;
        this.pagination.initialize();

        console.log(this);
            
        
        var self = this;

        $('.actions').on('click', 'button', function(){
            var id = $(this).parent().data('parent-id');
            var action = $(this).data('action');
            action = action.charAt(0).toUpperCase() + action.slice(1);
            console.log(action, ' for ', id);
            self['action'+action](id);
        });
        
        $('.pagination').on('click', 'a', function(e){
            e.preventDefault();
            console.log('We click a pagination item');
            return false;
        });
    };

    NotesController.prototype.routeEdit = function(data){
        console.log('edit notes', data);
        this.render(data, 'notes/edit');


        var id = App.resolvePropertyChain(data, '__data.id');
       
        if(!id) return App.navigate('note/list');
        console.log('edit note ', id);

        var note = this.Sync.notesIds[id];
        
        if(!note) App.navigate('note/list');

        //TODO: Make note a Note model. Move this to model.
        if(typeof note.date === 'string') note.date = new Date(note.date);

        var self = this;
        
        // console.log('textarea ', $('textarea[name=content]'));
        // console.log('epiceditor ', $('body').html());

        $('.datepicker').datepicker({autoclose:true});
        
        
        $('input[name=title]').change(function(){
            console.log('We are changed!!');
            var title = $(this).val();
            var slug = function(str) {
                str = str.replace(/^\s+|\s+$/g, ''); // trim
                str = str.toLowerCase();

                // remove accents, swap ñ for n, etc
                var from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
                var to   = 'aaaaaeeeeeiiiiooooouuuunc------';
                for (var i=0, l=from.length ; i<l ; i++) {
                    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                }

                str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                      .replace(/\s+/g, '-') // collapse whitespace and replace by -
                      .replace(/-+/g, '-'); // collapse dashes

                return str;
            };

            $('input[name=slug]').val(slug(title)).focus();
        });

        //TODO: Bind model to form.
        $('input[name=title]').val(note.title);
        $('input[name=slug]').val(note.slug);

        //BUG FIX: BOOTSTRAP.DATEPICKER craps out if we pass a Date
        //expects string. hack=> date + ""
        if(note.date){
            console.log('We have date ', note.date);
            $('input[name=date]').val(note.date.format('yyyy-mm-dd') + '');
        } else {
            console.log('We dont have a fucking date!');
            $('input[name=date]').val( new Date().format('yyyy-mm-dd') + '');
        }

        $('input[name=tags]').val(note.tags);//.split(',');

        var $textarea = $('textarea[name=content]');
        $textarea.hide();
        var opts =
        {
            container: 'epiceditor',
            basePath:'app/libs/epiceditor',
            textarea:$textarea,
            focusOnLoad: true,
            file: {
                name: note.title,
                defaultContent: note.content,
                autoSave: 100
            }
        };

        self.editor = new EpicEditor(opts);
        self.editor.load();

        self.editor.importFile(note.title, note.content);
        self.editor.reflow();

        $(window).on('resize',function(){
            self.editor.reflow();
        });
    };

    NotesController.prototype.routeCreate = function(data){
        
        console.log('create notes');
        this.render(data, 'notes/create');

        var self = this;
        var $textarea = $('textarea[name=content]');
        $textarea.hide();
        var opts =
        {
            container: 'epiceditor',
            basePath:'app/libs/epiceditor',
            textarea:$textarea,
            focusOnLoad: true
        };
        // console.log('textarea ', $('textarea[name=content]'));
        // console.log('epiceditor ', $('body').html());
        self.editor = new EpicEditor(opts);//.load();
        
        self.editor.load();

        $('.datepicker').datepicker();
        
        
        $('input[name=title]').change(function(){
            console.log('We are changed!!');
            var title = $(this).val();
            var slug = function(str) {
                str = str.replace(/^\s+|\s+$/g, ''); // trim
                str = str.toLowerCase();

                // remove accents, swap ñ for n, etc
                var from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
                var to   = 'aaaaaeeeeeiiiiooooouuuunc------';
                for (var i=0, l=from.length ; i<l ; i++) {
                    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                }

                str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                      .replace(/\s+/g, '-') // collapse whitespace and replace by -
                      .replace(/-+/g, '-'); // collapse dashes

                return str;
            };

            $('input[name=slug]').val(slug(title)).focus();
        });
        
    };

    NotesController.prototype.routeDelete = function(data){
        console.log('delete notes');
        this.render(data, 'notes/delete');
    };

/////////////////////////////////////////////////////////
//  EVENT HANDLERS
/////////////////////////////////////////////////////////
    NotesController.prototype.handleCreateButton = function(){
        console.log('Create Note');
    };

    NotesController.prototype.handleCancelButton = function(){
        App.navigate('note/list');
    };

    NotesController.prototype.handleAddParameterButton = function(){

    };

    NotesController.prototype.handleToolbarButton = function(e){
        var target = e.target;
        console.log(target);
    };

    /**
     * Generic trigger handler, we implement Command pattern,
     * but since this is javascript, dont tell.
     *
     * @param  {Object} e Event
     */
    NotesController.prototype.handleTriggers = function(e){
        var action = $(e.target).data('trigger-action');
        var params = $(e.target).data('trigger-params');
        console.log('We are triggering action ', action, ' with params ', params);
        console.log('Hei, you: ',params.msg,' # ',params.id);
        // App.trigger(action);
    };

/////////////////////////////////////////////////////////
//  ACTION HANDLERS
/////////////////////////////////////////////////////////

    NotesController.prototype.actionPreview = function(id){
        console.log('Preview ', id);
    };

    NotesController.prototype.actionEdit = function(id){
        App.navigate('note/edit',{id:id});
    };

    NotesController.prototype.actionDelete = function(id){
        var $modal = $('#note-delete-modal');
        $modal.modal('show');
        $('#note-delete-modal-btn').click(function(){
            $modal.modal('hide');
        });
    };

    return new NotesController();
});