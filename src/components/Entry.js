import React from 'react';
import moment from 'moment';

/**
 * Entry composed of a product, a quantity and dates (start & end)
 * @param {Product} product Product object
 * @param {Number} quantity Quantity of products
 */
class Entry extends React.Component {
    constructor(product = null, quantity = null) {
        super();
        this.product = product;
        this.quantity = quantity;
        this.dates = {
            startDate: moment(),
            endDate: moment()
        };
    }
}

export default Entry;