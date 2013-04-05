/*global define:true, Ti:true, EpicEditor:true*/
define( function(){

    var Queue = function(){
        this.reset();
    };

    Queue.prototype.reset = function(){
        this.methods = [];
        this.queue = [];

        this.aborted = false;

        // public fields
        this.finished = false;
    };

    Queue.prototype.add = function(fn) {
        this.methods.push(fn);
    };

    // starts the sequence from the first function
    // fires 'onStart' if exists
    Queue.prototype.start = function(){
        this.methods = this.queue.concat();
        
        this.aborted=false;

        this.next();

        //We can hook fire event
        if( typeof this.onStart ==='function') this.onStart();
    };

    /**
     * Executes next method in queue.
     */
    Queue.prototype.next = function () {
        // if sequence was aborted - ignore next statements
        if (this.aborted) return;

        var fn = this.methods.shift();

        if(!fn) return this.end();

        // calls the function with the sequence as an argument
        fn();
    };

    // ends the sequence
    // fires 'onEnd' if exists
    Queue.prototype.end = function () {

        if (typeof this.onEnd === 'function') this.onEnd();
        this.finished=true;
    };

    
    // aborts the sequence by setting the index to 'not started' and the flag aborted to true
    Queue.prototype.abort = function () {
        this.aborted=true;
    };

});