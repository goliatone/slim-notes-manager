/**
 * Main should initalize app and ensure it runs from the right
 * state. IE, load config, detect language.
 * Its the sell.
 *
 * READ:
 * http://www.ericfeminella.com/blog/2012/12/15/basic-dependency-injection-with-requirejs/
 */
/*global define:true, Dropbox:true*/
define(['app','handlebars', 'injector','dropbox', 'marked'], function(App, Handlebars, Injector, Dropbox, marked) {
   console.log('test ');

   


    /***************************************/
   //Simple mapping/DIC
   var injector = new Injector();

   
   //TODO: Modularize, and do event driven shait!
   var client = new Dropbox.Client({
       key: 'EkJsaJ8XFVA=|RPorHRP3qrB42A5gcDxpEJ3EVl6EL8qw0bxoEhD22g==', sandbox: true
   });

   injector.addInstance('dropbox', client);
   injector.addInstance('yamlParser', window.YAML);
   injector.addInstance('marker', marked);


   var app = new App({});
   app.injector = injector;

   //get either from config file, or from metadata in the
   //page. lets start by metadata ;) we can generate it from
   //backend template and it should be self contained.
   app.modules = [
      'modules/ui/navigation',
      'modules/notes/controller',
      'modules/dashboard',
      'modules/settings'
   ];

// app.initialize();
   

    client.authDriver(new Dropbox.Drivers.Redirect({rememberUser: true}));

    client.authenticate({interactive: false}, function(error, client) {
        if (client.isAuthenticated()) {
            app.initialize(client);
            app.navigate('');
        } else {
            client.authenticate(function(error, client){
                if (error) {
                    // Replace with a call to your own error-handling code.
                    //
                    // Don't forget to return from the callback, so you don't execute the code
                    // that assumes everything went well.
                    return app.showError(error);
                }

                // Replace with a call to your own application code.
                //
                // The user authorized your app, and everything went well.
                // client is a Dropbox.Client instance that you can use to make API calls.
                app.initialize(client);
                app.navigate('');
            });
        }
        
   });

});