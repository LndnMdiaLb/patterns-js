/*

    **** MEDIATOR ****

    * Reduces the communication relationship from "many-to-many" to "many-to-one"

    According to Gamma et al, the Mediator pattern should be used when:
    a set of objects communicate in well-defined but complex ways. The resulting interdependencies are unstructured and difficult to understand.
    reusing an object is difficult because it refers to and communicates with many other objects.
    a behavior that's distributed between several classes should be customizable without a lot of subclassing.

    http://www.oodesign.com/mediator-pattern.html

*/


// http://www.dofactory.com/javascript/mediator-design-pattern

var Participant = function(name) {

    this.name = name;

    // STORE MEDIATOR (Chatroom)
    this.chatroom = null;

};

Participant.prototype = {

    send: function(message, to) {
        // delegate to Mediators send method passing it itself (this)
        this.chatroom.send(message, this, to);
    },

    receive: function(message, from) {
        console.log(from.name + " to " + this.name + ": " + message);
    }

};


/*

  Mediator Class

*/

var Chatroom = function() {

    // collection of participant objects
    var participants = {};

    return {

        register: function(participant) {
            participants[participant.name] = participant;

            // stores the Mediator in each individual participant during registration
            participant.chatroom = this;
        },

        send: function(message, from, to) {
            if (to) {
                // single message
                // calls participants receive function
                to.receive(message, from);
            } else {
                // broadcast message to all participants
                for (key in participants) {
                    if (participants[key] !== from) {
                        participants[key].receive(message, from);
                    }
                }
            }
        }
    };
};


function run() {

    var yoko = new Participant("Yoko");
    var john = new Participant("John");
    var paul = new Participant("Paul");
    var ringo = new Participant("Ringo");

    var chatroom = new Chatroom();
    chatroom.register(yoko);
    chatroom.register(john);
    chatroom.register(paul);
    chatroom.register(ringo);

    yoko.send("All you need is love.");
    yoko.send("I love you John.");
    john.send("Hey, no need to broadcast", yoko);
    paul.send("Ha, I heard that!");
    ringo.send("Paul, what do you think?", paul);

}



////////////////////////////////////////////////////////////////////////////////////////
// MEDIATOR
////////////////////////////////////////////////////////////////////////////////////////

// interesting example but slightly confusing as it doesn't follow the canonical Mediator Pattern phylosophy

var mediator = (function(){

    // add a call back function to a specific channel
    var subscribe = function(channel, fn){

        // create channel
        if(!mediator.channels[channel])
          mediator.channels[channel] = [];

        /*
          add context and callback function to channel
          mediator is acting as a central repository for methods on all objects
        */

        mediator.channels[channel].push({

          // at this point 'this' is bound to mediator but when using 'installTo' it bomes bound to the object

          context : this,
          callback : fn
        });

        return this;

     };

     var publish = function(channel){

        // if channel doesn't exist abort
        if(!mediator.channels[channel]) return false;

        // collect function params excelt first param ( channel )
        var args = Array.prototype.slice.call(arguments, 1);

        // will triger all callbacks published to this channel
        for(var i = 0, l = mediator.channels[channel].length; i < l; i++){

             // pushed object to subscribe function
             var subscription = mediator.channels[channel][i];
             subscription.callback.apply(subscription.context, args);
        };

        return this;
     };

     return {

        channels : {},
        publish : publish,
        subscribe : subscribe,

        /*

          this is the step that couples a 'Participant' to a Mediator
          -- by giving a specific object access to the mediator methods
          ** IMPORTANT **
            when passing 'subscribe' method, the 'this' var changes context to the particular object

        */

        installTo : function(obj){
             obj.subscribe = subscribe;
             obj.publish = publish;
        }
     };

}());

//////////////
// Example 1
//////////////

// in this example mediator is also being used as a generic object

mediator.name = 'Doug';
mediator.subscribe('nameChange', function(arg){
     console.log(this.name);
     this.name = arg;
     console.log(this.name);
});

mediator.publish('nameChange', 'Jorn');

//////////////
// Example 2
//////////////

var obj = { name : 'John' };

//object has no
mediator.installTo(obj);


obj.subscribe('nameChange', function(arg){
     console.log(this.name);
     this.name = arg;
     console.log(this.name);
     console.log(this.name);
});

obj.publish('nameChange', 'Sam');



