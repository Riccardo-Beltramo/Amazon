import React, { Component } from 'react';
import axios from 'axios';
import config from "../config.json";
import { toast } from 'react-toastify';
import { IconContext } from "react-icons";
import { FcPlus } from "react-icons/fc";
import { FaMinusCircle }  from "react-icons/fa";
import { lowerFirst } from 'lodash';

class Cart extends Component {
    state = {
        cart: []
    }

    async componentDidMount() {
        const cartLocalStorage = JSON.parse(localStorage.getItem("CART"));   
        const cart = [];
        for(let i = 0; i < cartLocalStorage.length; i++){
            
            try{
                await axios.get(config.apiArticoloEndpoint, {params:{item_name: cartLocalStorage[i].itemName}})
                .then(response => {
                    if((cartLocalStorage[i].price/cartLocalStorage[i].quantity) != response.data.price){
                        toast.info("The price of "+ cartLocalStorage[i].itemName +" changes");
                    }
                    cart.push({itemName: response.data.itemName, quantity: cartLocalStorage[i].quantity, price: response.data.price*cartLocalStorage[i].quantity});
                })
            } catch (ex){
                if(ex.response && ex.response.status === 404)
                toast.info("Articolo "+ cartLocalStorage[i].itemName +" no longer available")
            }
            
        }
        localStorage.setItem("CART", JSON.stringify(cart));
        this.setState({ cart });
    }

    handleMinus = (itemName, price) => {
        const cart = JSON.parse(localStorage.getItem("CART"));
        const itemIndex = cart.findIndex((obj => obj.itemName === itemName));
        cart[itemIndex].quantity = cart[itemIndex].quantity - 1;
        
        if(cart[itemIndex].quantity < 1){
            const cartMinus = cart.filter(c => c.itemName !== itemName);
            localStorage.setItem("CART", JSON.stringify(cartMinus));
            this.setState({ cart : cartMinus });
        }else{
            const itemQuantity = cart[itemIndex].quantity;
            cart[itemIndex].price = price * itemQuantity;
            localStorage.setItem("CART", JSON.stringify(cart));
            this.setState({ cart });
        } 

    }

    handlePlus = (itemName, price) => {
        const cart = JSON.parse(localStorage.getItem("CART"));
        const itemIndex = cart.findIndex((obj => obj.itemName === itemName));
        cart[itemIndex].quantity = cart[itemIndex].quantity + 1;
        const itemQuantity = cart[itemIndex].quantity;
        cart[itemIndex].price = price * itemQuantity;
        localStorage.setItem("CART", JSON.stringify(cart));
        this.setState({ cart });
    }

    handleEmptyCart = () => {
        const cart = [];
        localStorage.setItem("CART",JSON.stringify(cart));
        this.setState({ cart });
    }

    handleConfirmOrder = async () => {
        
         const headers = { 
             'Authorization': localStorage.getItem("TOKEN"),
             'Content-Type': 'application/json',
             'Access-Control-Allow-Origin': '*',
             'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
             'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'   
         };

         const conf = { headers: { ...headers } };

         const cod = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10).toUpperCase();
         
         const postRequest = {
             codice: cod,
             aticoloList: this.mapArticoloList()
         };
        
         try{
            await axios.post(config.apiInsertOrdineEndpoint, postRequest, conf);
            toast.success("Order was successful");
            const cart = [];
            localStorage.setItem("CART",JSON.stringify(cart));
            this.setState({ cart });
            this.props.history.push(`/order/${cod}`);
         } catch( ex ){
            if(ex.response && ex.response.status === 409)
                 toast.error("Error: Exists already an Order with cod = " + cod);
            else
                toast.error("Error");
         }
    }


    mapArticoloList(){  
        const { cart } = this.state;
        let aticoloList = [];
     
        for(let i = 0; i < cart.length; i++){
            aticoloList.push({item_name: cart[i].itemName, qnt:cart[i].quantity});
        }
        return aticoloList;
    }

    getTotal(){
        const { cart } = this.state;
        let total = 0;
        for(let i = 0; i < cart.length; i++){
            total = total + cart[i].price;
        }
        return total;
    }
    

    render() {
        const { cart } = this.state;
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("TOKEN");
       
        return (
            <div className="cartBox">
                <h1>My Cart</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map(row => (
                            <tr key={row.itemName}>
                                <td>{row.itemName}</td>
                                <td>{row.price}</td>
                                <td>
                                    <IconContext.Provider value={{color: "red", size: "26px"}}>
                                        <button 
                                            className="buttonPlus"
                                            onClick={() => this.handleMinus(row.itemName, row.price/row.quantity)}
                                            >
                                            <FaMinusCircle />
                                        </button>
                                    </IconContext.Provider>
                                    {row.quantity}
                                    <IconContext.Provider value={{size: "30px"}}>
                                        <button 
                                            className="buttonPlus"
                                            onClick={() => this.handlePlus(row.itemName, row.price/row.quantity)}
                                            >
                                            <FcPlus />
                                        </button>
                                    </IconContext.Provider>
                                </td>
                            </tr>
                        ))}
                        {cart.length > 0 && (<tr>Total : {this.getTotal()} EUR</tr>)}
                    </tbody>
                    
                </table>
                
                {cart.length > 0 && (
                <React.Fragment>
                    <IconContext.Provider>
                        <button 
                            className="btn btn-success"
                            onClick={() => this.handleConfirmOrder()}
                            >
                            Confirm
                        </button>
                    </IconContext.Provider>
                    <div className="buttonEmptyCart">
                        <IconContext.Provider>
                            <button 
                                className="btn btn-danger"
                                onClick={this.handleEmptyCart}
                                >
                                Empty Cart
                            </button>
                        </IconContext.Provider>
                    </div>
                </React.Fragment>
                )}
            </div>
        );
    }
}

export default Cart;