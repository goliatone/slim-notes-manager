/*global define:true, App:true, EpicEditor:true*/
define(function(){

    var Note = function(){};
    Note.prototype.title = '';
    Note.prototype.slug = '';
    Note.prototype.categories = [];
    Note.prototype.content = '';
    Note.prototype.date = null;
    Note.prototype.tags = [];
    Note.prototype.addTag = function(tag){
        tag = tag.split(',');

        for(var t in tag){
            this.tags.push(tag[t].trim());
        }
    };
    Note.prototype.getTags = function(){
        return this.tags;
    };
    

    return Note;
});