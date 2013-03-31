/**
 * Main should initalize app and ensure it runs from the right
 * state. IE, load config, detect language.
 * Its the sell.
 */
/*global define:true, Dropbox:true*/
define(['app','handlebars'/*,'dropbox'*/], function(App, Handlebars, Dropbox) {
   console.log('test');

   //TODO: Modularize, and do event driven shait!
   var client;/* = new Dropbox.Client({
       key: 'EkJsaJ8XFVA=|RPorHRP3qrB42A5gcDxpEJ3EVl6EL8qw0bxoEhD22g==', sandbox: true
   });*/

   var app = new App({}, client);

   //get either from config file, or from metadata in the
   //page. lets start by metadata ;) we can generate it from
   //backend template and it should be self contained.
   app.modules = [
      // 'modules/ui/header',
      'modules/ui/navigation',
      'modules/notes/controller',
      'modules/dashboard',
      'modules/settings'
      // 'modules/notes/edit',
      // 'modules/notes/list'
   ];
app.initialize();
   
/*
   client.authDriver(new Dropbox.Drivers.Redirect());
   client.authenticate(function(error, client) {
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

        client.readdir('/articles/', function(error, entries) {
            if (error) {
                return app.showError(error);  // Something went wrong.
            }

            client.readFile('/articles/'+entries[1], function(error, data) {
                if (error) {
                    return app.showError(error);
                }
                // data is an ArrayBuffer instance holding the image.
                console.log('we have data');
                console.log(data);
            });
        });
   });
*/
   

   
});