/**
 * Main should initalize app and ensure it runs from the right
 * state. IE, load config, detect language.
 * Its the sell.
 */
define(['../app/modules/test','handlebars'], function(Test) {
   console.log('test');
   var source   = $("#note-template").html();
        var template = Handlebars.compile(source);
        var data = { notes: [
           {id:1, title:"Hello YotoManager", date:"2013-03-17", content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio."},
           {id:2, title:"I can Haz Templates", date:"2013-03-18", content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio."},
           {id:3, title:"This is a title", date:"2013-03-07", content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio."},
           {id:4, title:"Handlebars in tha house", date:"2013-04-17", content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec non auctor massa. Duis id tortor consequat odio pharetra fringilla. Suspendisse aliquam, metus hendrerit ullamcorper commodo, ipsum nisi volutpat nisl, vel ultrices lorem mi vulputate magna. Vivamus sit amet sagittis odio."}
        ]};
        $("#notes-holder").html(template(data));
});