import React, { Component } from 'react'
import 'react-datetime/css/react-datetime.css'

import CustomizableExample from './CustomizableExample'
import OpenExample from './OpenExample'
import ValidatedExample from './ValidatedExample'

export default class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse navbar-static-top">
          <div className="container">
            <a
              className="navbar-brand"
              href="https://github.com/YouCanBookMe/react-datetime"
              target="_blank"
              rel="noopener noreferrer"
            >react-datetime</a>
          </div>
        </nav>

        <div className="container">
          <div className="jumbotron">
            <h2>react-datetime</h2>
            <p>
              A lightweight but complete datetime picker react component.
            </p>
          </div>

          <div className="row">
            <div className="col-xs-4">
              <CustomizableExample />
            </div>
            <div className="col-xs-4">
              <OpenExample />
            </div>
            <div className="col-xs-4">
              <ValidatedExample />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
