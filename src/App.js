import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import {Login} from "./anagrafica_components/Login";
import {USER_TYPE, ROUTES} from "./anagrafica_components/common/Constants";
import { toast } from 'react-toastify';
import axios from "axios";
import config from "./config.json";
import dotenv from "dotenv";
import Navbar from './anagrafica_components/common/Navbar';
import Articoli from './anagrafica_components/Articoli';
import Logout from './anagrafica_components/Logout';
import NotFound from './anagrafica_components/NotFound';
import { replace } from 'lodash';
import ArticoloForm from './anagrafica_components/ArticoloForm';
import ArticoloNew from './anagrafica_components/ArticoloNew';
import Order from './anagrafica_components/Order';
import OrderForm from './anagrafica_components/OrderForm';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import SearchCustomer from './anagrafica_components/SearchCustomer';
import Cart from './anagrafica_components/Cart';




dotenv.config();

class App extends Component {
  state = { 
    userType: null,
    username: ""
   }

   UNSAFE_componentWillMount() {
    //this if handle an eventual modification of URL from the user and redirect it to the login
    if(this.props.location.pathname === "/" || this.props.location.pathname === "" || this.props.location.pathname === "/"){
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("USERNAME");
      localStorage.removeItem("ROLE");
      localStorage.removeItem("CART");
      this.props.history.replace("/" + ROUTES.LOGIN);
    }
    
    for (let api in config) {
      config[api] = config[api].replace(
        "[REACT_APP_URL_JAVA]",
        "http://localhost:8090"
      );
    }
    
   }

  handleLogin = (loginRequest) => {
    const headers = { "Content-Type": "application/json"};
    const conf = { headers: { ...headers } };

    let roles = [];
   
    try{
      axios.post(config.apiLoginEndpoint, loginRequest, conf)
      .then(response => {
          roles = [...response.data.roles];
          const cart = [];
      
          //saving token and username in local storage to persist data for the session
          localStorage.setItem("TOKEN", response.data.accessToken);
          localStorage.setItem("USERNAME", response.data.username);
      
          this.setState({roles: roles, username: response.data.username,
            userType: roles.length === 1 && roles[0] === USER_TYPE.USER ? USER_TYPE.USER : USER_TYPE.ADMINISTRATOR})

          localStorage.setItem("ROLE", this.state.userType);
          localStorage.setItem("CART", JSON.stringify(cart));
      
          this.props.history.replace("/" + ROUTES.ARTICOLI);
      })
    } catch ( ex ) {

      if(ex.response && ex.response.status === 404){
        toast.error(" Nessun utente trovato con utente = " + loginRequest.username);
      }else if(ex.response && ex.response.status === 401){
        toast.error(" Password errata ");
      }
    }
    
  }

  checkLogin = () => {
    if(!localStorage.getItem("TOKEN")){
      localStorage.removeItem("USERNAME")
      localStorage.removeItem("ROLE")
      localStorage.removeItem("CART");
    }
  }

  render() { 
    const {userType} = this.state;
    this.checkLogin();

    return (
      <React.Fragment>
        <ToastContainer />
        <Navbar />
        
        {/* <div id= "main" className="container"> */}
          <Switch>
            
                <Route
                  exact path={"/" + ROUTES.LOGIN}
                  render={(props) => <Login {...props} handleLogin={this.handleLogin}/>}
                />  
                <Route exact path={"/" + ROUTES.ARTICOLI} component={Articoli}/>
                <Route exact path={"/" + ROUTES.ARTICOLO_FORM} component={ArticoloForm}/>
                <Route exact path={"/" + ROUTES.ARTICOLO_NEW} component={ArticoloNew}/>
                <Route exact path={"/" + ROUTES.LOGOUT} component={Logout}/>
                <Route exact path={"/" + ROUTES.ORDERS} component={Order}/>
                <Route exact path={"/" + ROUTES.ORDER} component={OrderForm}/>
                <Route exact path={"/" + ROUTES.CART} component={Cart}/>
                <Route exact path={"/" + ROUTES.SEARCH_CUSTOMER} component={SearchCustomer}/>
                <Route exact path={"/" + ROUTES.NOTFOUND} component={NotFound}/>  
                <Redirect from="/" exact to={"/" + ROUTES.LOGIN} />
                <Redirect to="/not-found"/>
            </Switch>
      </React.Fragment>
    );
  }
}
 
export default withRouter(App);
