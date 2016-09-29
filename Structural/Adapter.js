/*

    **** ADAPTER ****

    Convert the Interface of a class into another Interface Clients expect.

    * Interface refers to the class API
    * Client refers to an executing code module

    Adapater lets classes work together that couldn't otherwise because of incompatible interfaces.

*/

/* drunk philosophy */

function output(){
    this.do = function(){
        return //good
    }
}

function selfish(){
    var collect;
    this.take = function(){
        collect = //good
        return //nothing
    }
}

function adapter(){
    var hold = new selfish;
    this.do = function(){
       return hold.take();
    }
}


////////////////////////////////////////////////////////////////////////////////////////
// ADAPTER BASIC
////////////////////////////////////////////////////////////////////////////////////////

// *** OLD INTERFACE ***

 // Class Constructor function
function Shipping() {

    // Class API defined in constructor function
    this.request = function(zipStart, zipEnd, weight) {
        // ...
        return "$49.75";
    }
}

// *** NEW INTERFACE ***

 // Class Constructor function
function AdvancedShipping() {
}

// Class API defined in prototype (similar but subtly different to defining in constructor)
AdvancedShipping.prototype.login = function(credentials) { /* ... */ };
AdvancedShipping.prototype.setStart = function(zipStart) { /* ... */ };
AdvancedShipping.prototype.setDestination = function(zipEnd) { /* ... */ };
AdvancedShipping.prototype.calculate = function(weight) { /* ... */ };

// *** NEW INTERFACE ***

function ShippingAdapter(credentials) {

    // instantiate new interface
    var shipping = new AdvancedShipping();

    // provide credentials seperately (as not part of old interface)
    shipping.login(credentials);

    /*

        ADAPT to old interface

        side note: in this example the Interface (API) is defined in the constructor
        (instead of on prototype) so that it can have access to the private var shipping

    */

    this.request = function(zipStart, zipEnd, weight) {
        shipping.setStart(zipStart);
        shipping.setDestination(zipEnd);
        return shipping.calculate(weight);
    }
}

 // *** CLIENT CODE ***

// Shipping Station expects the old interface to work

function ShippingStation(_shipping){

    var shipping = _shipping;

    this.getCost = function(zipStart, zipEnd, weigh){
         return shipping.request(zipStart, zipEnd, weigh);
    }
}

function run() {

    // original shipping object and interface
    var shippingStationOld = new ShippingStation(new Shipping)
    var costold = shippingStationOld.getCost("78701", "10010", "2 lbs");

    // new shipping object with adapted interface

    // Shipping Station continues to work
    var credentials = {token: "30a8-6ee1"};
    var adapter = new ShippingAdapter(credentials);
    var shippingStationOld = new ShippingStation(adapter)
    var costnew = shippingStationOld.getCost("78701", "10010", "2 lbs");

}


/* NEXT LOOK AT Decorator.js -- it seems similar but has a different usage