import React from 'react';

/**
 * Product a client can rent
 * @param {Number} id Unique ID
 * @param {String} name Product's name
 * @param {Number} maxQty Maximum number of times the item can be rented in a certain period of time by a client
 * @param {String} pricingMethod String containing the pricing method, "hourly" for X€/hour, daily for X€/day
 * @param {Number} caution Price of the caution in case the client does not return the item
 */
class Product extends React.Component {
    constructor(id, name, maxQty, pricingMethod, deposit) {
        super();
        this.id = id;
        this.name = name;
        this.maxQty = maxQty;
        this.pricingMethod = pricingMethod;
        this.deposit = deposit;
    }
}

export default Product;