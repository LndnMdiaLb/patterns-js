
///////////////
// Singleton defined as private state of immediately executed function
///////////////

var Singleton = (function(){

  var SINGLETON;

  function Singleton(param){
    this.param = param

    // by setting the return value of the function instantiation via new or () returns private var
    // **HOWEVER** only works if function is first called via new
    return SINGLETON || (SINGLETON = this)
  };

  Singleton.prototype.meth= function(){
    console.log(this.param);
    console.log (SINGLETON)
  };

  return Singleton;

})();

/*
var single = new Singleton(2)
var sameSingle = Singleton(1) // still initial instance (param = 2)
var sameSingle2 = new Singleton(5) // still initial instance (param = 2)
*/




///////////////
// Singleton defined as an immutable property
///////////////

var SingletonClass = function(a) {

  var Singleton = SingletonClass.prototype._singletonInstance;
	if(Singleton) return Singleton ;

  // **HOWEVER** only works if function is first called via new
  Object.defineProperty( SingletonClass.prototype, '_singletonInstance', {
    value:this
  }) ;

  var a = a;

	this.method = function() {
    console.log(a)
	};
};


/*
var single = new SingletonClass(2)
var sameSingle = SingletonClass(1) // still initial instance (method() = 2)
var sameSingle2 = new SingletonClass(5) // still initial instance (pmethod() = 2)
*/

