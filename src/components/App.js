import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

import Select from 'react-select';
import { DateRange } from 'react-date-range';

import Entry from './Entry';
import Person from './Person';
import Product from './Product';
import Reservation from './Reservation';

import logo from '../img/logo.png';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';

/**
 * Reservation of products by the client with PDF generation
 */
class App extends Component {
  state = {
    activeCalendar: null,
    page: "create",
    persons: [],
    products: [],
    reservation: null,
    reservations: [],
    selectedProduct: {},
  };

  componentDidMount() {
    let person1 = new Person(1001, "Foo", "Bar");
    let person2 = new Person(1002, "Bar", "Foo");
    let person3 = new Person(1003, "Iron", "Man");

    let product1 = new Product(1001, "Salle des fêtes", 1, "daily", 200);
    let product2 = new Product(1002, "Chapiteau", 3, "daily", 50);
    let product3 = new Product(1003, "Château gonflable", 2, "daily", 100);
    let product4 = new Product(1004, "Pompe à bière", 5, "hourly", 40);
    let product5 = new Product(1005, "Voiture électrique", 3, "hourly", 500);
    let product6 = new Product(1006, "Cafetière", 4, "hourly", 20);
    let product7 = new Product(1007, "Friteuse", 4, "hourly", 40);
    let product8 = new Product(1008, "Tente SNJ", 3, "daily", 50);
    let product9 = new Product(1009, "Podium", 1, "daily", 50);

    let emptyReservation = new Reservation(person1, new Entry());

    // Default reservation to override creation process
    let reservations = [];
    reservations.push(new Reservation(person1, new Entry(product1, 1)));

    this.setState({
      products: [product1, product2, product3, product4, product5, product6, product7, product8, product9],
      persons: [person1, person2, person3],
      reservation: emptyReservation,
      reservations: reservations
    });
  }

  setName = e => {
    this.setState({ name: e.target.value });
  }

  /**
   * Adds an empty entry to the reservation
   */
  addItem = () => {
    let tmp = this.state.reservation;
    tmp.entries.push(new Entry());

    this.setState({ reservation: tmp });
  }

  /**
   * Removes an reservation's entry
   * @param {Number} key Entry's index to be removed
   */
  removeItem = (key) => {
    let reservation = this.state.reservation;
    reservation.entries.splice(key, 1);

    this.setState({ reservation: reservation });
  }

  /**
   * Handles the product selection
   * @param {Product} product Selected product
   * @param {Number} key Index of the selected product
   */
  onChangeProduct(product, key) {
    let reservation = this.state.reservation;

    if (!product) {
      reservation.entries[key].product = null;
      return;
    }

    let productFound = false;

    // Check if product already inside one of the entries
    for (let i = 0; i < reservation.entries.length; i++) {
      if (reservation.entries[i].product && reservation.entries[i].product.id === product.id) {
        productFound = true;
        return;
      }
    }

    if (productFound) return;

    // If product not found inside one of the entries, add it
    reservation.entries[key].product = product;

    // Cas 1: produit ajouté et suppression     
    // let products = this.state.products;
    // console.log("ENTRY", document.getElementById("entry" + key).innerHTML);

    // Object.is(reservation.entries[key].product, product) ?
    //   reservation.entries[key].products.splice(reservation.entries[key].products.indexOf(product), 1)
    //   : reservation.entries[key].products.push(product);

    // products.splice(products.indexOf(product), 1);

    this.setState({ reservation: reservation });
  }

  /**
   * Handles the quantity selection
   * @param {Event} event Contains the quantity value of the input
   * @param {Number} maxQty Maximal quantity of a product a user can add
   * @param {Number} key Entry's index
   */
  onChangeQuantity = (event, maxQty, key) => {
    let reservation = this.state.reservation;

    if (event.target.value > maxQty) {
      alert("ERROR: Maximal number authorized: " + maxQty);
      return;
    }

    reservation.entries[key].quantity = event.target.value;

    this.setState({ reservation: reservation });
  }

  /**
   * Opens the specified entry's calendar
   * @param {Number} index Entry's index to identify which calendar to open
   */
  toggleCalendar = index => {
    this.setState({ activeCalendar: this.state.activeCalendar === index ? null : index })
  }

  /**
   * Handles the date changes on the object's calendar
   * @param {Reservation} reservation Copy of the current reservation inside the state
   * @param {Number} key Index of the selected dates
   * @param {Object} dates Range of the selected dates
   */
  handleCalendar(reservation, key, dates) {
    let copyReservation = reservation;

    copyReservation.entries[key].dates.startDate = dates.startDate;
    copyReservation.entries[key].dates.endDate = dates.endDate;

    this.setState({ reservation: copyReservation });
  }

