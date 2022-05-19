import React from 'react';
import TableBody from './TableBody';
import TableHeader from './TableHeader';


const Table = ({ columns,sortColumn, onSort, data }) => {
    return (  
        <table className="table table-striped">
                <TableHeader 
                    columns={columns}
                    sortColumn={sortColumn}
                    onSort={onSort}
                />
                <TableBody columns={columns} data={data}/>
            </table>
    );
};
 
export default Table;