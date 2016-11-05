import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'

import { RootContainer, WrapStopwatchesApplication, Laps } from './components';

module.exports = (
    <Route path="/" component={RootContainer}>
        <IndexRedirect to="/stopwatches" />
        <Route path="/stopwatches(/:id)" component={WrapStopwatchesApplication} />
    </Route>
);
