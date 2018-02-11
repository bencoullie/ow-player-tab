import './loadScreen.css'

import React, { Component } from 'react'

import owLoader from '../../../src/images/ow-loader.gif'

class LoadScreen extends Component {
  constructor () {
    super()
  }

  render () {
    return (
      <div className='loader-wrapper'>
        <img src={owLoader} alt='Loading animation' width='400' />
      </div>
    )
  }
}

export default LoadScreen
