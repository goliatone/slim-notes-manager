/**
 * Main should initalize app and ensure it runs from the right
 * state. IE, load config, detect language.
 * Its the sell.
 */
/*global define:true*/
define(['app','handlebars'], function(App, Handlebars) {
   console.log('test');

   var app = new App();

   //get either from config file, or from metadata in the
   //page. lets start by metadata ;) we can generate it from
   //backend template and it should be self contained.
   app.modules = [
      'modules/ui/header',
      'modules/ui/navigation',
      'modules/notes/controller',
      'modules/dashboard',
      'modules/settings'
      // 'modules/notes/edit',
      // 'modules/notes/list'
   ];

   app.initialize();
});