import React, { Component } from 'react';
import axios from 'axios';
import config from "../config.json";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { USER_TYPE } from './common/Constants';
import { IconContext } from "react-icons";
import { FaTrash } from "react-icons/fa";
import Pagination from './common/pagination';

class Order extends Component {

    state = {
        cods: [],
        totalRecord: 0,
        currentPage: 1,
        pageSize: 6
    }

    async componentDidMount(){
        const { currentPage, pageSize } = this.state;

        const conf = {
            headers: { 'Authorization': localStorage.getItem("TOKEN") },
            params: {
                offset: pageSize * (currentPage - 1),
                limit: pageSize,
                username: this.props.match.params.username
            }
        };
        
        try{
            await axios.get(config.apiOrdiniEndpoint,conf)
            .then(response => {
                this.setState({ cods: response.data.records, totalRecord: response.data.totalRecord});
                })
        }catch (ex){
            if(ex.response && ex.response.status === 401){
                toast.error("Error : User have no permission to read orders from other users")
            }else if(ex.response && ex.response.status === 404)
                toast.error(this.props.match.params.username + " not Found");
            else{
                toast.error("Error");
            }
            this.props.history.push("/articoli");
        }
        
    }

    handlePageChange = async page =>{
        const { pageSize } = this.state;
        
        const conf = {
            headers: { 'Authorization': localStorage.getItem("TOKEN") },
            params: {
                offset: pageSize * (page - 1),
                limit: pageSize,
                username: this.props.match.params.username
            }
        };

        try{
            await axios.get(config.apiOrdiniEndpoint, conf)
            .then(response => {
                this.setState({ cods: response.data.records, currentPage: page, });
            })   
        } catch (ex) {
            toast.error("Error changing page");
        }
    };


    handleDeleteOrder = async order =>{
        const originalOrders = this.state.cods;
        const orders = originalOrders.filter(o => o.codice !== order);
        this.setState({ cods: orders });

        try{
            const conf = {
                headers: { 'Authorization': localStorage.getItem("TOKEN") },
                params: { codice: order}
            };
            await axios.delete(config.apiDeleteOrdineEndpoint, conf)
        } catch(ex) {
            if(ex.response && ex.response.status === 404)
                 toast.error("This order has already been deleted.");
            else
                toast.error("Error");
            this.setState({ cods: originalOrders });
        }   
    }


    render() {
        const { cods, totalRecord, pageSize, currentPage} = this.state;
        const  user  = localStorage.getItem("ROLE");
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("TOKEN");

        return (
            <div className="ordersBox">
                <h1>{this.props.match.params.username} orders</h1>
                <ul className="list-group">
                    {cods.map(cod =>(
                        <li
                            key={cod.codice}
                            className="list-group-item"
                        >
                            <div className="orderCodBox"><Link to={`/order/${cod.codice}`}>{cod.codice}</Link></div>
                            
                            { user === USER_TYPE.ADMINISTRATOR && (
                                <IconContext.Provider value={{color: "red"}}>
                                    <button 
                                        className="buttonDeleteOrdine"
                                        onClick={() => this.handleDeleteOrder(cod.codice)}
                                        ><FaTrash />
                                    </button>
                                </IconContext.Provider>
                            )}

                            <div className="indirizzoBox">
                                <div className="indirizzoBoxTitle">IN</div>
                                <div className="indirizzoBoxUtente"> {cod.utente.indirizzo}</div>
                            </div>
                            <div className="userBox">
                                <div className="userBoxTitle">SENDED TO</div>
                                <div className="userBoxUtente"> {cod.utente.nome}</div>
                            </div>         
                        </li> 
                    ))}
                </ul>
                {totalRecord !== 0 && ( 
                    <div className="paginationBox">
                        <Pagination
                            itemCount={totalRecord} 
                            pageSize={pageSize}
                            currentPage={currentPage} 
                            onPageChange={this.handlePageChange}
                        /> 
                    </div>
                )}
            </div>
        );
    }
}

export default Order;