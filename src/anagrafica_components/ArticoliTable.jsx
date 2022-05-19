import React, { Component } from 'react';
import Table from './common/Table';
import { USER_TYPE } from './common/Constants';
import { Link } from 'react-router-dom';
import { IconContext } from "react-icons";
import { BsCheckCircle, BsXLg } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";


class ArticoliTable extends Component {
    columns = [
        { path: 'nome', label: 'Name',  content: articolo => <Link to={`/articoli/${articolo.nome}`}>{articolo.nome}</Link> },
        { path: 'fornitore', label: 'Supplier'},
        { path: 'prezzo', label: 'Price'}
    ];
    
    deleteColumn =  { 
        key: 'delete', 
        content: articolo => (
            <React.Fragment>
                <IconContext.Provider value={{color: "black"}}>
                    <button 
                        className="buttonNoBorder"
                        onClick={() => this.props.onDelete(articolo)} 
                    ><FaTrash />
                    </button>
                </IconContext.Provider>
            </React.Fragment>
            )
    };

    constructor(){
        super();
        const user = localStorage.getItem("ROLE");
        if(user === USER_TYPE.ADMINISTRATOR)
            this.columns.push(this.deleteColumn);
    }

    mapArticoliView(){  
        const { articoli } = this.props;
        let articoliList = [];
     
        for(let i = 0; i < articoli.length; i++){
            articoliList.push({ itemName: articoli[i].itemName, 
                                supplier: articoli[i].supplier,
                                price: articoli[i].price
                            });
        }
        return articoliList;
    }

    render() {
        const { articoli, onSort, sortColumn } = this.props;

        return (
            <Table 
                columns={this.columns}
                data={articoli}
                sortColumn={sortColumn} 
                onSort={onSort}    
            />
        );
    }
}

export default ArticoliTable;