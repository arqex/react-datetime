import React, { Component } from 'react'
import DateTime from 'react-datetime'

export default class OpenExample extends Component {
  render() {
    return (
      <div>
        <h2>open</h2>
        <p>
          The "open" prop is only consumed when the component is mounted. Useful for embedding inside your own popover components.
        </p>
        <DateTime open input={false} onChange={console.log} />
      </div>
    )
  }
}
