/*global Ti:true, jsyaml:true, EpicEditor:true*/
;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document);

  $(document).ready(function() {

    var G = {};
    G.sync = function(){};
    G.sync.NOTE_DELIMETER = '\n\n';
    G.sync.NOTE_EXTENSION = 'yaml';
    G.sync.prototype.installPath = function(){return this.DPB_PATH + this.APP_PATH;};
    G.sync.prototype.DPB_PATH = '/Users/emilianoburgos/Dropbox/';
    G.sync.prototype.APP_PATH = 'Apps/yotostore/articles';

    G.sync.prototype.createPost = function(){
        
        var content = this.editor.getElement('editor').body.innerHTML;
        content = editor.exportFile();
        console.log('---------');
        console.log(content);
        console.log('---------');
        var p = {};
        p.title = $('input[name=title]').val();
        p.slug = $('input[name=slug]').val();
        p.date = $('input[name=date]').val();
        var tags = $('input[name=tags]').val().split(',');
        p.tags = [];

        for(var tag in tags){
            p.tags.push(tags[tag].trim());
        }

        console.log(p);
        var file = Ti.Filesystem.getFile(this.installPath()+'/'+p.slug+'.yaml');
        
        if(!file.exists())
            file.touch();

        var post = jsyaml.dump(p);
        post = '---\n'+post+G.sync.NOTE_DELIMETER+content;

        file.write(post);
        // this.editor.open();
        // 
        var preview = Ti.UI.createWindow('http://google.com');
        preview.setTitle('New Title');
        preview.open();
    };


    G.sync.prototype.getAllPosts = function(){

        var file = Ti.Filesystem.getFile(this.installPath());

        if(file.exists())
        {
            var files = file.getDirectoryListing( );
            for( var i=0;i<files.length; i++){
                if(files[i].extension() !== G.sync.NOTE_EXTENSION)
                    files.splice(i, 1);

                // console.log(files[i].extension());
            }
            // console.log(typeof files);
            console.log(files);
            console.log(files[1]);
            var post_ref = files[1];
            var path = post_ref.nativePath();
            var post = Ti.Filesystem.getFile(path);
            
            var content = '';
            var line;
            // post.readLine();
            while(line = post.readLine()){
                content += line+'\n';
            }
            //we shuld remove the first line return.
            console.log(content);
            
            //we use a character delimiter for content!!! UPDATE PHP SIDE!
            var lines = content.split(G.sync.NOTE_DELIMETER);
            var meta = lines.shift();
            content  = lines.join(G.sync.NOTE_DELIMETER);

            var obj = jsyaml.load(meta);
            console.log('-----');
            console.log(obj);
            console.log('-----');
            $('textarea[name=content]').addClass('peep').val(content);
            $('input[name=title]').val(obj.title);
            $('input[name=slug]').val(obj.slug);
            $('input[name=date]').val(obj.date.format("yyyy-mm-dd"));
            $('input[name=tags]').val(obj.tags.join(', '));

            editor.importFile('post', content);
            editor.reflow();
        }
    };

    G.manager = new G.sync();

    $('#post-submit').on('click', function(){
        console.log('i was clicked');
        var message = 'This is the message: '+$('textarea[name=content]').val();
        var note = Ti.Notification.createNotification();
        note.setMessage(message);
        note.show();
        // G.manager.getAllPosts();
        G.manager.createPost();
        console.log('i was clicked');
    });

    $('textarea[name=content]').hide();

    $('#sidebar').css({height:$(window).height()});
    $(window).on('resize',function(){
        $('#sidebar').css({height:$(window).height()});
        editor.reflow();
    });

    var opts =
    {
        container: 'epiceditor',
        basePath:'plugins/epiceditor',
        textarea:$('textarea[name=content]'),
        focusOnLoad: true
    };

    var editor = new EpicEditor(opts).load();
    G.manager.editor = editor;
  });
})(jQuery, this);