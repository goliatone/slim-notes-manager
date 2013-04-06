/*global define:true, Ti:true, EpicEditor:true*/
// define(['app/libs/yaml.js', 'queue'], function(jsyaml, Queue){
define([/*'jsyaml',*/ 'queue'], function(jsyaml, Queue){
/**
 * TODO: Abstract in base class, have three implementations, one file
 * system based, using Ti, one using dropbox, and one using git.
 *
 * TODO: Implement Queue/Promise system. Lightweight!!!
 *
 */
   console.log('---------------------------');
   console.log('*  Queue ', Queue);
   console.log('*  jsyaml ', jsyaml);
   console.log('---------------------------');

    var Sync = function(){
        this.notes = [];
        this.notesIds = {};
    };

    Sync.NOTE_DELIMETER = '\n\n';
    Sync.NOTE_EXTENSION = 'yaml';
    Sync.prototype.installPath = function(){return this.DPB_PATH + this.APP_PATH;};
    Sync.prototype.DPB_PATH = '/Users/emilianoburgos/Dropbox/';
    Sync.prototype.APP_PATH = 'Apps/yotostore/articles';

    Sync.prototype.setService = function(service){
        this.service = service;
    };

    Sync.prototype.setParser = function(parser){
        this.parser = parser;
    };

    Sync.prototype.createNote = function(post){
        var tags = post.tags;
        for(var tag in tags){
            post.tags.push(tags[tag].trim());
        }

        console.log(post);
        var file = Ti.Filesystem.getFile(this.installPath()+'/'+post.slug+'.yaml');
        
        if(!file.exists())
            file.touch();

        var meta = window.YAML.dump(post);
        meta = '---\n' + meta + Sync.NOTE_DELIMETER + post.content;

        file.write(meta);
    };

    Sync.prototype.getAllNotes = function(callback, refresh){
        
        if(refresh === false ) return callback(this.notes);
        
        this.notes = [];
        this.notesIds = {};

        var self = this;
        var client = this.service;
        self.callback = callback;

        client.readdir('/articles/', function(error, entries) {
            if (error) {
                return console.log(error);  // Something went wrong.
            }
            //TODO: Move this into promise.
            self.entries = entries;
            // self.callback = callback;
            self.index = 0;
            // callback(entries);
            entries.map(self.getNote, self);
        });
    };

    Sync.prototype.getNote = function(entrie){
        var self = this;
        this.service.readFile('/articles/'+entrie, function(error, data) {
            if (error) {
                return console.log(error);
            }

            console.log('WE HAVE RAGAMUFFIN DATA ', data);
            
            var lines = data.split(Sync.NOTE_DELIMETER);
            var meta  = lines.shift();

            var obj = window.YAML.load(meta);
            obj.content  = lines.join(Sync.NOTE_DELIMETER);

            console.log('== NOTE LOADED: ',obj.title);

            self.index++;
            self.notesIds[obj.slug] = obj;
            self.notes.push(obj);

            if(self.index ===
               self.entries.length &&
               typeof self.callback === 'function'){
                console.log('====== EXIT NOTES CALLBACK');
                self.callback({notes:self.notes});
                self.callback = null;
            } else console.log('total ', self.entries.length, ' index ', self.index, ' callback ', self.callback);
        });
    };

    Sync.prototype.getAllNotesTi = function(){

        var file = Ti.Filesystem.getFile(this.installPath());
        var path, note, content, line, lines, meta,obj;
        var output = [];

        if(file.exists())
        {
            var files = file.getDirectoryListing( );
            for( var i=0;i<files.length; i++){
                if(files[i].extension() !== Sync.NOTE_EXTENSION) continue;

                path = files[i].nativePath();
                note = Ti.Filesystem.getFile(path);
                
                content = '';
                
                while(line = note.readLine()){
                    content += line+'\n';
                }
                
                
                //we use a character delimiter for content!!! UPDATE PHP SIDE!
                lines = content.split(Sync.NOTE_DELIMETER);
                meta  = lines.shift();

                obj = jsyaml.load(meta);
                obj.content  = lines.join(Sync.NOTE_DELIMETER);
                output.push(obj);
            }
        }
        return output;
    };

    return new Sync();
});