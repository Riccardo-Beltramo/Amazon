import React, { Component } from 'react';
import Joi from 'joi-browser';
import axios from 'axios';
import config from "../config.json";
import { toast } from 'react-toastify';
import Form from './common/form';
import { Link } from 'react-router-dom';

class ArticoloNew extends Form {
    state = { 
        data: {
            itemName:"",
            supplier:"",
            price:""
        },
        errors: {}
     };

     schema = {
        itemName: Joi.string().required().label("Item Name"),
        supplier: Joi.string().required().label("Supplier"),
        price: Joi.number().required().min(1).max(5000).label("Price")
     };

    async populateArticolo(){
         try{
             const articoloId = this.props.match.params.id;
             if (articoloId === "new") return;
    
             await axios.get(config.apiArticoloEndpoint, {params: {item_name: articoloId}})
             .then(response => {
                //  console.log(response.data);
                 this.setState({ data: this.mapToViewModel(response.data)});
             })

         }catch (ex) {
             if(ex.response && ex.response.status === 404)
                this.props.history.replace("/not-found");
         }
    }

    async componentDidMount() {
        await this.populateArticolo();
    };

     mapToViewModel(articolo) {
         return {
            itemName: articolo.itemName,
            supplier: articolo.supplier,
            price: articolo.price
         };
     }

     handleCancel = event => {
        event.preventDefault();
         this.props.history.push("/articoli");
     }


    doSubmit = async () => {
        const articoloId = this.props.match.params.id;

        const headers = { 
                        'Authorization': localStorage.getItem("TOKEN"),
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'   
                    };
        

        if(articoloId === "new"){
            const conf = { headers: { ...headers } };

            const postRequest = {
            itemName: this.state.data.itemName,
            supplier: this.state.data.supplier,
            price: this.state.data.price
            };

            try{
                await axios.post(config.apiNewArticoloEndpoint, postRequest, conf);
                toast.success(this.state.data.itemName + " created successfully");
                this.props.history.push("/articoli");
            }catch (ex){
                if(ex.response && ex.response.status === 409)
                    toast.error("Item already created with that Item Name")
                else
                    toast.error("Error");
            }
              
        }else {
            const conf = { headers: { ...headers }, params: { item_name: articoloId} };

            const putRequest = {
                supplier: this.state.data.supplier,
                free_shipping: this.state.data.prime === "2" ? false : true,
                price: this.state.data.price
            }

            try{
                await axios.put(config.apiUpdateArticoloEndpoint, putRequest, conf);
                toast.success(this.state.data.itemName + " edited successfully");
                this.props.history.push("/articoli");
            }catch (ex) {
                toast.error("Error");
            }   
        }
        
     };

    render() { 
        return (
            <div className="newArticolo">
                <h1>New Articolo Form</h1>
                <div className="inputNewArticolo">
                    <form onSubmit={this.handleSubmit}>
                        {this.renderInput("itemName", "Item Name")}
                        {this.renderInput("supplier", "Supplier")}
                        {this.renderInput("price", "Price")}
                        {this.renderButton("Save")}
                        <div className="buttonCancel">
                            <button onClick={this.handleCancel} className="btn btn-danger">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}


export default ArticoloNew;