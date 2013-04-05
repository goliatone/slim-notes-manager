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
        },
        'jsyaml':{
            exports:'jsyaml'
        }

    },
    // Libraries
    paths: {
        'bootstrap': 'libs/bootstrap/bootstrap',
        // 'bootstrap-datepicker': '../javascripts/vendors/bootstrap/bootstrap.datepicker',
        'jsyaml': 'libs/yaml',
        'jquery':'libs/jquery',
        'marked':'libs/marked',
        'dateformat': 'libs/date.format',
        'epiceditor': 'libs/epiceditor/js/epiceditor',
        'handlebars': 'libs/handlebars',
        'dropbox': 'libs/dropbox.min',
        'queue':'utils/queue',
        'helpers':'utils/helpers',
        'injector':'utils/injector'
    }
});

require(['main','jquery', 'bootstrap', 'handlebars', 'marked']);