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
      'modules/notes/controller'
      // 'modules/notes/create',
      // 'modules/notes/edit',
      // 'modules/notes/list'
   ];

   app.initialize();

    var source   = $('#note-template').html();
    var template = Handlebars.compile(source);
    var data = { notes: [
     {id:1, title:'Hello YotoManager', date:'2013-03-17', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
     {id:2, title:'I can Haz Templates', date:'2013-03-18', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
     {id:3, title:'This is a title', date:'2013-03-07', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'},
     {id:4, title:'Handlebars in tha house', date:'2013-04-17', content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio.'}
    ]};
    $('#notes-holder').html(template(data));
});