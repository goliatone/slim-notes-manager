/*global define:true, Ti:true, EpicEditor:true*/
define('dropbox',function(dropbox){
/**
 * TODO: Abstract in base class, have three implementations, one file
 * system based, using Ti, one using dropbox, and one using git.
 *
 */
    console.log('-------------------');
    console.log(dropbox);
    console.log('-------------------');
    var Sync = function(){};
    Sync.NOTE_DELIMETER = '\n\n';
    Sync.NOTE_EXTENSION = 'yaml';
    Sync.prototype.installPath = function(){return this.DPB_PATH + this.APP_PATH;};
    Sync.prototype.DPB_PATH = '/Users/emilianoburgos/Dropbox/';
    Sync.prototype.APP_PATH = 'Apps/yotostore/articles';

    Sync.prototype.createNote = function(post){
        var tags = post.tags;
        for(var tag in tags){
            post.tags.push(tags[tag].trim());
        }

        console.log(post);
        var file = Ti.Filesystem.getFile(this.installPath()+'/'+post.slug+'.yaml');
        
        if(!file.exists())
            file.touch();

        var meta = jsyaml.dump(post);
        meta = '---\n' + meta + Sync.NOTE_DELIMETER + post.content;

        file.write(meta);
    };


    Sync.prototype.getAllNotes = function(){

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