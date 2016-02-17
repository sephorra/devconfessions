/*
	App
*/
import React from 'react';
import Header from './Header';
import Fish from './Fish';
import Order from './Order';
import Inventory from './Inventory';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import Catalyst from 'react-catalyst';

// Firebase
import Rebase from 're-base';
var base = Rebase.createClass('https://mm-react-test.firebaseio.com/');

@autobind
class App extends React.Component {

	constructor() {
		super();

		this.state = {
			fishes : {},
			order : {}
		}
	}

	componentDidMount() {
		base.syncState(this.props.params.storeId + '/fishes', {
			context : this,
			state : 'fishes'
		});

		// Wait until fish is loaded into state
		var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

		if (localStorageRef) {
			// update our component state to reflect what is in localStorage
			this.setState({
				order : JSON.parse(localStorageRef)
			});
		}

	}

	componentWillUpdate(nextProps, nextState) {
		// Set local storage
		localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
	}

	addToOrder(key) {
		// sets it to itself plus an additional if it exists, otherwise just 1
		this.state.order[key] = this.state.order[key] + 1 || 1;
		this.setState({order : this.state.order });
	}

	removeFromOrder(key) {
		delete this.state.order[key];
		this.setState({
			order : this.state.order
		});
	}

	addFish(fish) {
		var timestamp = (new Date()).getTime();
		// update the state object
		this.state.fishes['fish-' + timestamp] = fish;
		// set the state
		this.setState({ fishes : this.state.fishes });
	}

	removeFish(key) {
		if(confirm("Are you sure you want to remove the fish")) {
			// update state
			this.state.fishes[key] = null;

			// rerender
			this.setState({
				fishes : this.state.fishes
			});
		}
	}

	loadSamples() {
		this.setState({
			fishes : require('../sample-fishes')
		});
	}

	renderFish(key) {
		return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
	}

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="list-of-fishes">
						{Object.keys(this.state.fishes).map(this.renderFish)}
					</ul>
				</div>
				<Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState.bind(this)} removeFish={this.removeFish} {...this.props} />
			</div>
		)
	}
}



reactMixin.onClass(App, Catalyst.LinkedStateMixin);


/*
var App = React.createClass({
	mixins : [Catalyst.LinkedStateMixin],
	getInitialState : function() {
		return {
			fishes : {},
			order : {}
		}
	},
	componentDidMount : function() {
		base.syncState(this.props.params.storeId + '/fishes', {
			context : this,
			state : 'fishes'
		});

		// Wait until fish is loaded into state
		var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);

		if (localStorageRef) {
			// update our component state to reflect what is in localStorage
			this.setState({
				order : JSON.parse(localStorageRef)
			});
		}

	},
	componentWillUpdate : function(nextProps, nextState) {
		// Set local storage
		localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
	},
	addToOrder : function(key) {
		// sets it to itself plus an additional if it exists, otherwise just 1
		this.state.order[key] = this.state.order[key] + 1 || 1;
		this.setState({order : this.state.order });
	},
	removeFromOrder : function(key) {
		delete this.state.order[key];
		this.setState({
			order : this.state.order
		});
	},
	addFish : function(fish) {
		var timestamp = (new Date()).getTime();
		// update the state object
		this.state.fishes['fish-' + timestamp] = fish;
		// set the state
		this.setState({ fishes : this.state.fishes });
	},
	removeFish : function(key) {
		if(confirm("Are you sure you want to remove the fish")) {
			// update state
			this.state.fishes[key] = null;

			// rerender
			this.setState({
				fishes : this.state.fishes
			});
		}

	},
	loadSamples : function() {
		this.setState({
			fishes : require('../sample-fishes')
		});
	},
	renderFish : function(key) {
		return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
	},
	render : function() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="list-of-fishes">
						{Object.keys(this.state.fishes).map(this.renderFish)}
					</ul>
				</div>
				<Order fishes={this.state.fishes} order={this.state.order} removeFromOrder={this.removeFromOrder} />
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples} fishes={this.state.fishes} linkState={this.linkState} removeFish={this.removeFish} />
			</div>
		)
	}
});*/

export default App;