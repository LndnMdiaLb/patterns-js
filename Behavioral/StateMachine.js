
/*
	http://www.ibm.com/developerworks/library/wa-finitemach1/


	Finite state machines (or State Pattern) model behavior where
	*	responses to future events depend upon previous events. *

	Finite state machines are computer programs that consist of:
	    * Events -that the program responds to
	    * States -where the program waits between events (way to remember prev. ev.)
	    * Transitions -between states in response to events
	    * Actions -taken during transitions
	    * Variables -that hold values needed by actions between events

*/



////////////////////////////////////////////////////////////////////
// nano StateMachine
////////////////////////////////////////////////////////////////////

/*
	statemachine as function and switch statement
	useful for small isolated cases --low complexity
	States are 'coupled'  -- best for 'sequential situations?'
*/

function changeState(state){
	if (state) changeState.is = state ;
	switch (changeState.is){
		case 'A' :
		//
			console.log('A') ;
			changeState.is = 'C' ;
		break ;
		case 'B' :
		//
			console.log('B') ;
			changeState.is = 'A' ;
		break ;
		case 'C' :
		//
			console.log('C') ;
			changeState.is = 'B' ;
		break ;
		default :
			changeState('A') ;
		break;
	}
}



////////////////////////////////////////////////////////////////////
// Statemachine as Class
////////////////////////////////////////////////////////////////////

/*
	reusable and dynamic ex. instantiate a stateMachine define states and use
	States are 'coupled'  -- best for 'sequential situations?'
*/


    /////////////////
    //	STATEMACHINE
    /////////////////


	function State (){

		// ** State Manipulation Methods **

		// current State
		var activeState;

		// setting activeState State
		this.setState=function(state){
			var activeState = state;
		};

		// polymorphism API that uses state

		this.changeState=function(){

			// Each state has knowledge of the Context to access its ** State Manipulation Methods **
			var activeState.call(null, this)
		};

		this.goTo=function(state){
			this.setState(state);
			this.changeState();
		}

	} ;

    /////////////////
    // VIDEO STATES
    /////////////////

	function Play(context){

		// use ** State Manipulation Methods ** State Flow is set
		context.setState(Pause);
	}

	function Pause(context){

		// use ** State Manipulation Methods ** State Flow is set
		context.setState(Play);
	}

	function Replay(context){

		// use ** State Manipulation Methods ** State Flow is set
		context.setState(Pause);
	}

	//  video implementation


	var player = new State ;
	player.setState(Pause) ;

    /////////////////
    // VIDEO STATES
    /////////////////

	//  audio implementation

	function Mute(context){

		// use ** State Manipulation Methods ** State Flow is set
		context.setState(UnMute);
	}

	function UnMute (context){

		// use ** State Manipulation Methods ** State Flow is set
		context.setState(Mute);
	}

	//  audio implementation

    var audio = new State ;
	audio.setState(UnMute);


/*
	reusable and dynamic ex. instantiate a stateMachine define states and use
	States are 'coupled'  -- best for 'sequential situations?'

	states can be defined more flexibly ?
*/

function StateMachine(){

	var activeState;

	this.setState = function (state){
		activeState = state ;
	};

	this.changeState = function (){

		stateGraph[activeState]() ;
		// vs function call
		//this.activeState.call(this, args)

	};

	this.goTo=function(state){
		this.setState(state);
		this.changeState();
	}

	// 'state graph?'

	var stateGraph={
	/* // example
		'stateA':function(){},

		'stateB':function(){}
	*/
	};

	this.addState=function(state, func){
		stateGraph[state]=func ;
		return this;
	};

}

// implementation

var sm = new StateMachine ;

	sm.addState( 'StateA',
		function(){
			// Transitions from previous state
			// Actions in current State
			console.log('do A') ;

			// set next state to execute in stateGraph
			sm.setState('StateB') ;
		});


	sm.addState( 'StateB',
		function(){
			// Transitions from previous state
			// Actions in current State
			console.log('do A') ;

			// set next state to execute in stateGraph
			sm.setState('stateA') ;
		});


	sm.changeState() ;

	sm.goTo('XXXX')



function StateMachine(){

	var prevState,
		activeState,
		nextState,
		stateGraph={};	// 'state graph?'


	// last to execute - can be null if changeState hasn't been called
	this.prev = function(){ return prevState ; }

	this.state = function(){ return activeState ; }

	// next to execute - can be null if changeState hasn't been called
	this.next = function(){ return nextState ; }


	this.setNextState = function(state){
		nextState = state;
		return this;
	}

	this.changeState = function (args){

		// if a state has just executed store as previous
		if(activeState) prevState = activeState;
		// ready next state to be executed and store as active
		if(nextState) activeState = nextState;
		// empty next state
		nextState = null ;
		
		//////////////
		// EXECUTE
		//////////////
		if(!activeState) return 
		//stateGraph[activeState]()  // this == stateGraph
		stateGraph[activeState].apply(this, args?args:[]) ; // this == StateMachine 
		
		return this;
	}

	this.goTo=function(state){
		return this.setNextState(state).changeState() ;
	}

	this.addState=function(state, func){
		stateGraph[state]=func ;
		return this ;
	}

}






