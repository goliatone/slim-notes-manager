/*global require:true*/
require.config({
    urlArgs: 'bust=v'+(new Date().getTime()),
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        },
        'jquery': {
            exports: '$'
        },
        //We need to explicitly declare $ dependency here. Else fail!
        'bootstrap':{
            deps: ['jquery']
        },
        'dropbox':{
            exports:'Dropbox'
        }
    },
    // Libraries
    paths: {
        'bootstrap': 'libs/bootstrap/bootstrap',
        // 'bootstrap-datepicker': '../javascripts/vendors/bootstrap/bootstrap.datepicker',
        'jquery':'libs/jquery',
        'jsyaml': 'libs/js-yaml',
        'dateformat': 'libs/date.format',
        'epiceditor': 'libs/epiceditor/js/epiceditor',
        'handlebars': 'libs/handlebars',
        'dropbox': 'libs/dropbox.min',
        'widgets':'widgets'
    }
});

require(['main','jquery', 'bootstrap', 'handlebars'/*, 'dropbox'*/]);