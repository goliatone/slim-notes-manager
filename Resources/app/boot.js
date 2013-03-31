/*global require:true*/
require.config({
    urlArgs: 'bust=v'+(new Date().getTime()),
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        },
        'dropbox':{
            exports:'Dropbox'
        }
    },
    // Libraries
    paths: {
        'bootstrap': 'libs/bootstrap/bootstrap',
        // 'bootstrap-datepicker': '../javascripts/vendors/bootstrap/bootstrap.datepicker',
        'jsyaml': 'libs/js-yaml',
        'dateformat': 'libs/date.format',
        'epiceditor': 'libs/epiceditor/js/epiceditor',
        'handlebars': 'libs/handlebars',
        'dropbox': 'libs/dropbox.min'
    }
});

require(['main', 'bootstrap', 'handlebars'/*, 'dropbox'*/]);