// sequence uses dispatcher and statemaching via composition

function Sequence(){

    /////////////	
	var ed = new CREATVE.utils.EventDispatcher;
    /////////////	

    this.register = function(ev, callback) {
        ed.register(ev, callback);
    };

    this.unregister= function(ev, callback) {
        ed.unregister(ev, callback);
    };

    this.emit= function(ev, params) {
        ed.emit(ev, params);
    };

    /////////////
	var sm = new StateMachine ;	    
    /////////////	

	this.frame = function(state, func){
		sm.addState(state, func) ;
		this.emit('add-frame', state) ;
		return this ;
	}

	this.setState = function(state){
		sm.setState(state) ;
		return this ; 
	}

	this.changeState = function(args){
		sm.changeState(args) ;
		this.emit('state-change', this.state()) ;
		return this ;
	}

	this.goTo = function(state){
		sm.goTo(state) ;
		this.emit('state-change', this.state()) ;
		return this ;
	}

	/////////////
	
	// last to execute
	this.prev = function(){
		return sm.prev();
	}

	this.state = function(){
		return sm.state();
	}

	this.next = function(){
		return sm.next();
	}

	//////


}





////////////////////////////////////////////////////////////////////
// Queued State Machine
////////////////////////////////////////////////////////////////////

/*
	method for implementing a state queue
*/


function QueuedStateMachine(){

	// current State * Variables
	this.stateQueue=[];

	//  | | | | | << |
	this.queueState = function (state){
		if (this.currentState() == state) return ;
		this.stateQueue.push(state) ;
	}

	//  | | | | | >> |
	this.popState = function (){
		return this.stateQueue.pop();
	}

	//  | | | | | >|<
	this.currentState = function (){
		var queue = this.stateQueue ;
		 return queue.length > 0 ?
		 	queue[ queue.length - 1 ] : null ;
	}

	//////

	this.changeState = function (){
        var stateFunc = this.popState() ;
        if (stateFunc != null) stateFunc() ;
	}

	this.callStateMethod = function (func){
        func.call(this);
	}

}



function Implementation(){

	var stateMachine = new QueuedStateMachine;
	stateMachine.queueState(stateA);


	function stateA() {

		console.log('do A');
		console.log( stateMachine.stateQueue );

		stateMachine.queueState(stateB) ;
		stateMachine.queueState(stateC) ;
	}

	function stateB() {

		console.log('do B');
		console.log(stateMachine.stateQueue);

		stateMachine.queueState(stateA) ;
	}

	function stateC() {

		console.log('do C');
		console.log(stateMachine.stateQueue);
		stateMachine.callStateMethod(stateD);
	}

	function stateD() {

		console.log('do D');
	}



	this.changeState=function(){
		stateMachine.changeState()
	}

	this.init=function(){
		stateMachine.queueState(stateA);
		this.changeState();
	}
}


var imp = new Implementation ;


////////////////////////////////////////////////////////////////////
//  OOP Example in which State Flow is set in State Classes
////////////////////////////////////////////////////////////////////

/*
	States are DeCoupled - no knowledge of Context Class
	This is best suited as an interface pattern rather than 'sequncer pattern'
*/

function Cursor (){

	var current_tool = new PenTool;

	/////////////

	this.moveTo = function (point){
		// input:  the location point the mouse moved to
		current_tool.moveTo(point)
	}

	this.mouseDown = function (point){
		//input:  the location point the mouse is at
		current_tool.mouseDown(point)
	}

	this.mouseUp = function (point) {
		//input:  the location point the mouse is at
		 current_tool.mouseUp(point);
	}

	/////////////

    this.usePenTool = function () {
    	current_tool = new PenTool
    }

	this.useSelectionTool = function () {
		current_tool = new SelectionTool
	}
}


function PenTool (){

	var last_mouse_position = null;
	var mouse_button = 'up';

	/////////////

	this.moveTo = function (point){
		// input:  the location point the mouse moved to
		if (mouse_button == 'down'){
			//(draw a line from the last_mouse_position to point)
			last_mouse_position = point;
		}
	}

	this.mouseDown = function (point){
		//input:  the location point the mouse is at
		mouse_button = 'down';
		last_mouse_position = point;
	}

	this.mouseUp = function (point) {
		//input:  the location point the mouse is at
		mouse_button = 'up';
	}

}


function SelectionTool (){

	var selection_start = null;
	var mouse_button = 'up';

	/////////////

	this.moveTo = function (point){
		// input:  the location point the mouse moved to
		if (mouse_button == 'down'){
			// (select the rectangle between selection_start and point)
			last_mouse_position = point;
		}
	}

	this.mouseDown = function (point){
		//input:  the location point the mouse is at
		mouse_button = 'down';
		selection_start  = point;
	}

	this.mouseUp = function (point) {
		//input:  the location point the mouse is at
		mouse_button = 'up';
	}
}