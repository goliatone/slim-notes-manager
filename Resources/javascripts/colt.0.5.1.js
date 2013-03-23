/**
 * Copyright (c) 2013 ColtJS
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE
 */



define(function () {

    /**
     * The main Colt object
     * @type {Object}
     */
    var Colt = {

        /**
         * Container for all routes
         * @type {Object}
         */
        routes: {},

        /**
         * Container for all module objects
         * @type {Object}
         */
        scope: {},

        /**
         * Conatiner for all dependencies
         * @type {Object}
         */
        dependencies: {},

        /**
         * @method init
         * 
         * Adds module to Colt object, sets up core properties and initializes router
         */
        init: function () {

            var module,
                _this = this;

            // Make available in global scope
            window.Colt = this;

            require(this.modules, function () {

                // Load modules into application scope
                for (var i = 0, max = arguments.length; i < max; i++) {
                    module = _this.modules[i].split("/").pop();
                    _this.scope[module] = arguments[i];
                    // Add module-id to scope
                    _this.scope[module].mid = module;
                    // Create element reference
                    _this.scope[module].el = document.getElementById(module);
                    // If jQuery is available create jQuery accessible DOM reference
                    if (typeof jQuery !== "undefined") {
                        _this.scope[module].$el = jQuery("#" + module);
                    }
                }

                // Call the router
                _this.router();

            });

            // Polyfill for bind()
            if (!Function.prototype.bind) {
                this.polyfill_bind();
            }

        },

        /**
         * @method router
         * 
         * Sets up Routing Table, binds and loads Routes
         */
        router: function () {

            var cur_route = window.location.hash,
                _this = this;

            for (var module in this.scope) {
                if (this.scope.hasOwnProperty(module)) {
                    for (var route in this.scope[module].routes) {
                        if (!this.routes.hasOwnProperty(route)) {
                            this.routes[route] = [[module, this.scope[module].routes[route]]];
                        } else {
                            this.routes[route].push([module,this.scope[module].routes[route]]);
                        }
                    }
                }
            }

            // Initial route
            this.loadUrl(cur_route);

            // Bind change
            window.onhashchange = function () {
                _this.loadUrl(window.location.hash);
            };

        },

        /**
         * @method loadUrl
         * 
         * Checks to verify that current route matches a module's route, passes it to the processor() and hides all modules that don't need to be rendered
         * 
         * @param {String} fragment The current hash
         */
        loadUrl: function (fragment) {
            var el_lock,
                module_name,
                url_data = {};

            // Break apart fragment
            fragment = fragment.replace("#!/", "");

            // Check for URL Data (Query String)
            fragment = fragment.split("?");
            if (fragment[1]) {
                var qs = fragment[1].split("&");
                for (var i = 0, max = qs.length; i < max; i++) {
                    var bits = qs[i].split("=");
                    url_data[bits[0]] = bits[1];
                }
            }

            // Store current route
            this.current_route = fragment[0];

            // Store url data
            this.url_data = url_data;

            // Check route for match(es)
            for (var route in this.routes) {
                if (this.routes.hasOwnProperty(route)) {
                    for (var _i = 0, _max = this.routes[route].length; _i < _max; _i++) {
                        // Get Name
                        module_name = this.routes[route][_i][0];

                        // Check route for match
                        if (fragment[0] === route || route === "*") {

                            if (el_lock !== module_name) {
                                // Prevents other routes in the same module from hiding this
                                el_lock = module_name;
                                // Send module to processor
                                this.processor(module_name, this.routes[route][_i][1], url_data);
                            }

                        } else {
                            // Clear & Hide sections that don't exist in current route
                            this.unrender(module_name);
                        }
                    }
                }
            }

        },

        /**
         * @method processor
         * 
         * Handles processing of the module, loads template, fires dependency loader then the route event
         * 
         * @param {Object} module The module object to be used.
         * @param {Function} route_fn The return function from the route.
         * @param {Object} url_data The data from any url query strings
         */
        processor: function (module, route_fn, url_data) {

            var scope = this.scope[module],
                _this = this;
                
            // Set module to loaded
            scope.loaded = true;

            // Check to see if we are using inline template or if template has already been loaded/defined
            if (!scope.hasOwnProperty("template")) {
                
                this.ajax({
                    url: "templates/" + scope.mid + ".tpl",
                    type: "GET",
                    success: function(data) {
                        scope.template = data;
                        _this.loadDependencies(scope,function(){
                            // Run route after deps are loaded
                            scope[route_fn](url_data);
                        });
                    },
                    error: function(){
                        console.error("Error Loading " + scope.mid + ".tpl");
                    }
                });

            } else {
                _this.loadDependencies(scope,function(){
                    // Run route after deps are loaded
                    scope[route_fn](url_data);
                });
            }
            
        },
        
        /**
         * @method loadDependencies
         * 
         * Checks for & loads any dependencies before calling the route's function
         * 
         * @param {Object} scope The module object to be used.
         * @param {Function} callback Function to execute when all deps are loaded
         */
        loadDependencies: function(scope, callback) {
            var _this = this,
                dep_name,
                dep_src,
                arr_dep_name = [],
                arr_dep_src = [];

            // Load module's dependencies
            if (scope.hasOwnProperty("dependencies")) {

                // Build Dependency Arrays
                for (var dep in scope.dependencies) {
                    if (scope.dependencies.hasOwnProperty(dep)) {
                        dep_name = dep;
                        dep_src = scope.dependencies[dep];

                        // Check if already loaded into global
                        if (_this.dependencies.hasOwnProperty(dep_src)) {
                            scope[dep_name] = _this.dependencies[dep_src];

                        // Add to array to be pulled via Require
                        } else {
                            arr_dep_name.push(dep_name);
                            arr_dep_src.push(dep_src);
                        }
                    }
                }

                // Load deps and add to object
                require(arr_dep_src, function () {
                    for (var i = 0, max = arguments.length; i < max; i++) {
                        scope[arr_dep_name[i]] = arguments[i];

                        // Store in globally accessible dependencies object
                        _this.dependencies[arr_dep_src[i]] = arguments[i];
                    }
                    // Fire callback
                    if ( callback && typeof callback === "function" ){
                        callback(scope);
                    }
                });

            // Module has no dependencies
            } else {
                // Fire callback
                if ( callback && typeof callback === "function" ){
                    callback(scope);
                }
            }
        },

        /**
         * @method render
         * 
         * Renders a module's template onto the screen
         * 
         * @param {Object} scope The module object to be used.
         * @param {Object} [data] Any data to be rendered onto the template.
         */
        render: function (scope, data) {
            var template = scope.template,
                // Get element
                el = document.getElementById(scope.mid),
                // Replace any mustache-style {{VAR}}'s
                rendered = template.replace(/\{\{([^}]+)\}\}/g, function (i, match) {
                    return data[match];
                });

            // Render to DOM & Show Element
            el.innerHTML = rendered;
            el.style.display = "block";

            // Build Event Listeners
            this.delegateEvents(scope.events, scope);
        },
        
        /**
         * @method unrender
         * 
         * Removes unused modules' content from DOM and sets display to none
         * 
         * @param {String} module_name The name of the module to unrender
         */
        unrender: function(module_name){
            document.getElementById(module_name).innerHTML = "";
            document.getElementById(module_name).style.display = "none";
        },
        
        /**
         * @method access
         * 
         * Proxy function for accessing other modules and their dependencies
         * 
         * @param {Object} module Name of the module to access
         * @param {Function} callback The function to fire once access is complete
         */
        access: function (module, callback) {
            var _this = this,
                scope = this.scope[module];
            if (!scope.hasOwnProperty("loaded")) {
                // Not previously loaded, check for dependencies
                _this.loadDependencies(scope,function(scope) {
                    scope.loaded = true;
                    if (callback && typeof callback === "function") {
                        callback(scope);
                    }
                });
            } else {
                // Module previously loaded, fire callback
                if (callback && typeof callback === "function") {
                    callback(scope);
                }
            }
        },

        /**
         * @method navigate
         * 
         * Responsible for updating the history hash, and changing the URL
         * 
         * @param  {String} fragment The location to be loaded
         * @return {Boolean}
         */
        navigate: function (fragment) {
                
            var location = window.location,
                root = location.pathname.replace(/[^\/]$/, "$&"),
                _this = this;

            if (history.pushState) {
                // Browser supports pushState()
                history.pushState(null,document.title, root + location.search + "#!/" + fragment);
                _this.loadUrl(fragment);
            } else {
                // Older browser fallback
                location.replace(root + location.search + "#!/" + fragment);
            }

            return true;

        },

        /**
         * @method delegateEvents
         * 
         * Binds callbacks for a module's events object
         * 
         * @param {Object} events Events to be watched for
         * @param {Object} scope The current module
         */
        delegateEvents: function (events, scope) {

            var method,
                match,
                event_name,
                selector,
                nodes,
                _this = this;

            // if there are no events on this sectional then we move on
            if (!events) {
                return;
            }

            var delegateEventSplitter = /^(\S+)\s*(.*)$/;
            for (var key in events) {
                if (events.hasOwnProperty(key)) {
                    method = events[key];
                    match = key.match(delegateEventSplitter);
                    event_name = match[1];
                    selector = match[2];
                    /*
                     * bind method on event for selector on scope.mid
                     * the caller function has access to event, Colt, scope
                     */
                    nodes = document.querySelectorAll("#" + scope.mid + " " + selector);

                    for (var i = 0, max = nodes.length; i < max; i++) {
                        _this.bindEvent(nodes[i], event_name, scope[method].bind(scope), true);
                    }
                }
            }
        },

        /**
         * @method bindEvent
         * 
         * Used to bind events to DOM objects
         * 
         * @param {Object} el Element on which to attach event
         * @param {String} evt Event name
         * @param {Function} fn Function to be called
         * @param {Boolean} [pdef] Boolean to preventDefault
         */
        bindEvent: function (el, evt, fn, pdef) {
            pdef = pdef || false;
            if (el.addEventListener) { // Modern browsers
                el.addEventListener(evt, function (event) {
                    if (pdef) { event.preventDefault ? event.preventDefault() : event.returnValue = false; }
                    fn(event);
                }, false);
            } else { // IE <= 8
                el.attachEvent("on" + evt, function (event) {
                    if (pdef) { event.preventDefault ? event.preventDefault() : event.returnValue = false; }
                    fn(event);
                });
            }
        },

        /**
         * @method ajaz
         * 
         * Used to make AJAX calls
         *
         * @param {String} url URL of the resource
         * @param {Object} [config] Configuration object passed into request
         * 
         * **Configuration Object:**
         * 
         * `url`: URL of request if not specified as first argument
         * 
         * `type`: Request method, defaults to `GET`
         * 
         * `async`: Run request asynchronously, defaults to `TRUE`
         * 
         * `cache`: Cache the request, defaults to `TRUE`
         * 
         * `data`: Object or JSON data passed through request
         * 
         * `success`: Function called on successful request
         * 
         * `error`: Function called on failure of request
         */

        ajax: function() {

            // Parent object for all parameters
            var xhr = {};
        
            // Determine call structure: ajax(url, { params }); or ajax({ params });
            if (arguments.length === 1) {
                // All params passed as object
                xhr = arguments[0];
            } else {
                // Populate xhr obj with second argument
                xhr = arguments[1];
                // Add first argument to xhr object as url
                xhr.url = arguments[0];
            }
        
        
            // Parameters & Defaults
            xhr.request = false;
            xhr.type = xhr.type || "GET";
            xhr.data = xhr.data || null;
            if (xhr.cache || !xhr.hasOwnProperty("cache")) { xhr.cache = true; } else { xhr.cache = false; }
            if (xhr.async || !xhr.hasOwnProperty("async")) { xhr.async = true; } else { xhr.async = false; }
            if (xhr.success && typeof xhr.success === "function") { xhr.success = xhr.success; } else { xhr.success = false; }
            if (xhr.error && typeof xhr.error === "function") { xhr.error = xhr.error; } else { xhr.error = false; }
        
            // Format xhr.data & encode values
            if (xhr.data) {
                var param_count = 0,
                    name,
                    value,
                    tmp_data = xhr.data;
                for (var param in tmp_data) {
                    if(tmp_data.hasOwnProperty(param)){
                        name = encodeURIComponent(param);
                        value = encodeURIComponent(tmp_data[param]);
                        if (param_count === 0) {
                            xhr.data = name + "=" + value;
                        } else {
                            xhr.data += "&" + name + "=" + value;
                        }
                        param_count++;
                    }
                }
                xhr.data = xhr.data;
            }
        
            // Appends data to URL
            function formatURL(data) {
                var url_split = xhr.url.split("?");
                if (url_split.length !== 1) {
                    xhr.url += "&" + data;
                } else {
                    xhr.url += "?" + data;
                }
            }
        
            // Handle xhr.data on GET request type
            if (xhr.data && xhr.type.toUpperCase() === "GET") {
                formatURL(xhr.data);
            }
        
            // Check cache parameter, set URL param
            if (!xhr.cache) {
                formatURL(new Date().getTime());
            }
        
            // Establish request
            if (window.XMLHttpRequest) {
                // Modern non-IE
                xhr.request = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                // Internet Explorer
                xhr.request = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                // No request object, break
                return false;
            }
        
            // Monitor ReadyState
            xhr.request.onreadystatechange = function () {
                if (xhr.request.readyState === 4) {
                    if (xhr.request.status === 200) {
                        if (xhr.success) {
                            // Returns responseText and request object
                            xhr.success(xhr.request.responseText, xhr.request);
                        }
                    } else {
                        if (xhr.error) {
                            // Returns request object
                            xhr.error(xhr.request);
                        }
                    }
                }
            };
        
            // Open Http Request connection
            xhr.request.open(xhr.type, xhr.url, xhr.async);
        
            // Set request header for POST
            if (xhr.type.toUpperCase() === "POST") {
                xhr.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            }
        
            // Send data
            xhr.request.send(xhr.data);
        
        },

        /**
         * @method store
         * 
         * LocalStorage with polyfill support via cookies
         * 
         * @param {String} key The key or identifier for the store
         * @param {String|Object} [value] Contents of the store, blank to return, 'null' to clear
         * 
         * Specify a string/object value to `set`, none to `get`, and 'null' to `clear`
         */
        store: function (key, value) {

            var lsSupport = false;

            // Check for native support
            if (localStorage) {
                lsSupport = true;
            }

            // If value is detected, set new or modify store
            if (typeof value !== "undefined" && value !== null) {
                if (lsSupport) { // Native support
                    localStorage.setItem(key, value);
                } else { // Use Cookie
                    this.createCookie(key, value, 30);
                }
            }

            // No value supplied, return value
            if (typeof value === "undefined") {
                if (lsSupport) { // Native support
                    return localStorage.getItem(key);
                } else { // Use cookie
                    return this.readCookie(key);
                }
            }

            // Null specified, remove store
            if (value === null) {
                if (lsSupport) { // Native support
                    localStorage.removeItem(key);
                } else { // Use cookie
                    this.createCookie(key, "", -1);
                }
            }

        },
        
        /**
         * @method createCookie
         * 
         * Creates new cookie or removes cookie with negative expiration
         * 
         * @param {String} key The key or identifier for the store
         * @param {String} value Contents of the store
         * @param {Number} exp Expiration in days
         */
        createCookie: function(key, value, exp) {
            var date = new Date(),
                expires;
            date.setTime(date.getTime() + (exp * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
            document.cookie = key + "=" + value + expires + "; path=/";
        },
        
        /**
         * Returns contents of cookie
         * 
         * @param {String} key The key or identifier for the store
         * @return {String} the value of the cookie
         */
        readCookie: function(key) {
            var nameEQ = key + "=",
                ca = document.cookie.split(";");
            for (var i = 0, max = ca.length; i < max; i++) {
                var c = ca[i];
                while (c.charAt(0) === " ") { c = c.substring(1, c.length); }
                if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
            }
            return null;
        },

        /**
         * Placeholder object for pub/sub
         */
        topics: {},

        /**
         * ID for incrementing
         */
        topic_id: 0,

        /**
         * @method publish
         * 
         * Publish to a topic
         * 
         * @param {String} topic Topic of the subscription
         * @param {Object} args Array of arguments passed
         */
        publish: function (topic, args) {
            var _this = this;
            if (!this.topics.hasOwnProperty(topic)) {
                return false;
            }
            setTimeout(function () {
                var subscribers = _this.topics[topic],
                    len;

                if (subscribers.length) {
                    len = subscribers.length;
                } else {
                    return false;
                }

                while (len--) {
                    subscribers[len].fn(args);
                }
            }, 0);
            return true;
        },

        /**
         * @method subscribe
         * 
         * Subscribes to a topic
         * 
         * @param {String} topic Topic of the subscription
         * @param {Function} fn Function to be called
         */
        subscribe: function (topic, fn) {
            var id = ++this.topic_id;
            if (!this.topics[topic]) {
                this.topics[topic] = [];
            }
            this.topics[topic].push({
                id: id,
                fn: fn
            });
            return id;
        },

        /**
         * @method unsubscribe
         * 
         * Unsubscribes from a topic
         * 
         * @param {String} token Token of the subscription
         */
        unsubscribe: function (token) {
            for (var topic in this.topics) {
                if (this.topics.hasOwnProperty(topic)) {
                    for (var i = 0, max = this.topics[topic].length; i < max; i++) {
                        if (this.topics[topic][i].id === token) {
                            this.topics[topic].splice(i, 1);
                            return token;
                        }
                    }
                }
            }
            return false;
        },

        /**
         * @method polyfill_bind
         * 
         * Polyfill for .bind()
         */
        polyfill_bind: function () {
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
        }


    };


    // Return the framework
    return Colt;

});