  /**
   * Creates a reservation for the specified client
   * @param {Person} client Person who made the reservation (null if not specified)
   */
  createReservation = (client = null) => {
    if (!client) {
      client = new Person(1001, "Foo", "Bar");
    }
    let reservations = this.state.reservations;
    let reservation = this.state.reservation;

    if (!this.checkReservation()) {
      alert("Invalid reservation. Try again.");
      return;
    }

    reservation.isValidated = true;
    reservations.push(reservation);

    this.setState({
      reservation: new Reservation(client, new Entry()),
      reservations: reservations
    });
  }

  /**
   * Checks if the reservation is valid
   * @returns {Boolean} True if valid, false if not
   */
  checkReservation = () => {
    let reservation = this.state.reservation;

    for (let i = 0; i < reservation.entries.length; i++) {
      if (!reservation.entries[i].product || reservation.entries[i].quantity < 1) return false;
    }
    return true;
  }

  /**
   * Generate a PDF based on the selected reservation
   * @param {Reservation} reservation Selected reservation to be printed
   * @returns PDF of the selected reservation
   */
  generatePDF = (reservation, key) => {
    const res = reservation;
    const reservations = this.state.reservations;
    reservations[key].isFixed = true;

    this.setState({ reservations: reservations })

    const styles = StyleSheet.create({
      page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
      },
      section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
      }
    });

    const MyDocument = () => (
      <PDFViewer>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              {res.entries.map(entry => (
                <Fragment>
                  <Text>Product: {entry.product.name}</Text>
                  <Text>Pricing method: {entry.product.pricingMethod === "daily" ? "50€/day" : "8€/day"}</Text>
                  <Text>Quantity: {entry.quantity}</Text>
                  <Text>From: {entry.dates.startDate.format("ll")}</Text>
                  <Text>To: {entry.dates.endDate.format("ll")}</Text>
                </Fragment>
              ))}
            </View>
          </Page >
        </Document >
      </PDFViewer >
    );

    ReactDOM.render(<MyDocument />, document.getElementById('pdfPreview'));
  }

  render() {
    console.log("RES", this.state.reservations);

    let listPersons = this.state.persons.map(person => {
      return { label: person.firstname + (person.lastname !== null ? " " + person.lastname : ""), value: person }
    });
    let listProducts = this.state.products.map(product => {
      return { label: product.name, value: product }
    });

    let isFirst = true;

    return (
      <main id="wrapper">
        <div className="fixedTopRight vertical">
          <a href="#wrapper" className="squared contrast shadowS" title="Go to top">
            <i className="adaptiveSize fas fa-chevron-up"></i>
          </a>
          <a href="#bottom" className="squared contrast shadowS mt-2" title="Go to bottom">
            <i className="adaptiveSize fas fa-chevron-down"></i>
          </a>
        </div>
        <header>
          <img src={logo} className="logo" alt="logo" />
          <h1 className="my-3">
            {!this.state.name ?
              "What's your name ?"
              :
              "Welcome " + this.state.name + " !"
            }
          </h1>
          <input id="name" onKeyUp={e => this.setName(e)} />
          <a href="#playground" className="mt-3">
            <button>Rent your items !</button>
          </a>
        </header>
        <section id="playground">
          <div className="bgLightPrimary p-3">
            <span>Client: (doesn't do anything atm)</span>
            <Select
              className="black widthS mb-3"
              isSearchable
              onChange={target => console.log("TARGET", target)}
              options={listPersons}
              placeholder={"Select the client..."}
              value={this.state.reservation && this.state.reservation.client && this.state.reservation.client.firstname ?
                {
                  label: this.state.reservation.client.firstname + " " + this.state.reservation.client.lastname,
                  value: this.state.reservation.client
                } : undefined}
            />
            <span>Reservation: </span>
            {this.state.reservation && this.state.reservation.entries && this.state.reservation.entries.map((entry, key) => {
              return (
                <Fragment key={key}>
                  <form className="d-flex justify-content-between align-items-center widthL mb-3">
                    <Select
                      className="black widthS"
                      isSearchable
                      onChange={target => this.onChangeProduct(target && target.value, key)}
                      options={listProducts}
                      placeholder={"Select a product to rent..."}
                      value={entry.product && entry.product.name ? { label: entry.product.name, value: entry.product } : undefined}
                    />
                    <label>
                      <span>Quantity: </span>
                      <input
                        disabled={!entry.product}
                        min={entry.product && entry.product.maxQty ? 1 : 0}
                        max={entry.product && entry.product.maxQty ? entry.product.maxQty : 0} // TODO Calcul du nombre d'items restants louables
                        onChange={e => this.onChangeQuantity(e, entry.product.maxQty, key)}
                        type="number"
                        value={entry.quantity ? entry.quantity : 0}
                      />
                    </label>
                    <div className="d-flex justify-content-between align-items-center text-right">
                      <span>{entry.dates.startDate.format("ll")} - {entry.dates.endDate.format("ll")}</span>
                      <button className="ml-3" onClick={() => this.toggleCalendar(key)}>
                        <i className="fa fa-calendar-alt pointer" title="Show calendar" />
                      </button>
                      {this.state.reservation.entries.length > 1 && (
                        <button
                          className="ml-3 bgRed"
                          onClick={() => this.removeItem(key)}
                          title="Remove product">
                          <i className="fa fa-trash-alt" />
                        </button>
                      )}
                    </div>
                  </form>
                  {this.state.activeCalendar === key && (
                    <DateRange
                      onChange={this.handleCalendar.bind(this, this.state.reservation, key)}
                    />
                  )}
                </Fragment>
              );
            })}
            <button
              className="align-items-center widthL mb-4"
              onClick={() => this.addItem()}>
              <i className="fa fa-plus" />
              <span className="ml-2">Rent another item</span>
            </button>
            <br />
            {this.state.reservation && this.state.reservation.isValidated ? (
              <Fragment>
                {this.state.reservation.isFixed ? (
                  <button onClick={() => this.generatePDF(this.state.reservation)}>
                    <i className="fa fa-file-pdf mr-2" />
                    <span>Generate PDF</span>
                  </button>
                ) : (
                    <Fragment>
                      <button className="mr-2" onClick={() => this.modifyReservation()}>
                        <i className="fa fa-pencil-alt mr-2" />
                        <span>Modify</span>
                      </button>
                    </Fragment>
                  )}
              </Fragment>
            ) : (
                <button onClick={() => this.createReservation()}>
                  <i className="fa fa-check mr-2" />
                  <span>Finish your reservation</span>
                </button>
              )}
          </div>



          <div className="row mt-5">
            <div className="col-5 bgLightPrimary p-3">
              <h3>Reservation table</h3>
              {this.state.persons && this.state.persons.map((person, key) => (
                <Fragment>
                  {/* Should look at how many reservations a client has. If 0, don't show */}
                  <span>{person.firstname} {person.lastname}</span>
                  <table key={key}>
                    {this.state.reservations.length > 0 && this.state.reservations.map((reservation, secondKey) => (
                      <div className="mt-3">
                        {isFirst && (
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Quantity</th>
                              <th>Dates</th>
                              <th>Modify</th>
                              <th>PDF</th>
                            </tr>
                          </thead>
                        )}
                        {person.firstname === reservation.client.firstname && (
                          <Fragment>
                            <tbody>
                              {reservation.entries.map((entry, thirdKey) => (
                                <tr key={thirdKey}>
                                  <td>{entry.product.name}</td>
                                  <td>{entry.quantity}</td>
                                  <td>
                                    From: {entry.dates.startDate.format("ll")}
                                    <br />
                                    To: {entry.dates.endDate.format("ll")}
                                  </td>
                                  <td className="contrast pointer" onClick={() => this.setState({ reservation: reservation })}>
                                    <i className="fa fa-pencil-alt fa-2x" />
                                  </td>
                                  <td className="contrast pointer" onClick={() => this.generatePDF(reservation, secondKey)}>
                                    <i className="fa fa-file-pdf fa-2x" />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Fragment>
                        )}
                        {isFirst ? isFirst = !isFirst : null}
                      </div>
                    ))}
                  </table>
                </Fragment>
              ))}
            </div>
            <div className="col">
              <div id="pdfPreview" className="text-left"></div>
            </div>
          </div>


          <div className="mt-5">
            <ul className="weekdays">
              <li>Monday</li>
              <li>Tuesday</li>
              <li>Wednesday</li>
              <li>Thursday</li>
              <li>Friday</li>
              <li>Saterday</li>
              <li>Sunday</li>
            </ul>

            <ul className="days">
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
              <li>6</li>
              <li>7</li>
              <li>8</li>
              <li>9</li>
              <li><span className="active">10</span></li>
              <li>11</li>
              <li>12</li>
              <li>13</li>
              <li>14</li>
              <li>15</li>
              <li>16</li>
              <li>17</li>
              <li>18</li>
              <li>19</li>
              <li>20</li>
              <li>21</li>
              <li>22</li>
              <li>23</li>
              <li>24</li>
              <li>25</li>
              <li>26</li>
              <li>27</li>
              <li>28</li>
              <li>29</li>
              <li>30</li>
              <li>31</li>
            </ul>
          </div>
        </section>
        <footer id="bottom">
          <a href="#wrapper" className="contrast expand center"><i className="fas fa-chevron-up mr-2"></i>Go up</a>
        </footer>
      </main >
    );
  }
}

export default App;