/*global define:true*/
define(['jquery'], function($){


    var Config = function(){

    };

    Config.DEFAULT_META_NAMESPACE = 'app';

    Config.prototype.metadata = function(namespace){
        var self = this;
        namespace = namespace || (namespace = Config.DEFAULT_META_NAMESPACE);
        $('meta[name^=\''+ namespace +'-\']').forEach(function(el){
            self.addMeta(el.name.replace( namespace +'-',''), el.content, namespace);
        });
    };

    Config.prototype.addMeta = function(key, value, namespace){
        if(!(namespace in this.meta)) this.meta[namespace] = {};
        this.meta[namespace][key] = value;
    };

    return Config;

});