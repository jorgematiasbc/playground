import React, { Component, Fragment } from 'react';
import logo from '../img/logo.png';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';

class App extends Component {
  state = {
    bank: {
      coal: 100.00,
      cheese: 100.00,
      bikes: 100,
      books: 100
    },
    corgans: [],
    market: [],
    name: "",
    buyTaxes: {
      coal: 0.75,
      cheese: 0.15,
      bikes: 0.15,
      books: 0
    },
    sellTaxes: {
      coal: 0.75,
      cheese: 0.15,
      bikes: 0.15,
      books: 0
    },
  };

  componentDidMount() {
    let corgan1 = {
      name: "Foo",
      resources: {
        coal: 0.0,
        cheese: 0.0,
        bikes: 0,
        cg: 0,
      }
    }

    let corgan2 = {
      name: "Bar",
      resources: {
        coal: 10.0,
        cheese: 5.0,
        bikes: 2,
        cg: 4.12,
      }
    }

    let corgan3 = {
      name: "Alex",
      resources: {
        coal: 5.0,
        cheese: 10.0,
        bikes: 0,
        cg: 50,
      }
    }

    let offer1 = {
      from: corgan1.name,
      bikes: 1
    }

    let offer2 = {
      from: corgan2.name,
      coal: 5.0
    }

    let offer3 = {
      // from: corgan3.name,
      cheese: 5.0,
    }

    this.setState({
      corgans: [corgan1, corgan2, corgan3],
      market: [offer1, offer2, offer3]
    });
  }

  setName = () => {
    this.setState({ name: document.getElementById("name").value });
  }

  listOffers = market => {
    return (
      <table className="widthM">
        <thead>
          <tr>
            <th colSpan={market.length}>Market Square</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {market.map((offer, key) => (
              offer.from ? (
                <Fragment>
                  <td key={key}>
                    <p>From: {offer.from}</p>
                    {offer.coal && (
                      <p>Coal: {offer.coal}</p>
                    )}
                    {offer.coal && (
                      <p>Cheese: {offer.cheese}</p>
                    )}
                    {offer.coal && (
                      <p>Bikes: {offer.bikes}</p>
                    )}
                    {offer.coal && (
                      <p>CG: {offer.cg}</p>
                    )}
                  </td>
                </Fragment>
              ) : (
                  <p className="red">Invalid offer</p>
                )
            ))}
          </tr>
          <tr>
            <td>
              <a>TEST</a>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  checkOffer = offer => {
    if (offer.hasOwnProperty("bikes")) {

      return;
    }
  }

  checkGovernment = () => {
    return (
      <table className="widthM">
        <thead>
          <tr>
            <th colSpan={this.state.corgans.length}>The table header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {this.state.corgans.map((corgan, key) => (
              <td key={key}>
                <p>Name:  {corgan.name}</p>
                <p>Coal:  {corgan.resources.coal}</p>
                <p>Cheese:  {corgan.resources.cheese}</p>
                <p>Bikes: {corgan.resources.bikes}</p>
                <p>CG:    {corgan.resources.cg}</p>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <main id="wrapper">
        <div className="floating vertical">
          <a href="#wrapper" className="shadowS squared anchor transparent mb-2"><i className="adaptiveSize fas fa-chevron-up"></i></a>
          <a href="#bottom" className="shadowS squared anchor transparent"><i className="adaptiveSize fas fa-chevron-down"></i></a>
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
          <input id="name" onKeyUp={e => this.setName()} />
          <a
            href="#playground"
            className="btnLike mt-3">
            <span>Proceed to playground</span>
          </a>
        </header>
        <section id="playground" className="white">
          <table className="widthM">
            <thead>
              <tr>
                <th colSpan={this.state.corgans.length}>The table header</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {this.state.corgans.map((corgan, key) => (
                  <td key={key}>
                    <p>Name:  {corgan.name}</p>
                    <p>Coal:  {corgan.resources.coal}</p>
                    <p>Cheese:  {corgan.resources.cheese}</p>
                    <p>Bikes: {corgan.resources.bikes}</p>
                    <p>CG:    {corgan.resources.cg}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <div>
            {this.listOffers(this.state.market)}
          </div>
        </section>
        <footer id="bottom">
          <a href="#wrapper" className="anchor expand center"><i className="fas fa-chevron-up mr-2"></i>Go up</a>
        </footer>
      </main>
    );
  }
}

export default App;