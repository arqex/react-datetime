import React from 'react'
import createReactClass from 'create-react-class'
import onClickOutside from 'react-onclickoutside'

const Picker = createReactClass({
  displayName: 'Picker',

  handleClickOutside() {
    if (this.props.onClickOutside)
      this.props.onClickOutside()
  },

  render() {
    return (
      <div className='rdtPicker'>
        { this.props.children }
      </div>
    )
  }
})

export default onClickOutside(Picker)
