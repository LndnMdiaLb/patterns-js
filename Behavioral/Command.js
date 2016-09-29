/*

    **** COMMAND ****

    The general idea behind the Command pattern is that
    it provides us a means to separate the responsibilities of issuing commands from anything executing commands,
    delegating this responsibility to different objects instead.

    Command decouples the object that invokes the operation (INVOKER) from the one that knows how to perform it (RECEIVER)

    // Command, Mediator, and Observer, address how you can decouple senders and receivers, but with different trade-offs.
*/

////////////////////////////////////////////////////////////////////////////////////////
// THE PHILOSOPHY
////////////////////////////////////////////////////////////////////////////////////////


function Processor(){
    /* some class that does processing */
}
Processor.prototype.filter=function(){
    /* processing method */
}

function Activity(){
    /* Some class that undertakes some activities */
    this.makeSquare=function(){
        /* activity */
    }
    this.makeCircle=function(){
         /* activity */
    }
}

/* Command Interface */

function Command(_object, method){
    this.run = function(params){
        return _object[method]();
        //method.apply(Activity, params);
    }
}

//// Client A
// * Client refers to an executing code module

// Constructs commands and has knowledge of Processor and Activity

var a = new Command( new Activity, 'makeSquare' ) ;
var b = new Command( new Activity, 'makeCircle' ) ;

//

var processor = new Processor ;
var c = new Command( processor, 'filter' ) ;

// Client A >> passes commands to ClientB


//// ClientB
// commands can be passed to ClientB - as long as ClientB knows how to handle command Interface ( .run() )
// this way Processor and Activity methods can be executed without ClientB having any knowledge or understanding of them

a.run();
b.run();
c.run();


////////////////////////////////////////////////////////////////////////////////////////
// COMMAND BASIC
////////////////////////////////////////////////////////////////////////////////////////



/*
    The Invoker function
*/


var Switch = function(){
    var _commands = [];
    this.storeAndExecute = function(command){
        _commands.push(command);
        command.execute();
    }
}

/*
    The Receiver function
*/

var Light = function(){
    this.turnOn = function(){ console.log ('turn on') };
    this.turnOff = function(){ console.log ('turn off') };
}

/*
    The Command for turning on the light - ConcreteCommand #1
*/

var FlipUpCommand = function(light){
    this.execute = function() { light.turnOn() };
}

/*
    The Command for turning off the light - ConcreteCommand #2
*/

var FlipDownCommand = function(light){
    this.execute = function() { light.turnOff() };
}

//*** Client A

var light = new Light();
var switchUp = new FlipUpCommand(light);
var switchDown = new FlipDownCommand(light);

//*** Client A >> passes 'switchUp', 'switchDown' Commands to Client B

//*** Client B Switch can control light methods without knowing Light

var lightSwitch = new Switch();
lightSwitch.storeAndExecute(switchUp);
lightSwitch.storeAndExecute(switchDown);




////////////////////////////////////////////////////////////////////////////////////////
// COMMAND BASIC
////////////////////////////////////////////////////////////////////////////////////////

// https://sourcemaking.com/design_patterns/command

/*
    The Invoker function
    invodes cooking action action without knowing how to actually perform it and billing without knowing cost of items
*/

var Waiter = function(){

    var _orders = [];

    this.takeOrder = function(command){
        /* orders saved for billing */
        _orders.push(command);
        _orders.execute();
    }

    this.giveOrder = function(){
        return _orders;
    }
}

var Cashier = function(orders){
    this.calculate = function(){
        var total=0;
        for (var x=0;x<x.length;x++){
            total+=orders[x].cost();
        }
        return total
    }
}

/*
    The Receiver function
*/

var Cook = function(){
    this.makeFood = function(){
        console.log ('makeFood')
    };
    this.makeDrink = function(){
        console.log ('makeDrink')
    };
};


var Kitchen = function(){

    var cook = new Cook();

    // menu Command Generator
    this.makeMenu = function(){
        return function(menuItem, price){
            this.execute = function(params) {
                cook[menuItem](params)
            };

            this.cost = function(params){
                return price;
            }
        }
    }

}


/*
    Client
*/

var todaysKitchen = new Kitchen();
var todaysFood = todaysKitchen.makeMenu('makeFood', 50)
var todaysDrink = todaysKitchen.makeMenu('makeDrink', 10)


var Customer = function(){
    var waiter = new Waiter();

    waiter.takeOrder(todaysFood);
    waiter.takeOrder(todaysDrink);
}
// CUSTOMER




////////////////////////////////////////////////////////////////////////////////////////
// COMMAND MORE COMPLEX
////////////////////////////////////////////////////////////////////////////////////////


// RECEIVERS
function add(x, y) { return x + y; }
function sub(x, y) { return x - y; }
function mul(x, y) { return x * y; }
function div(x, y) { return x / y; }


// COMMAND (interface)
var Command = function (execute, undo, value) {
    this.execute = execute;
    this.undo = undo;
    this.value = value;
}

var AddCommand = function (value) {
    return new Command(add, sub, value);
};

var SubCommand = function (value) {
    return new Command(sub, add, value);
};

var MulCommand = function (value) {
    return new Command(mul, div, value);
};

var DivCommand = function (value) {
    return new Command(div, mul, value);
};


// INVOKER
var Calculator = function () {

    var current = 0;
    var commands = [];

    function action(command) {
        var name = command.execute.toString().substr(9, 3);
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return {
        execute: function (command) {
            current = command.execute(current, command.value);
            commands.push(command);

            log.add(action(command) + ": " + command.value);
        },

        undo: function () {
            var command = commands.pop();
            current = command.undo(current, command.value);

            log.add("Undo " + action(command) + ": " + command.value);
        },

        getCurrentValue: function () {
            return current;
        }
    }
}


function run() {
    var calculator = new Calculator();

    // issue commands

    calculator.execute(new AddCommand(100));
    calculator.execute(new SubCommand(24));
    calculator.execute(new MulCommand(6));
    calculator.execute(new DivCommand(2));

    // reverse last two commands

    calculator.undo();
    calculator.undo();

}