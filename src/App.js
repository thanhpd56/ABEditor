import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ABEdior from './editor/ABEditor'

class App extends Component {
  render() {
    return (
      <div className="App">
          <ABEdior></ABEdior>
      </div>
    );
  }
}

export default App;
