require.config({
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
        'bootstrap': '../javascripts/vendors/bootstrap/bootstrap',
        // 'bootstrap-datepicker': '../javascripts/vendors/bootstrap/bootstrap.datepicker',
        'jsyaml': '../javascripts/vendors/js-yaml',
        'dateformat': '../javascripts/vendors/date.format',
        // 'epiceditor': '../plugins/epiceditor/js/epiceditor',
        'handlebars': '../javascripts/vendors/handlebars',
        'dropbox': 'libs/dropbox.min'
    }
});

require(['main', 'bootstrap', 'handlebars', 'dropbox']);