import React from 'react';

/**
 * Person or client
 * @param {Number} id Unique ID
 * @param {String} firstname Person's firstname
 * @param {String} lastname Person's lastname
 */
class Person extends React.Component {
    constructor(id, firstname, lastname) {
        super();
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
    }
}

export default Person;