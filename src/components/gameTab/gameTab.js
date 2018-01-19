import './gameTab.css'

import React, { Component } from 'react'

class GameTab extends Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    fetch('http://ow-api.herokuapp.com/profile/pc/us/VoA-1535').then(response => {
      response.json().then(data => {
        this.setState({ profile: data })
      })
    })
  }

  render () {
    return (
      <div className='gameTab-wrapper'>
        <div>
          <h1>Hello world!</h1>
        </div>
      </div>
    )
  }
}

export default GameTab
