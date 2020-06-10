import React, { Component } from 'react';
import {
  BrowserRouter as Router, Route, Switch, Redirect, HashRouter
} from 'react-router-dom';
import Loadable from 'react-loadable';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import './App.scss';
import fakeAuth from './api/fakeAuth'

const theme = createMuiTheme({
  typography: {
    fontFamily: "Nunito",
    fontSize:"16px"
  }
});

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout/index'),
  loading
});

const Login = Loadable({
  loader: () => import('./views/Pages/Login/Login'),
  loading
});
const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500/Page500'),
  loading
});
class App extends Component {
  render() {
    return (
      <div className="App">
      <MuiThemeProvider theme={theme}>
      <HashRouter>
          <div>
            <Switch>
            {/* <Route path="/top" component={Top}/> */}
            <Route exact path="/login" component={Login}/>
            <Route exact path="/page/500" component={Page500}/>
            <PrivateRoute path="/" component={DefaultLayout}/>
            </Switch> 
          </div>
        </HashRouter>
      </MuiThemeProvider>
      </div>
    );
  }
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        fakeAuth.getUsername() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default App;
