import React, { Component } from 'react';
import _ from 'lodash';
import { IconContext } from "react-icons";
import { BsCheckCircle, BsXLg } from "react-icons/bs";

class TableBody extends Component {

    renderCell = (item, column) => {
        if(column.content) return column.content(item);
        return _.get(item, column.path);
    };

    checkCircleTrue(){
        return (
            <IconContext.Provider value={{color: "green"}}>
                <BsCheckCircle />
            </IconContext.Provider>
        );
    }

    bsXLg(){
        return(
            <IconContext.Provider value={{color: "red"}}>
                <BsXLg />
            </IconContext.Provider>
        );
    }
    
    createKey = (item, column) =>{
        return item.itemName + (column.path || column.key);
    };

    render() {
        const { data, columns } = this.props;

        return (
            <tbody>
                {data.map((item, i) => (
                    <tr key={i++}>
                        {columns.map(column => (
                            <td key={i++}>
                                {this.renderCell(item, column)}
                            </td>
                        ))}
                    </tr>
                    ))} 
            </tbody>
        );
    }
}

export default TableBody;
