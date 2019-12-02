import React from 'react';
import moment from 'moment';

/**
 * Reservation made by a client
 * @param {Person} client Data of the client that created the reservation
 * @param {Entry} entry A reservation is composed of one or more entries
 */
class Reservation extends React.Component {
    constructor(client, entry) {
        super();
        this.client = client;
        this.entries = entry ? [entry] : null;
        this.dates = {
            startDate: moment(),
            endDate: moment()
        };
        this.isValidated = false;
        this.isFixed = false;
    }
}

export default Reservation;