require.config({
    urlArgs: 'bust=v'+(new Date().getTime()), // Comment out/remove to enable caching
    baseUrl: 'javascripts/',
    paths: {
        colt:  'vendors/colt.0.5.1',
        // bootstrap:'vendors/bootstrap',
        // handlebars:'vendors/handlebars'
    }
    // shim: {
    //     'handlebars': {
    //         exports: 'Handlebars'
    //     }
    // }
});

define(["colt"], function (Colt) {

    // Define all of the modules
    Colt.modules = [
        "modules/header",
        "modules/navigation",
        "modules/modone",
        "modules/modtwo",
        "modules/modthree",
        "modules/modform"
    ];

    // Initialize application
    Colt.init();
console.log('hlaa');
});

;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document);

   $('.datepicker').datepicker();
  
})(jQuery, this);