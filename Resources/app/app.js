/*global define:true, require:true, EpicEditor:true*/
define(['handlebars'],function(Handlebars){

/**
 * TODO: Add parametrized routes.
 *
 * TODO: Support multiple templates for each module.
 *
 * TODO: Add preloader show/hide, so we can call it from any controller.
 *       and attach it to the current module holder.
 *
 * TODO: Add transitions, defer intro-outro callback. Hide current, show
 *       loader, hide loader, show content.
 *
 */

    var defaultConfig = {
        hashFragment:'#!/',
        templateExtension:'tpl'
    };

    var App = function(config){
        console.log('Hola');

    };

    /**
     * All routes.
     * @type {Object}
     */
    App.prototype.routes = {};

    /**
     * Modules.
     * @type {Object}
     */
    App.prototype.scope = {};


    /**
     * Dependencies container.
     * @type {Object}
     */
    App.prototype.dependencies = {};


    App.prototype.initialize = function(){
        console.log('initialize');
        var self = this;
        var moduleId;
        var module;
        //Cheat, fuck it.
        window.App = this;

        //proxy to wireModules.
        require(this.modules, function(){
            for(var i=0, max = arguments.length; i < max; i++){
                //module is actually its id.
                moduleId = self.modules[i].split('/').pop();

                //TODO: Do we want to work with objects or classes?
                //how do we know if its an instance or a 'class'?!
                module = arguments[i];
                self.scope[moduleId] = module;

                module.mid = moduleId;
                module.el = document.getElementById(moduleId);

                if(typeof jQuery !== 'undefined')
                    module.$el = jQuery('#'+moduleId);
            }

            self.router();
        });

        //Shim bind
        if(!Function.prototype.bind){
            this.shim_bind();
        }
    };

    //rename, this is an initalization task.
    App.prototype.router = function(){
        var self = this;
        var hash = window.location.hash;
        var module;
        for(var moduleId in this.scope){
            if(!this.scope.hasOwnProperty(moduleId)) continue;
            module = this.scope[moduleId];
            for(var route in module.routes ){
                //hide to method, just add the route and module.
                if(this.routes.hasOwnProperty(route)){
                    this.routes[route].push([moduleId, module.routes[route]]);
                } else {
                    this.routes[route] = [[moduleId, module.routes[route]]];
                }
            }
        }

        this.loadUrl(hash);

        window.onhashchange = function(){
            self.loadUrl(window.location.hash);
        };
    };

    /**
     * @method loadUrl
     *
     * Checks to verify that current route matches
     * a module's route, passes it to the processor()
     * and hides all modules that don't need to be
     * rendered
     *
     * @param {String} fragment The current hash
     */
    App.prototype.loadUrl = function(hash){
        console.log('loading hash ', hash);
        var el_lock;
        var moduleId;
        var queryData = {};
        var i, t;
        hash = hash.replace('#!/','');

        //query string
        hash = hash.split('?');

        if(hash[1]){
            //TODO: Move to helper method.
            var qs = hash[1].split('&');
            for (i = 0, t = qs.length; i < t; i++) {
                var bits = qs[i].split('=');
                queryData[bits[0]] = bits[1];
            }
        }

        this.activeRoute = hash[0];

        this.queryData = queryData;

        for(var route in this.routes){
            if(!this.routes.hasOwnProperty(route)) continue;

            for(i = 0, t = this.routes[route].length;i < t; i++){
                moduleId = this.routes[route][i][0];
                console.log('moduel name ',moduleId, el_lock);
                if(hash[0] === route || route === '*'){
                    if(el_lock === moduleId) continue;
                    el_lock =  moduleId;
                    this.processor(moduleId, this.routes[route][i][1], queryData);
                } else {
                    this.unrender(moduleId);
                }
            }
        }
    };

    /**
     * @method processor
     *
     * Handles processing of the module, loads template, fires dependency loader then the route event
     *
     * @param {Object} module The module object to be used.
     * @param {Function} route_fn The return function from the route.
     * @param {Object} queryData The data from any url query strings
     */
    App.prototype.processor = function(module, route_fn, queryData){
        console.log('processor ', module, route_fn, queryData);

        var self = this;
        var scope = this.scope[module];

        scope.loaded = true;

        if(!scope.hasOwnProperty('template')){
            var o = {};
            //TODO: make build url method.
            o.url = 'app/templates/'+scope.mid+'.tpl';
            o.type = 'GET';
            //TODO: proxy, fire event.
            o.success = function(data){
                scope.template = data;
                //TODO: DRY.
                self.loadDependencies(scope, function(){
                    scope[route_fn](queryData);
                });
            };
            o.error = function(){
                console.log('Error Loading '+scope.mid+'.tpl');
            };
            
            this.ajax(o);
        } else {
            self.loadDependencies(scope, function(){
                scope[route_fn](queryData);
            });
        }
    };

    App.prototype.loadTemplate = function(scope, callback){

    };

    /**
     * @method loadDependencies
     *
     * Checks for & loads any dependencies before calling the route's function
     *
     * @param {Object} scope The module object to be used.
     * @param {Function} callback Function to execute when all deps are loaded
     */
    App.prototype.loadDependencies = function(scope, callback){
        var self = this;
        var dep_name;
        var dep_src;
        var arr_dep_name = [];
        var arr_dep_src = [];

        if(scope.hasOwnProperty('dependencies')){
            for(var dep in scope.dependencies){
                if(scope.depencencies.hasOwnProperty(dep)){
                    dep_name = dep;
                    dep_src = scope.dependencies[dep];

                    if(self.dependencies.hasOwnProperty(dep_src)){
                        scope[dep_name] = self.dependencies[dep_src];
                    } else {
                        arr_dep_name.push(dep_name);
                        arr_dep_src.push(dep_src);
                    }
                }
            }
            require(arr_dep_src, function(){
                for(var i=0,max=arguments.length;i<max;i++){
                    scope[arr_dep_name[i]] = arguments[i];

                    self.dependencies[arr_dep_src[i]] = arguments[i];
                }
                //TODO: DRY
                if(callback && typeof callback === 'function')
                    callback(scope);
            });
        } else {
            //module no dependent
            //TODO: DRY
            if(callback && typeof callback === 'function')
                    callback(scope);
        }
    };

    /**
     * TODO: Add transition command to hide/show. Handle transitions!
     * @method render
     *
     * Renders a module's template onto the screen
     *
     * @param {Object} scope The module object to be used.
     * @param {Object} [data] Any data to be rendered onto the template.
     */
    App.prototype.render = function(scope, data){
        var template = scope.template;
        var el = document.getElementById(scope.mid);
        //TODO: WHAT DO WE DO WHEN el IS NULL?

        //TODO: Inject renderer, its just a method
        //that should take template and data and return
        //a HTML string.
        var renderer = Handlebars.compile(template);
        var rendered = renderer(data);

        el.innerHTML = rendered;
        el.style.display = 'block';

        this.delegateEvent(scope.events, scope);
    };

    /**
     * TODO: Add transition command to hide/show. Handle transitions!
     * @method unrender
     *
     * Removes unused modules' content from DOM and sets display to none
     *
     * @param {String} moduleId The name of the module to unrender
     */
    App.prototype.unrender = function(moduleId){
        document.getElementById(moduleId).innerHTML = '';
        document.getElementById(moduleId).style.display = 'none';
    };
    
    /**
     * @method access
     *
     * Proxy function for accessing other modules and their dependencies
     *
     * @param {Object} module Name of the module to access
     * @param {Function} callback The function to fire once access is complete
     */
    App.prototype.access = function(module, callback){
        var self = this;
        var scope = this.scope[module];
        if(!scope.hasOwnProperty('loaded')){
            self.loadDependencies(scope, function(scope){
                scope.loaded = true;
                //TODO: DRY
                if(callback && typeof callback === 'function'){
                    callback(scope);
                }
            });
        } else {
            //TODO: DRY
            if(callback && typeof callback === 'function'){
                callback(scope);
            }
        }
    };

    /**
     * @method navigate
     *
     * Responsible for updating the history hash, and changing the URL
     *
     * @param  {String} fragment The location to be loaded
     * @return {Boolean}
     */
    App.prototype.navigate = function(hash){
        hash = hash.replace('#','');
        var location = window.location;
        var root = location.pathname.replace(/[^\/]$/, '$&');
        var self = this;
        var url = root + location.search + '#!/' + hash;

        if(history.pushState) history.pushState(null, document.title, url);
        else location.replace(url);
        

        return true;
    };

    /**
     * @method delegateEvents
     *
     * Binds callbacks for a module's events object
     *
     * @param {Object} events Events to be watched for
     * @param {Object} scope The current module
     */
    App.prototype.delegateEvent = function(events, scope){
        var method;
        var match;
        var type;
        var selector;
        var nodes;
        var self = this;

        if(!events) return;

        var delegateEventSplitter = /^(\S+)\s*(.*)$/;

        for(var key in events){
            if(events.hasOwnProperty(key)){
                method = events[key];
                match  = key.match(delegateEventSplitter);
                type = match[1];
                selector = match[2];

                /*
                 * bind method on event for selector on scope.mid
                 * the caller function has access to event,
                 * App, and scope
                 */
                nodes = document.querySelectorAll('#' + scope.mid + ' ' + selector);

                for(var i=0, t=nodes.length; i<t;i++){
                    self.bindEvent(nodes[i],type, scope[method].bind(scope), true);
                }
            }
        }
    };

    /**
     * @method bindEvent
     *
     * Used to bind events to DOM objects
     *
     * @param {Object} el Element on which to attach event
     * @param {String} e Event name
     * @param {Function} fn Function to be called
     * @param {Boolean} [pdef] Boolean to preventDefault
     */
    App.prototype.bindEvent = function(el, e, fn, pdef){
        //this might not be ok
        pdef = pdef || false;

        var handleBinding = function(event){
            if(pdef){
                event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            }
            fn(event);
        };

        if(el.addEventListener) el.addEventListener(e, handleBinding, false);
        else el.attachEvent('on'+e, handleBinding);
        
    };

    App.prototype.ajax = function(){
        if(typeof jQuery === 'undefined')
            throw Error('App needs ajax layer support.');

        jQuery.ajax.apply(jQuery, arguments);
    };

    return App;
});