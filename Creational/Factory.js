
////////////////////////////////////////////////////////////////////////////////////////
// FACTORY BASIC
////////////////////////////////////////////////////////////////////////////////////////

function A(){}

function B(){}

function C(){}

function Factory( option ) {

    var output;

	switch (option){
		case 1 :
			output = new A
		break ;
		case 2 :
			output = new B
		break;
		case 3:
			output = new C
		break;
		default:
		break;
	}

    /*
		note:
        This Factory function constructor has an Object return value
        which means 'new Factory' doesn't return Factory object
        it returns either A B or C
    */

    return output ;

}

console.log(new Factory(1))
console.log(new Factory(2))
console.log(new Factory(3))

// this will also work like this

console.log(Factory(1))
console.log(Factory(2))
console.log(Factory(3))