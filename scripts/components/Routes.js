
/*
	Routes
*/
import React from 'react';
import { History } from 'react-router';

var routes = (
	<Router history={createBrowserHistory()}>
		<Route path="/" component={StorePicker}/>
		<Route path="/store/:storeId" component={App}/>
		<Route path="*" component={NotFound}/>
	</Router>
)

export default Routes;