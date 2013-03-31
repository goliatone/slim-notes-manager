/*global define:true, App:true, EpicEditor:true*/
define(function(){

    var NotesController = function(){
        this.notes = { notes: [
         {id:1, title:'Hello YotoManager', date:'2013-03-17', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
         {id:2, title:'I can Haz Templates', date:'2013-03-18', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
         {id:3, title:'This is a title', date:'2013-03-07', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
         {id:4, title:'Handlebars in tha house', date:'2013-04-17', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'}
        ]};
    };

    NotesController.prototype.events = {
        'click #create-note-save' : 'handleCreateButton',
        'click #create-note-cancel' :'handleCancelButton',
        'click #create-note-add-parameter': 'handleAddParameterButton'
    };

    

    NotesController.prototype.dependencies = {
        'Sync': 'utils/sync',
        'jsyaml': 'libs/js-yaml',
        'date.format': 'libs/date.format',
        'epiceditor': 'libs/epiceditor/js/epiceditor',
        'bootstrap-datepicker': 'libs/bootstrap/bootstrap.datepicker',
        'Note': 'modules/notes/model'
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
        console.log('---------------');
    };

/////////////////////////////////////////////////////////
//  ROUTES HANDLERS
/////////////////////////////////////////////////////////
    NotesController.prototype.routeList = function(data){
        console.log('>>> list notes');
        // var notes = this.Sync.getAllNotes();
        // console.log('------- ', notes);
        
        
        var note = new this.Note();
        note.title = 'test';
        note.content = 'hola, how are you doing';
        console.log('This is a note ', note);
        
        //TODO: Rename directory notes to note, so that 
        //it matches url pattern.
        this.render(this.notes, 'notes/list');
        var widgets = $('.Widget').each(function(){
            var widget = $(this).data('widget');
            console.log(widget)
        });
        // var widgets = $('*').filter(function(){return $(this).data('widget') !== undefined;});
        // 
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
        console.log('ID OF POST ', id);
        return;
        if(!id) return App.navigate('note/list');

        var note = this.notes[data.__data.id];
        if(!note) App.navigate('note/list');
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