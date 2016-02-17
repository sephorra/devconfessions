
/*
	StorePicker
	This will let us make <StorePicker/>
*/

import React from 'react';
import { History } from 'react-router';
import h from '../helpers';
import reactMixin from 'react-mixin';
import autoBind from 'autobind-decorator';

class StorePicker extends React.Component {
	@autoBind
	goToStore(event) {
		event.preventDefault();
		// get the data from the input

		var storeId = this.refs.storeId.value;
		// transition from <StorePicker/> to <App/>
		this.history.pushState(null, '/store/' + storeId);
	}

	render() {

		return (
			<form className="store-selector" onSubmit={this.goToStore}>
				<h2>Please enter a store</h2>
				<input type="text" ref="storeId" defaultValue={h.getFunName()} required />
				<input type="Submit" />
			</form>
		)
	}
}

reactMixin.onClass(StorePicker, History);

/*
var StorePicker = React.createClass({
	mixins : [History],
	goToStore : function(event) {
		event.preventDefault();
		// get the data from the input
		var storeId = this.refs.storeId.value;
		// transition from <StorePicker/> to <App/>
		this.history.pushState(null, '/store/' + storeId);
	},

	render : function() {

		return (
			<form className="store-selector" onSubmit={this.goToStore}>
				<h2>Please enter a store</h2>
				<input type="text" ref="storeId" defaultValue={h.getFunName()} required />
				<input type="Submit" />
			</form>
		)
	}
});*/

export default StorePicker;