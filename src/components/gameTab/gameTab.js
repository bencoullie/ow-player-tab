import './gameTab.css'

import React, { Component } from 'react'

class GameTab extends Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    fetch('http://ow-api.herokuapp.com/profile/pc/us/VoA-1535')
      .then(response => {
        response.json().then(data => {
          this.setState({ profile: data })
        })
      })
      .then(() => {
        console.log('Profile info:', this.state.profile)
      })
  }

  render () {
    const ready = this.state && this.state.profile

    return (
      <div className='gameTab-wrapper'>
        <div>
          <h1>{ready && this.state.profile.username}</h1>
          <h1>Season stats:</h1>
          <h1>Time in Comp: {ready && this.state.profile.playtime.competitive}</h1>
          <h1>Time in Quickplay: {ready && this.state.profile.playtime.quickplay}</h1>
          <canvas id='myChart' />
          <h1>Rank:</h1>
          <img src={ready && this.state.profile.competitive.rank_img} />
        </div>
      </div>
    )
  }
}

export default GameTab
