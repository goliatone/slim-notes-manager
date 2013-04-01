/*global define:true*/
define(['jquery'], function($){
    console.log($);

    var Binder = function(){};


    Binder.prototype.bind = function(id){
        // Use a jQuery object as simple PubSub
        var pubSub = $({});

        // We expect a `data` element specifying the binding
        // in the form: data-bind-<object_id>='<property_name>'
        var data_attr = 'bind-' + id;
        var message = id + ':change';

        // Listen to change events on elements with the data-binding attribute and proxy
        // them to the PubSub, so that the change is 'broadcasted' to all connected objects
        $( document ).on( 'change', '[data-' + data_attr + ']', function( evt ) {
            var $input = $( this );
            pubSub.trigger( message, [ $input.data( data_attr ), $input.val() ] );
        });

        // PubSub propagates changes to all bound elements, setting value of
        // input tags or HTML content of other tags
        pubSub.on( message, function( evt, prop, val ) {
            $( '[data-' + data_attr + '=' + prop + ']' ).each( function() {
                var $bound = $( this );

                if ( $bound.is('input, textarea, select') ) {
                    $bound.val( val );
                } else {
                    $bound.html( val );
                }
            });
        });

        return pubSub;
    };
    
    return Binder;
});