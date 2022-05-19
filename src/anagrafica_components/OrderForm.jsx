import React, { Component } from 'react';
import axios from 'axios';
import config from "../config.json";
import { toast } from 'react-toastify';
import { IconContext } from "react-icons";
import { HiArrowCircleLeft } from "react-icons/hi";
import { FaPencilAlt, FaMinusCircle } from "react-icons/fa";
import { FcPlus } from "react-icons/fc";
import { USER_TYPE } from './common/Constants';

class OrderForm extends Component {

    state = {
        articoloList: [],
        totale: "",
        username:"",
        editOrder: "",
    }

    async populateOrder() {
        const conf = {
            headers: { 'Authorization': localStorage.getItem("TOKEN") },
            params: {
                codice: this.props.match.params.id
            }
        };

        try{
            await axios.get(config.apiOrdineEndpoint,conf)
            .then(response => {
                this.setState({ 
                    articoloList: response.data.aticoloList, 
                    totale: response.data.totale, 
                    username: response.data.username,
                    editOrder: false
                });
            })
        } catch (ex) {
            if(ex.response && ex.response.status === 404){
                toast.error("Order " + this.props.match.params.id +" not found" );
            }else if (ex.response && ex.response.status === 401){
                toast.error("Error : User have no permission to read orders from other users");
            }else{
                toast.error("Error");
            }
            this.props.history.push("/articoli");
        }
    }

    async componentDidMount() {
        await this.populateOrder();
    }

    handleGoBack = () => {
        this.props.history.push(`/orders/${this.state.username}`);
    }

    handleEditOrder = () => {
        let change = this.state.editOrder === false ? true : false;
        this.setState({ editOrder: change })
    }

    handleMinus = item_name => {
        const { articoloList } = this.state;
        const itemIndex = articoloList.findIndex((obj => obj.item_name === item_name));
        articoloList[itemIndex].qnt = articoloList[itemIndex].qnt - 1;
        
        if(articoloList[itemIndex].qnt < 0){
            articoloList[itemIndex].qnt = articoloList[itemIndex].qnt + 1;
            toast.error("Counter can not be negative");
            this.setState({ articoloList });
        }else{
            this.setState({ articoloList });
        } 
    }

    handlePlus = item_name => {
        const { articoloList } = this.state;
        const itemIndex = articoloList.findIndex((obj => obj.item_name === item_name));
        articoloList[itemIndex].qnt = articoloList[itemIndex].qnt + 1;
        this.setState({ articoloList });
    }

    handleSaveOrder = async () => {
        const articoloId = this.props.match.params.id;
        const { articoloList } = this.state;

        const headers = { 
            'Authorization': localStorage.getItem("TOKEN"),
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'   
        };

        const conf = { headers: { ...headers }, params: { codice: articoloId} };

        const putRequest = {
            listArticoliUpdate: articoloList
        }
        try{
            await axios.put(config.apiOrdineEndpoint, putRequest, conf);
        } catch (ex) {
            toast.error("Error");
        }
        
        if(this.calculateQnt() === true){
            toast.success("Order " + this.props.match.params.id + " edited successfully" );
            await this.populateOrder();
        }else{
            toast.success("Order " + this.props.match.params.id + " deleted");
            this.props.history.push(`/orders/${this.state.username}`);
        }
    }

    calculateQnt() {
        const { articoloList } = this.state;
        for(let i = 0; articoloList.length > i; i++ ){
            if(articoloList[i].qnt > 0 ){
                return true;
            }
        }
        return false;
    }
    

    render() {
        const { articoloList, totale, editOrder} = this.state;
        const user = localStorage.getItem("ROLE");

        return (
            <div className="orderBox">
                <div className="orderStatsBox">
                    <div className="orderPlaceBox">
                        <div className="orderPlaceBoxTitle">Order Placed on</div>
                        <div className="orderDataOrdineBox">{dataOrdine}</div>       
                    </div>
                    <div className="orderPriceBox">
                        <div className="orderPriceBoxTitle">Totale</div>
                        <div className="orderTotaleBox">EUR {totale}</div>
                    </div>
                    <div className="orderIdBox">
                        <div className="orderIdBoxTitle">Cod Ordine</div>
                        <div className="orderCodIdBox">{this.props.match.params.id}</div>
                    </div>
                </div>
                <div className="tableOrderBox">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Supplier</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articoloList.map( articolo => (
                                <tr key={articolo.item_name}>
                                    <td>{articolo.item_name}</td>
                                    <td>{articolo.supplier}</td>
                                    <td>{articolo.price * articolo.qnt}</td>
                                    <td>
                                        {(user === USER_TYPE.ADMINISTRATOR && editOrder === true) && (
                                        <IconContext.Provider value={{color: "red", size: "26px"}}>
                                            <button 
                                                className="buttonPlus"
                                                onClick={() => this.handleMinus(articolo.item_name)}
                                                >
                                                <FaMinusCircle />
                                            </button>
                                        </IconContext.Provider>
                                        )}

                                        {articolo.qnt}
                                        
                                        {(user === USER_TYPE.ADMINISTRATOR && editOrder === true) && (
                                            <IconContext.Provider value={{size: "30px"}}>
                                            <button 
                                                className="buttonPlus"
                                                onClick={() => this.handlePlus(articolo.item_name)}
                                                >
                                                <FcPlus />
                                            </button>
                                            </IconContext.Provider>
                                        )}
                                    </td>
                                </tr>
                                ))}
                            
                        </tbody>
                    </table>
                    {editOrder === false && (
                        <IconContext.Provider value={{ color: "red", size: "50px"}}>
                            <button 
                                className="buttonGoBack"
                                onClick={this.handleGoBack}
                                >
                                <HiArrowCircleLeft/>
                            </button>
                        </IconContext.Provider>
                    )}

                    {(user === USER_TYPE.ADMINISTRATOR && editOrder === false) && (
                        <IconContext.Provider value={{ color: "blue", size: "35px"}}>
                            <button 
                                className="buttonEditOrder"
                                onClick={this.handleEditOrder}
                                >
                                <FaPencilAlt/>
                            </button>
                        </IconContext.Provider>
                    )}

                    {editOrder === true && (
                        <div className="buttonsSaveCancel">
                            {user === USER_TYPE.ADMINISTRATOR && (
                                <div className="divButtonCancel">
                                    <button 
                                        className="btn btn-danger"
                                        onClick={this.handleGoBack}
                                        >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {user === USER_TYPE.ADMINISTRATOR  && (
                                <div className="divButtonSaveOrder">    
                                    <button 
                                        className="btn btn-primary"
                                        onClick={this.handleSaveOrder}
                                        >
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
           
        );
    }
}

export default OrderForm;