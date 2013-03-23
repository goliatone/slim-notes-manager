require.config({
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        }
    },
    // Libraries
    paths: {
        'colt':  'vendors/colt.0.5.1',
        'bootstrap': '../javascripts/vendors/bootstrap/bootstrap',
        'bootstrap-datepicker': '../javascripts/vendors/bootstrap/bootstrap.datepicker',
        'date.format': '../javascripts/vendors/js-yaml',
        'js-yaml': '../javascripts/vendors/date.format',
        'epiceditor': '../plugins/epiceditor/js/epiceditor',
        'handlebars': '../javascripts/vendors/handlebars'
    }
});

require(['main', 'bootstrap', 'handlebars']);