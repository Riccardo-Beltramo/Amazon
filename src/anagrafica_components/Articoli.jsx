import React, { Component } from 'react';
import Pagination from './common/pagination';
import ArticoliTable from './ArticoliTable';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { USER_TYPE } from './common/Constants';
import config from "../config.json";
import { identity } from 'lodash';
import SearchBox from './searchBox';



class Articoli extends Component {

    state = {
        articoli: [],
        currentPage: 1,
        totalRecord: 0,
        pageSize: 4,
        sortColumn: { path: 'id', order: 'asc'},
        searchQuery: "",
        selectedFilter: null
    }

    

    async componentDidMount(){
        await this.populateArticoli();
    }    
    
    async populateArticoli(){
        const { currentPage, pageSize, searchQuery } = this.state;
        const { path, order } = this.state.sortColumn;
        

        const conf = {
            params: {
                offset: pageSize * (currentPage - 1),
                limit: pageSize,
                sortColumn: path,
                order: order,
                str: searchQuery
            }
        };

        try{
            await axios.get(config.apiArticoliEndpoint, conf)
            .then(response => {
            this.setState({ articoli: response.data.records, totalRecord: response.data.totalRecord});
            })   
        }catch (ex){
            if(ex.response){
                toast.error("Error")
            }
        }
    }

    handleDelete = async articolo => {
        const originalArticoli = this.state.articoli;
        const articoli = originalArticoli.filter(a => a.itemName !== articolo.itemName);
        this.setState({ articoli });

        try{
            const conf = {
                headers: { 'Authorization': localStorage.getItem("TOKEN") },
                params: { item_name: articolo.itemName}
            };
         
            await axios.delete(config.apiDeleteArticoloEndpoint, conf);
            toast.success(articolo.itemName + " deleted successfully");
        } catch(ex) {
            if(ex.response && ex.response.status === 404)
                 toast.error("This articolo has already been deleted.");
            else
                toast.error("Delete not possible : " + articolo.itemName + " is present in a Order");
            this.setState({ articoli: originalArticoli });
        }   
    }

    handlePageChange = async page =>{
        const { pageSize, searchQuery } = this.state;
        const { path, order } = this.state.sortColumn;

        try{
            await axios.get(config.apiArticoliEndpoint, { params: {offset: pageSize * (page - 1), limit: pageSize,
                                                            sortColumn: path, order: order, str: searchQuery}})
            .then(response => {
                this.setState({ articoli: response.data.records, currentPage: page, });
            })   
        } catch ( ex ) {
            toast.error("Error changing page");
        }

    };

    handleSearch = async query =>{
        const { pageSize, currentPage } = this.state;
        const { path, order } = this.state.sortColumn;
        
        try{
            await axios.get(config.apiArticoliEndpoint, { params: {offset: 0, limit: pageSize,
                                                                sortColumn: path, order: order, str: query, }})
            .then(response => {
            this.setState({ articoli: response.data.records, searchQuery: query, selectedFilter: null, currentPage: 1, totalRecord: response.data.totalRecord});
            })
        } catch (ex) {
            toast.error("Error searching query");
        }
    };

    handleSort = async sortColumn =>{
        const { pageSize, currentPage, searchQuery } = this.state;

        try{
            await axios.get(config.apiArticoliEndpoint, { params: {offset: pageSize * (currentPage - 1), limit: pageSize,
                                                            sortColumn: sortColumn.path, order: sortColumn.order, str:searchQuery}})
            .then(response => {
                this.setState({ articoli: response.data.records, sortColumn: sortColumn});
            }) 
        } catch (ex) {
            toast.error("Error sorting attribute");
        }
    };

    handleChange = async selectedItemPerPage => {
        const { currentPage, searchQuery, totalRecord } = this.state;
        const { path, order } = this.state.sortColumn;
        const itemPerPage = parseInt(selectedItemPerPage, 10); 
       
        let currentPg = currentPage;
        if( (Math.ceil(totalRecord / itemPerPage)) < currentPg){
            if(currentPg > 1){
                currentPg = Math.ceil(totalRecord / itemPerPage);
            }
        }

        try{
            await axios.get(config.apiArticoliEndpoint, { params: {offset: itemPerPage * (currentPg - 1), limit: itemPerPage,
                                                            sortColumn: path, order: order, str: searchQuery}})
            .then(response => {
                this.setState({ articoli: response.data.records, pageSize: itemPerPage, currentPage: currentPg});
            })   
        } catch ( ex ) {
            toast.error("Error setting impossible item per page numer");
        }
    }


    render() {
        const { pageSize, currentPage, totalRecord, sortColumn, searchQuery } = this.state;
        const user = localStorage.getItem("ROLE");
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("TOKEN");
     
        return (
            <React.Fragment>
                    <div className="articoliBox">
                        <div className="newArticoloButton">
                            {(user === USER_TYPE.ADMINISTRATOR)  && (
                            <Link
                                to="/articoli/new"
                                className="btn btn-primary"
                                style={{ marginBottom: 20}}
                            >
                                New Articolo    
                            </Link>
                        )}
                        </div>
                        <SearchBox value={searchQuery} onChange={this.handleSearch}/>
                        <ArticoliTable 
                            articoli={this.state.articoli}
                            sortColumn={sortColumn}
                            onSort={this.handleSort}
                            onDelete={this.handleDelete}  
                        />
                        {totalRecord !== 0 && ( 
                            <React.Fragment>
                                <div className="paginationBox">
                                    <Pagination 
                                        itemCount={totalRecord} 
                                        pageSize={pageSize}
                                        currentPage={currentPage} 
                                        onPageChange={this.handlePageChange}
                                    />    
                                </div>
                                <div className="itemPerNameBox"> 
                                    <div className="itemPerName">
                                        <form>
                                            <select 
                                                value={pageSize}
                                                className="custom-select mr-sm-2" 
                                                id="inlineFormCustomSelect"
                                                onChange={e => this.handleChange(e.currentTarget.value)}
                                            >
                                                <option value={pageSize - 1}>{pageSize - 1}</option>
                                                <option value={pageSize}>{pageSize}</option>
                                                <option value={pageSize + 1}>{pageSize + 1}</option>
                                            </select>
                                        </form> 
                                    </div>
                                    <div className="itemPerNameTxt">
                                    Items per Page
                                    </div>
                                </div>
                            </React.Fragment>
                        )}
                    </div>
            </React.Fragment>
            
        );
    }
}

export default Articoli;