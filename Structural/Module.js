//http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
// lookinto section Cloning and Inheritance in article

//////////////////////////////////////////////////////////////////
// Basis of Module Pattern
//////////////////////////////////////////////////////////////////


'use strict';

// create an anonymous function, and execute it immediately.
var GLOBAL = (function(library) {

    // All of the code that runs inside the function lives in a closure, which provides PRIVACY and STATE
    var privateState = 'happy' ;
    var privateMethod = function(){}

    // STATE can be altered externally by exposing methods defined internally

    // option 1: pattern to extend/augment a module
    // subModule does not exist define it and store in local var
    var module = library.module = library.module || {} ;
    module.changeState = function() {
        privateState = 'sad'
    } ;
        // LOOSE AUGMENTATION vs TIGHT AUGMENTATION
        // loose: you cannot use module properties from other files/modules during initialization (but you can at RUN-TIME after INITIALIZATION)

        // tight: implies a loading order and utilises OVERRIDES
            if(module.method) {
                // can be used interanlly
                var cache = module.method;
                module.method = function(){
                    // DECORATOR PATTERN
                    cache()
                };
            }
        // end tight

    function variableSetup(){} // organisational convention
    function addListeners(){} // organisational convention

    // during RUN-TIME ; after INITIALIZATION (loading js);  I define this as RUN-TIME INITIALIZATION
    module.runtimeInit = function(){
        // access to all module properties
        this.otherModule.func();
        // access to dom (after window.onload)
        variableSetup() // if utilses dom
        addListeners() // if utilses dom
    }

    // option 2: alternatively it can be exported via return
    // in ths usage you need the GLOBAL variable and you pass into other modules
    return {
        changeState:function(){
             privateState = 'sad'
        }
    } ;

    // MODULE ASYNCHRONOUS augmentation (note: the resemblance to decorator pattern)
    // asynchronicity is achieved by defining MODULE is non existent
})(window.NAMESPACE || (window.NAMESPACE = {}) /* GLOBAL if using return */);


//////////////////////////////
// sharing a PRIVATE STATE across modules ( useful when splitting module across files) loose augmentation
//////////////////////////////


var MODULE = (function (module) {

    // if sharedPrivate does not exist define it and store in local var
    var _private = module.sharedPrivate = module.sharedPrivate || {},

        // if _seal function does not exist define it and store in local var
        _seal = module._seal = module._seal || function () {
            delete module.sharedPrivate;
            delete module._seal;
            delete module._unseal;
        },

        // if _unseal function does not exist define it and store in local var
        _unseal = module._unseal = module._unseal || function () {
            module.sharedPrivate = sharedPrivate;
            module._seal = _seal;
            module._unseal = _unseal;
        };

        module.protect = function(){
            // makes sharedPrivate unavailable by deleating
            _seal();
        }

        module.unprotect = function(){
            // makes sharedPrivate available again by retrieving from local vars
            _unseal();
        }
        // ex. after all modules are loaded
        // run protect() to create encapsulation

    return module;
}(MODULE || {})) ;



/*
    module.exports = function(){
    }

    var file = require('./filepath')
    var file = require('node_modules') // no ./  looks in global and node_modules
*/

/*
    //ES6 native require syster

    import smth
    exort smth

*/

/*
    //browserify dictionary lookup of node require system is an es5 browser implimentation of a module system
*/




