/*global define:true*/
//http://www.soundstep.com/blog/2012/09/12/infuse-js-ioc-javascript-library/
//http://blog.jankuca.com/post/23066002249/dependency-injection-javascript
define(function(){


    var Injector = function() {
      // this.services = {};
      this.instances = {};
      this.factories = {};
    };

    /**
     * [addFactory description]
     * @param {[type]} key     [description]
     * @param {[type]} factory [description]
     */
    Injector.prototype.addFactory = function(key, factory){
        this.factories[key] = factory;
    };

    /**
     * Add instance to Injector.
     * @param String key      Id of the instance.
     * @param Object instance Object instance.
     */
    Injector.prototype.addInstance = function (key, instance) {
        this.instances[key] = instance;
    };

    /**
     * Returns an instance by ID
     * @param  {[type]} key [description]
     * @return {[type]}     [description]
     */
    Injector.prototype.solveKey = function (key) {
        var instance = this.instances[key];

        if (!instance) {
            var Factory = this.factories[key];
            instance = Factory();
            this.addInstance(key, instance);
        }

        return instance;
    };

    /**
     * [inject description]
     * @param  {[type]} scope  [description]
     * @param  {[type]} key    [description]
     * @param  {[type]} setter [description]
     * @param  {[type]} post   [description]
     * @return {[type]}        [description]
     */
    Injector.prototype.inject = function (scope, key, setter, post, postArgs) {
        var value = this.solveKey(key);
        if(!value) return;

        if(typeof setter === 'function') setter.call(scope, value, key);
        else if( typeof setter === 'string') scope[setter] = value;

        if(post && typeof post === 'function')
            post.call(scope, postArgs);
    };

    /**
     * [solveMappings description]
     * @param  {[type]} scope    [description]
     * @param  {[type]} mappings [description]
     * @param  {[type]} post     [description]
     * @return {[type]}          [description]
     */
    Injector.prototype.solveMappings = function(scope, mappings, post){
        var mapping, args= Array.prototype.splice.call(arguments,3);
        for( var i = 0, t = mappings.length; i<t; i++){
            mapping = mappings[i];
            this.inject(scope, mapping.key, mapping.setter, mapping.post, mapping.postArgs);
        }
        post.apply(scope, args);
    };
    
    return Injector;


});