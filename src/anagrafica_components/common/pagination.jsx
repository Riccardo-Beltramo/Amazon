import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const Pagination = (props) => {
    const { itemCount, pageSize, currentPage, onPageChange} = props;

    const pagesCount = Math.ceil(itemCount / pageSize);

    if(pagesCount === 1) return null;
    let pages = 0;
    if(pagesCount === currentPage){
        if(pagesCount === 2){
            pages = _.range(currentPage - 1, currentPage + 1);
        }else{
            pages = _.range(currentPage - 2, currentPage + 1);
        }
    }else{
        if(pagesCount > 3){
            if(currentPage === 1 ){
                pages = _.range(1, 4);
            }else{
                pages = _.range(currentPage - 1, currentPage + 2);
            }
        }else{
            pages = _.range(1, pagesCount + 1);
        }
    }
    

    return (
        <nav>
            <ul className="pagination">
                {pages[0] !== 1 && (
                    <li 
                        className="page-item">
                        <a 
                            className="page-link"
                            style={{ cursor : "pointer"}} 
                            onClick={() => onPageChange(1)}
                        >
                            First
                        </a>
                    </li>
                )}
                { pages.map(page => (
                     <li key={page} className={ page === currentPage ? 'page-item active' : 'page-item'}>
                        <a  
                        className="page-link"
                        style={{ cursor : "pointer"}}  
                        onClick={() => onPageChange(page)}
                        >
                            {page}
                        </a>
                    </li>
                    )
                )}
                {pages[pages.length - 1] !== pagesCount && (
                    <li 
                        className="page-item">
                        <a 
                            className="page-link"
                            style={{ cursor : "pointer"}} 
                            onClick={() => onPageChange(pagesCount)}
                        >
                            Last
                        </a>
                    </li>
                )}
            </ul>
        </nav>
        );
};

Pagination.propTypes = {
    itemCount : PropTypes.number.isRequired, 
    pageSize: PropTypes.number.isRequired, 
    currentPage: PropTypes.number.isRequired, 
    onPageChange: PropTypes.func.isRequired
};
 
export default Pagination;