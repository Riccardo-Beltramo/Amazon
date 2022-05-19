import React, { Component } from 'react';
import axios from 'axios';
import config from "../config.json";
import { USER_TYPE } from './common/Constants';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IconContext } from "react-icons";
import { FaPencilAlt, FaCartPlus } from "react-icons/fa";
import { HiArrowCircleLeft } from "react-icons/hi";
import { FcCrystalOscillator } from 'react-icons/fc';

class ArticoloForm extends Component {

    state = {
        data:{
            itemName:"",
            supplier:"",
            price:""
        },
        errors: {}
    }


    async componentDidMount() {
        const itemName = this.props.match.params.itemName;
        const conf = {
            params: {
               item_name: itemName
            }
        };

        try{
            await axios.get(config.apiArticoloEndpoint+`?nome=${articolo.itemName}`, conf)
            .then(response => {
            this.setState({ data: this.mapToViewModel(response.data)});
            }) 
        }catch (ex){
            if(ex.response && ex.response.status === 404)
                toast.error("Articolo non disponibile")
            this.props.history.push("/articoli");
        }
         
    }

    mapToViewModel(articolo) {
        return {
            itemName: articolo.itemName,
            supplier: articolo.supplier,
            price: articolo.price
        };
    }

    handleGoBack = () =>{
        this.props.history.push("/articoli");
    }

    handleAddCart = (itemName, price) => {
        const item = {};
        const cart = JSON.parse(localStorage.getItem("CART"));
        if(cart.some(i => i.itemName === itemName)){
            toast.info(itemName + " already in your Cart.");
        }else{
            item.itemName = itemName;
            item.quantity = 1;
            item.price = price;
            cart.push(item);
            toast.success(itemName + " added to your Cart");
            localStorage.setItem("CART", JSON.stringify(cart));
        }

        
    }
    

    render() {
        const user = localStorage.getItem("ROLE");
        const { data } = this.state;
        const { itemName, price } = this.state.data;
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("TOKEN");

        return (
             
            <div className="center-screen">
                
                <div className="articoloFormBox">
                    <h1>{data.itemName}</h1>
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Supplier</td>
                                <td>{data.supplier}</td>
                            </tr>
                            <tr>
                                <td>Price</td>
                                <td>{data.price}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="articoloIconBox">
                        <div className="goBackArticoloButtonBox">
                            <IconContext.Provider value={{ color: "red", size: "50px"}}>
                                <button 
                                    className="goBackArticoloButton"
                                    onClick={this.handleGoBack}
                                    >
                                    <HiArrowCircleLeft/>
                                </button>
                            </IconContext.Provider>
                        </div>
                        <div className="buttonEditBox">
                            {(user === USER_TYPE.ADMINISTRATOR)  && (
                                <Link to={`/new-articolo/${data.itemName}`}>
                                    <IconContext.Provider value={{ color: "blue", size: "30px"}}>
                                        <button className="buttonEdit">
                                            <FaPencilAlt />
                                        </button>
                                    </IconContext.Provider>
                                </Link>
                            )}
                        </div>
                        <div className="buttonCartBox">
                            <IconContext.Provider value={{ color: "green", size: "45px"}}>
                                <button 
                                    className="buttonCart"
                                    onClick={() => this.handleAddCart(itemName, price)}
                                    >
                                    <FaCartPlus/>
                                </button>
                            </IconContext.Provider>
                        </div>

                    </div>
                </div>
            </div>
            
        );
    }
}

export default ArticoloForm;