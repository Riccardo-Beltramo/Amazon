import React, { Component } from 'react';
import { Link, NavLink } from "react-router-dom";
import {ROUTES, USER_TYPE} from "./Constants";

class Navbar extends Component {
    state = { }

    render() { 
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {localStorage.getItem("TOKEN") !== null && (
                            <React.Fragment>
                                <NavLink className="nav-link" aria-current="page" to={"/" + ROUTES.ARTICOLI}>Articoli</NavLink>
                                <NavLink className="nav-link" aria-current="page" to={`/orders/${localStorage.getItem("USERNAME")}`}>Ordini</NavLink>
                                <NavLink className="nav-link" aria-current="page" to={"/" + ROUTES.CART}>Carrello</NavLink>
                            </React.Fragment>
                        )}
                        {/* {localStorage.getItem("ROLE") === USER_TYPE.ADMINISTRATOR && (
                            <NavLink className="nav-link" aria-current="page" to={"/" + ROUTES.SEARCH_CUSTOMER}>Search Customer</NavLink>
                        )} */}
                        
                    </div>
                </div>
                <span className="navbar-text">
                    {localStorage.getItem("USERNAME")}
                </span>
                <span className="navbar-text">
                    {localStorage.getItem("TOKEN") !== null && (
                        <NavLink className="nav-link" aria-current="page" to={"/" + ROUTES.LOGOUT}>Logout</NavLink>
                    )}
                    {localStorage.getItem("TOKEN") === null && <NavLink className="nav-link" to={"/" + ROUTES.LOGIN}>Login</NavLink>}
                </span>
            </nav> 
        );
    }
}
 
export default Navbar;