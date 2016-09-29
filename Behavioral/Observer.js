/*
	Observer Pattern

	Define a one-to-many dependency between objects so that when one object changes state,
	all its dependents are notified and updated automatically.

	Subject: maintains a list of observers, facilitates adding or removing observers
	Observer: provides a update interface for objects that need to be notified of a Subject's changes of state
	ConcreteSubject: broadcasts notifications to observers on changes of state, stores the state of ConcreteObservers
	ConcreteObserver: stores a reference to the ConcreteSubject, implements an update interface for the Observer to ensure state is consistent with the Subject's
	Notification: Subject broadcasts Notification to Observers

*/

//////////////////////////////////////////////////////////////////
// Basic Observer Pattern
//////////////////////////////////////////////////////////////////

// Event Dispatcher
/*
 * See more at:
 * http://www.abidibo.net/blog/2014/01/16/javascript-event-dispatcher/
 */

//

var EventDispatcher = {

        _prefix: 'on_',

        listeners: {},

        //register: function(evt_name, bind, callback) { // bind param only needed for legacy browsers
        register: function(evt_name, callback) { // no bind param
            var _evt_name = this._prefix + evt_name;
            if (typeof this.listeners[_evt_name] == 'undefined') {
                this.listeners[_evt_name] = [];
            }
            //this.listeners[_evt_name].push([bind === null ? this : bind, callback]); // bind param only needed for legacy browsers
            this.listeners[_evt_name].push(callback); // no bind param
        },

        emit: function(evt_name, params) {
            var _evt_name = this._prefix + evt_name;
            if (typeof this.listeners[_evt_name] != 'undefined') {
                for (var i = 0, l = this.listeners[_evt_name].length; i < l; i++) {
                    //this.listeners[_evt_name][i][1].call(this.listeners[_evt_name][i][0], evt_name, params); // bind param only needed for legacy browsers
                    this.listeners[_evt_name][i].call(this, evt_name, params); // no bind param
                }
            }
        }

    } ;


	//////////////////////////////////////////////////////////////////
	// Dispatcher as a class
	// with an encapsulated list of listeners available to all Instances
	//////////////////////////////////////////////////////////////////

    var EventDispatcher = (function(){

        // protected list of listeners
        var _prefix='on_', listeners={};

        function EventDispatcher(){};

        EventDispatcher.prototype.register = function(evt_name, callback) {
            var _evt_name = _prefix + evt_name;
            if (typeof listeners[_evt_name] == 'undefined') {
                listeners[_evt_name] = [];
            }
            listeners[_evt_name].push(callback);
        }

        //
        EventDispatcher.prototype.unregister = function(evt_name, callback) {}

        EventDispatcher.prototype.emit = function(evt_name, params) {
            var _evt_name = _prefix + evt_name;
            if (typeof listeners[_evt_name] != 'undefined') {
                for (var i = 0, l = listeners[_evt_name].length; i < l; i++) {
                    listeners[_evt_name][i].call(this, evt_name, params);
                }
            }
        }

        return EventDispatcher ;

    })();


//////////////////////////////////////////////////////////////////
// Basic Observer Pattern
//////////////////////////////////////////////////////////////////



// Observers are functions to be executed


function ObserverPattern(sender) {

    this._sender = sender ;
    this._listeners = [] ;

}

ObserverPattern.prototype = {

	// length:
	// get
	// indexof

    attach : function (listener) {
        this._listeners.push(listener);
    },

    removeAt : function (index) {
    	this._listeners.splice( index, 1 );
    },

    notify : function (args) {
        for (var i = 0; i < this._listeners.length; i += 1) {
            this._listeners[i](this._sender, args);
        }
    }

};

function Listener(sender, args){

}



////////////////////////////////////////////////////////////////////////////////////////
// OBSERVER -- SUBSCRIBE TO TOPIC
////////////////////////////////////////////////////////////////////////////////////////



// EventListener Model -- EventDispatcher
// EventEmitter3 is an advanced version of this https://github.com/primus/eventemitter3

// Described as Mediator in source of code (???)
// https://carldanley.com/js-mediator-pattern/

var Emitter = ( function( window, undefined ) {

	function Emitter() {
		this._topics = {};
	};

	Emitter.prototype.subscribe = function mediatorSubscribe( topic, callback ) {

	    //create a 'topic' if it doesn't exist
	    if( ! this._topics.hasOwnProperty( topic ) ) {
			this._topics[ topic ] = [];
		}

	    // add a callback to the topic
		this._topics[ topic ].push( callback );

	    return true;

	};

	Emitter.prototype.unsubscribe = function mediatorUnsubscribe( topic, callback ) {

		// has the specified property as a direct property of that object;
		// unlike the 'in operator', this method does not check down the object's prototype chain.
		if( ! this._topics.hasOwnProperty( topic ) ) {
			return false;
		}

		for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
			if( this._topics[ topic ][ i ] === callback ) {
				this._topics[ topic ].splice( i, 1 );
				return true;
			}
		}

		return false;
	};

	Emitter.prototype.publish = function mediatorPublish() {

		var args = Array.prototype.slice.call( arguments );
		var topic = args.shift();

		if( ! this._topics.hasOwnProperty( topic ) ) {
			return false;
		}

		for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
			this._topics[ topic ][ i ].apply( undefined, args );
		}

		return true;
	};

	return Emitter;

})( window );


// example subscriber function
var Subscriber = function ExampleSubscriber( myVariable ) {
  console.log( myVariable );
};

// example usages
var publisher = new Emitter();
publisher.subscribe( 'some-event', Subscriber );
publisher.publish( 'some-event', 'foo bar' );



//////////////////////////////////////////////////////////////////
// Observer Pattern achieved via COMPOSITION
//////////////////////////////////////////////////////////////////



// this can be a generic stackinig Class



// OBSERVER PATTERN

function ObserverList(){
	this.observerList = [];
};

// NUMBER OF OBSERVERS
ObserverList.prototype.count = function(){
  return this.observerList.length;
};

// ADD OBSERVER
ObserverList.prototype.add = function( obj ){
  return this.observerList.push( obj );
};

// REMOVE OBSERVER
ObserverList.prototype.removeAt = function( index ){
  this.observerList.splice( index, 1 );
};


// GET OBSERVER
ObserverList.prototype.get = function( index ){
	if( index > -1 && index < this.observerList.length ){
		return this.observerList[ index ];
	}
};

// INDEX OF OBSERVER IN LIST
ObserverList.prototype.indexOf = function( obj, startIndex ){
	var i = startIndex;

	while( i < this.observerList.length ){
		if( this.observerList[i] === obj ){
			return i;
		}
		i++;
	}

	return -1;
};




// SUBJECT becomes 'Dispatcher' via COMPOSITION

function Subject(){
  this.observers = new ObserverList();
}


Subject.prototype.addObserver = function( observer ){
  this.observers.add( observer );
};


Subject.prototype.removeObserver = function( observer ){
  this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
};


//////////////////////////////////////////////////////////////////
// is context  NOTIFICATION
Subject.prototype.notify = function( context ){
	var observerCount = this.observers.count();
	for(var i=0; i < observerCount; i++){
		this.observers.get(i).update( context );
	}
};
//////////////////////////////////////////////////////////////////


// OBSERVER

function Observer(){
  this.update = function(){
    // ...
  };
}

