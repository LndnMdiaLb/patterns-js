//////////////////////////////
// Nano Decorator
//////////////////////////////

function decorate(func, newfunc){
  var original = func;
  return function() {
    // if newfunc returns false -- do last function
    return newfunc.apply(this, arguments) || original.apply(this, arguments) ;
  }
}

Function.prototype.decorate = function(newfunc){
  var original = this;
  return function() {
    // if newfunc returns false -- do last function
    return newfunc.apply(this, arguments) || original.apply(this, arguments) ;
  }
}


/*

e = decorate(c,d)  // e maintains a reference to decorate func call's closure; this creates a virtual link
                v in closure
    | --------- |
    d()         c = decorate(a,b)
                                v in closure
                    | --------- |
                    b()         a()

e() == d() || c() || b() || a()


In this usage the decorate function is 'chaining' functions based on a simple boolean || boolean condition
the CONDITION that chooses which function to execute is the important characteristic.  This could be based on
function return value or something different.  See next example

*/

//////////////////////////////
// OVERLOADING
//////////////////////////////

//////////////////////////////
// CURRYING
//////////////////////////////


//////////////////////////////
// OOP DECORATOR
//////////////////////////////

/*

    Attach additional responsibilities to an object dynamically.
    Decorators provide a flexible alternative to subclassing for extending funtionality.

    difference between Decorator and Proxy:
    https://powerdream5.wordpress.com/2007/11/17/the-differences-between-decorator-pattern-and-proxy-pattern/

*/

// Class
var GameCharacter = function(name) {

    this.name = name;

    this.attack=function(){
        console.log('attack action')
    }

    this.ammo = function() {
        console.log('10 bullets');
    };

    this.downgrade = function(){
        return this;
    }
}

// Class Decorator - the interface is identical so they are interchangeable
// The decorator expects the class to be decorated to be passed into it at instantiation

var GameCharacterUpgrade = function(character, upgrade) {

    this.name = character.name;  // ensures interface stays the same

    // Decorator calls the decorated class method
    this.attack=function(){
        character.attack()
    }

    // Decorator augments the functionality of the .ammo() method and also calls the decorated class method
    this.ammo = function() {
        character.ammo();
        // Decorator augments the functionality
        console.log('+'+upgrade);
    };

    this.downgrade = function(){
        return character;
    }
}

// CLIENT

function run() {

    var player = new GameCharacter("usr");

    console.log(player.name);
    player.attack();
    player.ammo();

    // GameCharacterUpgrade is passed player and resaved to variable
    // player is now decorated
    player = new GameCharacterUpgrade(player, '10 Grenades')

    // the interface still works
    console.log(player.name);
    player.attack();
    player.ammo();

    player = new GameCharacterUpgrade(player, '20 bullets')

    console.log(player.name);
    player.attack();
    player.ammo();

    // accessing the original character
    player = player.downgrade().downgrade();

    console.log(player.name);
    player.attack();
    player.ammo();

}

/*
PROXY
*/