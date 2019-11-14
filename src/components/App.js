import React from 'react';
import logo from '../img/logo.svg';

import '../../node_modules/@fortawesome/fontawesome-free/css/all.css';

function App() {
  return (
    <div id="wrapper">
      <header className="App-header">
        <img src={logo} className="logo" alt="logo" />
        <p><i class="fa fa-check 2x mr-2" />PLAYGROUND</p>
      </header>
    </div>
  );
}

export default App;
