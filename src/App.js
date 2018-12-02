import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ABEdior from './editor/ABEditor'
import 'antd/dist/antd.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state  = {
            customizationList: [],
            customCss: '',
            customJs: '',}
    }

    render() {
    return (
      <div className="App">
          <ABEdior customizationList={this.state.customizationList}
                   customCss={this.state.customCss}
                   customJs={this.state.customJs}
                   onCustomCssChange={this.handleCssChange}
                   onCustomJsChange={this.handleJsChange}
                   onCustomizationListChange={this.handleCustomizationListChange}
          />
      </div>
    );
  }

    handleCssChange = (customCss) => {
        this.setState({
            customCss,
        })
    };

    handleJsChange = (customJs) => {
        this.setState({
            customJs,
        })
    };

    handleCustomizationListChange = (customizationList) => {
        this.setState({
          customizationList: customizationList.slice()
        })
    };
}

export default App;
