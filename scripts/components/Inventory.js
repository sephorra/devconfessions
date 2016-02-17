
/*
 Inventory
 <Inventory/>
*/
import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';

const ref = new Firebase('https://mm-react-test.firebaseio.com/');


@autobind
class Inventory extends React.Component {

	constructor() {
		super(); {/*set state - inherit the parent */}

		this.state = {
			uid : ''
		}
	}

	authenticate(provider) {
		console.log("Trying to login with" + provider);
		ref.authWithOAuthPopup(provider, this.authHandler);
	}

	componentWillMount() {
		console.log("checking to see if we can log them in");
		var token = localStorage.getItem('token');
		if(token) {
			ref.authWithCustomToken(token, this.authHandler);
		}
	}

	logout() {
		ref.unauth();
		localStorage.removeItem('token');

		this.setState({
			uid : null
		});
	}

	authHandler(err, authData) {
		if(err) {
			console.err(err);
			return;
		}

		//save the ogin token in the browser
		localStorage.setItem('token',authData.token);

		console.log(this.props.params.storeId);

		const storeRef = ref.child(this.props.params.storeId);

		storeRef.on('value', (snapshot) => {
			var data = snapshot.val() || {};

			if(!data.owner) {
				// claim it as our own
				storeRef.set({
					owner : authData.uid
				});
			}

			//update our state to reflect the current store owner and user
			this.setState({
				uid : authData.uid,
				owner : data.owner || authData.uid
			})
		});
	}

	renderLogin() {
		return (
			<nav className="login">
				<h2>Inventory</h2>
				<p>Sign in to manage your store's inventory</p>
				<button className="github" onClick={this.authenticate.bind(this, 'github')}>Login with github</button>
			</nav>
		)
	}

	renderInventory(key) {
		var linkState = this.props.linkState

		return (
			<div className="fish-edit" key={key}>
				{/*link state method made available through mixin*/}
				<input type="text" valueLink={linkState('fishes.'+key+'.name')} />
				<input type="text" valueLink={linkState('fishes.'+key+'.price')} />
				<select valueLink={linkState('fishes.'+key+'.status')}>
					<option value="unavailable">Sold Out!</option>
					<option value="available">Fresh!</option>
				</select>
				<textarea valueLink={linkState('fishes.'+key+'.desc')}></textarea>
				<input type="text" valueLink={linkState('fishes.'+key+'.image')} />
				{/*bind runs the function in scope - supplys key to function*/}
				<button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
			</div>
		)
	}

	render() {

		let logoutButton = <button onClick={this.logout}>Log Out!</button>

		// first check if they aren't logged in
		if(!this.state.uid) {
			return (
				<div>{this.renderLogin()}</div>
			)
		}

		// heck if they arent the owner of the store
		if(this.state.uid !== this.state.owner) {
			return (
				<div>
					<p>Sorry you aren't the owner of the store</p>
					{logoutButton}
				</div>
			)
		}

		/* get the keys for our fish (fish1, fish2, fish3..)
			grab a list of keys and for each key run it against render Inventory*/
		return (
		 	<div>
				<h2>Inventory</h2>
				{logoutButton}
				{Object.keys(this.props.fishes).map(this.renderInventory)}

				<AddFishForm {...this.props} />
				<button onClick={this.props.loadSamples}>Load sample fishes</button>
		 	</div>
		)
	}


};

Inventory.propTypes = {
	addFish : React.PropTypes.func.isRequired,
	loadSamples : React.PropTypes.func.isRequired,
	fishes : React.PropTypes.object.isRequired,
	linkState : React.PropTypes.func.isRequired,
	removeFish : React.PropTypes.func.isRequired
}

export default Inventory;
/*var Inventory = React.createClass({
	renderInventory : function(key) {
		var linkState = this.props.linkState;
		return (
			<div className="fish-edit" key={key}>
				{/*link state method made available through mixin
				<input type="text" valueLink={linkState('fishes.'+key+'.name')} />
				<input type="text" valueLink={linkState('fishes.'+key+'.price')} />
				<select valueLink={linkState('fishes.'+key+'.status')}>
					<option value="unavailable">Sold Out!</option>
					<option value="available">Fresh!</option>
				</select>
				<textarea valueLink={linkState('fishes.'+key+'.desc')}></textarea>
				<input type="text" valueLink={linkState('fishes.'+key+'.image')} />
				/*bind runs the function in scope - supplys key to function
				<button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
			</div>
		)
	},
	render : function() {
		 return (
		 	<div>
			 	<h2>Inventory</h2>
			 	/* get the keys for our fish (fish1, fish2, fish3..)
			 	 grab a list of keys and for each key run it against render Inventory
			 	{Object.keys(this.props.fishes).map(this.renderInventory)}

			 	<AddFishForm {...this.props} />
			 	<button onClick={this.props.loadSamples}>Load sample fishes</button>
		 	</div>
		 )
	},
	propTypes : {
		addFish : React.PropTypes.func.isRequired,
		loadSamples : React.PropTypes.func.isRequired,
		fishes : React.PropTypes.object.isRequired,
		linkState : React.PropTypes.func.isRequired,
		removeFish : React.PropTypes.func.isRequired
	}
});*/

