/*global define:true, require:true, EpicEditor:true, Ti:true*/
define(['handlebars'],function(Handlebars){

/**
 * TODO: Right now we need to add a div with module id where we want
 *       it to be rendered, so to add a new module we have to add it to
 *       the boostrap file AND to the markup. Perhaps we can have a default
 *       content id, and we get that from the module?
 *
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
        templateExtension:'tpl',
        loader:'ajaxLoader',
        basePath:''
    };

    if(typeof Ti !== 'undefined'){
        console.log('WE HAVE DESKTOP APP');
        defaultConfig.loader = 'fileLoader';
        defaultConfig.basePath = Ti.API.application.getResourcesPath();
    }

    var App = function(config, dropbox){
        console.log('Hola');
        this.dropbox = dropbox;
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

    App.prototype.processed = {};

    App.prototype.showError = function(e){
        console.log(e);
    };

    App.prototype.initialize = function(){
        console.log('Initialize');
        var self = this;
        var moduleId;
        var module;
        //Cheat, fuck it.
        window.App = this;

        //TODO: Double check we have valid method.
        this.loader = this[defaultConfig.loader];

        //proxy to wireModules.
        require(this.modules, function(){
            // console.log('Require modules ', arguments);
            for(var i=0, max = arguments.length; i < max; i++){
                //module is actually its id.
                moduleId = self.modules[i].split('/').pop();
                console.log('Initialize module ', moduleId);
                //TODO: Do we want to work with objects or constructors?
                //typeof module === 'function' => constructor, we have to create it.
                //typeof module === 'object' => instance.
                module = arguments[i];
                self.scope[moduleId] = module;
                self.processed[moduleId] = false;

                module.mid = moduleId;
                module.el  = document.getElementById(moduleId);

                if(typeof jQuery !== 'undefined')
                    module.$el = jQuery('#'+moduleId);
            }

            self.router();
        });

        //Shim bind
        if(!Function.prototype.bind){
            this.shimBind();
        }
    };

    //rename, this is an initalization task.
    App.prototype.router = function(){
        var self = this;
        var hash = window.location.hash;
        var module;
        var route;
        console.log('Initialize router');

        for(var moduleId in this.scope){
            if(!this.scope.hasOwnProperty(moduleId)) continue;
            module = this.scope[moduleId];
            // console.log('Initializing routes for ', moduleId);
            for(var routeId in module.routes ){
                // console.log('   ',moduleId, ' route: ', routeId);
                route = {mid:moduleId, handler:module.routes[routeId], id:routeId};
                //hide to method, just add the route and module.
                if(this.routes.hasOwnProperty(routeId)){
                    // this.routes[route].push([moduleId, module.routes[route]]);
                    this.routes[routeId].push(route);
                } else {
                    // this.routes[route] = [[moduleId, module.routes[route]]];
                    this.routes[routeId] = [route];
                }
            }
        }

        this.loadUrl(hash);

        //TODO: Delegate, proxy.
        window.onhashchange = function(){
            console.log('onhashchange ', window.location.hash);
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
        console.log('- Loading hash ', hash);
        var lastModuleId;
        var queryData = {};
        var i, t, route;
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
        //TODO: How should we encapsulate data?!
        this.queryData.__data = $.extend( {}, this.navigateData);
        this.navigateData = null;

        //TODO: DRY, we can move to walk, and the provide the actual
        //logic that is different for both loops.
        
        //TODO: This seems inefficient, we first unrender all
        //and then render the active stuff...DOES IT MAKE SENSE?!
        for(var routeId in this.routes){
            if(!this.routes.hasOwnProperty(routeId)) continue;
            for(i = 0, t = this.routes[routeId].length; i < t; i++){
                route = this.routes[routeId][i];
                this.unrender(route.mid);
            }
        }

        for(var routeId in this.routes){
            if(!this.routes.hasOwnProperty(routeId)) continue;
            for(i = 0, t = this.routes[routeId].length; i < t; i++){
                route = this.routes[routeId][i];
                if(this.activeRoute === routeId || routeId === '*'){
                    //TODO: Include in first if.

                    if(lastModuleId === route.mid) continue;

                    lastModuleId =  route.mid;
                    if(this.processed[route.mid] === false){
                        console.log('We are first rendering ', route.mid);

                        this.processor(route.mid, route.handler, queryData);
                    }else{
                        console.log('We are updateing self!!! ', route.mid);
                        var scope = this.scope[route.mid];
                        scope[route.handler](queryData);
                    }
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
        console.log('>>>> processor ', module, route_fn);

        var self  = this;
        var scope = this.scope[module];

        

        //we are assuming that each controller has a template. wrong?
        //we should declare our templates in the module.
        //one module/controller can have more than one template,
        //one template per action/route.
        if('templates' in scope){
            console.log('we are inside loading templates');
            //instances template cache.
            // scope.templates = {};
            // scope.templates.__loaded__ = {};

            //ITERATE OVER ALL TEMPLATES, IF NONE, JUST
            //ASSUME THAT WE WANT TO LOAD A TEMPLATE WITH MID.
            var templates = scope.templates;

            if(this.isEmptyObject(templates) &&
               !('skipTemplates' in scope)){
                templates[scope.mid] = '';
            }

            var current = 0;
            var total   = this.objectLength(templates);
            $.each(templates, function(templateId, templateValue) {
                // console.log('****** Loading stuff for ', templateId);
                
                self.loader({
                    url:self.templateUrl(templateId),
                    type:'GET',
                    success:function(data){
                        // templates[template] = data;
                        // console.log(arguments);

                        scope.templates[templateId] = data;
                        // console.log('===== Loaded template ',templateId, ' cur ', current+1, ' tot ', total);
                        if(++current === total ){
                            // console.log('Loaded all templates for ', module);
                            self.loadDependencies(scope, function(){
                                // console.log('Loaded all dependencies for ', scope.mid);
                                scope.loaded = true;
                                self.processed[module] = true;
                                scope[route_fn](queryData);
                            });
                        }
                    },
                    error:function(){
                        console.log('Error loading template '+templateId+'.'+defaultConfig.templateExtension);
                    }
                });
            });
            
            
            /*var o = {};
            //TODO: make build url method.
            o.url = self.templateUrl(scope.mid);
            o.type = 'GET';
            //TODO: proxy, fire event.
            o.success = function(data){
                scope.templates[scope.mid] = data;
                //TODO: DRY.
                self.loadDependencies(scope, function(){
                    scope[route_fn](queryData);
                });
            };
            o.error = function(){
                console.log('Error Loading '+scope.mid+'.tpl');
            };
            
            this.ajax(o);*/
        } else {
            // console.log('we are in dependencies')
            self.loadDependencies(scope, function(){
                scope[route_fn](queryData);
            });
        }
    };

    App.prototype.templateUrl = function(templateId, ext){
        
        return defaultConfig.basePath+'/app/templates/'+ templateId +'.'+defaultConfig.templateExtension;
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
        var name, src;
        var names = [];
        var srcs = [];

        if('dependencies' in scope){
            for(var dep in scope.dependencies){

                if(scope.dependencies.hasOwnProperty(dep)){
                    name = dep;
                    src = scope.dependencies[dep];
                    
                    if(self.dependencies.hasOwnProperty(src)){
                        scope[name] = self.dependencies[src];
                    } else {
                        srcs.push(src);
                        names.push(name);
                    }
                }
            }

            require(srcs, function(){
                for(var i=0,t=arguments.length; i<t; i++){
                    scope[names[i]] = arguments[i];

                    self.dependencies[srcs[i]] = arguments[i];
                }
                //TODO: DRY, trigger event!
                if(callback && typeof callback === 'function')
                    callback(scope);
            });
        } else {
            // console.log('+++++++WE DONT HAVE DEPENDENCIES ', scope.mid);
            //module no dependent
            //TODO: DRY, trigger event!
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
    App.prototype.render = function(scope, data, templateId){
        templateId = templateId || scope.mid;

        // console.log(' == DO RENDER ',scope.mid, templateId);
        var template = scope.templates[templateId];
        // console.log('Template is: ', typeof template);
        // console.log(template);
        // console.log(template.textContent);
        // console.log(template.innerHTML);
        if(typeof template !== 'string') return console.log('WHAT THE HELL!!!');
        // console.log('scope: ', scope);

        //TODO: WHAT DO WE DO WHEN el IS NULL?
        var el = document.getElementById(scope.mid);
        if(!el){
            console.log('Element for module ', scope.mid, ' not included in markup');
        }

        //TODO: We should be caching all this cruft.
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
                // console.log('Access, dependencies loaded');
                //TODO: DRY, trigger event!
                if(callback && typeof callback === 'function'){
                    callback(scope);
                }
            });
        } else {
            //TODO: DRY, trigger event!
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
    App.prototype.navigate = function(hash, data){
        console.log('Navigate hash ', hash);
        
        this.navigateData = data;

        hash = hash.replace('#','');

        var self = this;
        var location = window.location;
        var root = location.pathname.replace(/[^\/]$/, '$&');
        var url = root + location.search + '#!/' + hash;

        if(history.pushState) {
            history.pushState(null, document.title, url);
            self.loadUrl(hash);
        } else location.replace(url);
        

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
                if('preventDefault' in event) event.preventDefault();
                else event.returnValue = false;
            }
            fn(event);
        };

        if(el.addEventListener) el.addEventListener(e, handleBinding, false);
        else el.attachEvent('on' + e, handleBinding);
        
    };

    App.prototype.fileLoader = function(loader){
        // console.log('*****************************')
        // console.log('loader ',loader);
        var fi = Ti.Filesystem.getFile(loader.url);
        var content = '', line;
        while(line = fi.readLine()){
            content += line+'\n';
        }
        // console.log(content);
        // console.log('-------------');
        loader.success(content);
    };

    App.prototype.ajaxLoader = function(){
        if(typeof jQuery === 'undefined')
            throw Error('App needs ajax layer support.');

        jQuery.ajax.apply(jQuery, arguments);
    };

    //TODO: Move to helper?
    App.prototype.shimBind = function () {
        Function.prototype.bind = function (obj) {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            if (typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var slice = [].slice,
                args = slice.call(arguments, 1),
                self = this,
                nop = function () { },
                bound = function () {
                    return self.apply(this instanceof nop ? this : (obj || {}),
                                      args.concat(slice.call(arguments)));
                };

            bound.prototype = this.prototype;

            return bound;
        };
    };
    App.prototype.isEmptyObject = function( obj ) {
        var name;
        for ( name in obj ) return false;
        return true;
    };

    App.prototype.objectLength = function(obj){
        var prop, count = 0;

        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) count++;
        }

        return count;
    };

    App.prototype.resolvePropertyChain=function(target, chain){
        if (!chain && typeof target === 'string') {
            chain  = target;
            target = this;//We could use global if node.
        }

        if(typeof chain === 'string') chain = chain.split('.');
        var l = chain.length, i = 0, p = '';
        for (; i < l; i++ ) {
            p = chain[i];
            if ( target.hasOwnProperty( p ) ) target = target[ p ];
            else return null;
        }
        return target;
    };

    return App;
});