import './mainContent.css'

import React, { Component } from 'react'

// import winLossChart from '../winLossChart/winLossChart'

class MainContent extends Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    // Get profile
    window.fetch('http://ow-api.herokuapp.com/profile/pc/us/VoA-1535').then(response => {
      response.json().then(data => {
        console.log('profile data: ', data)
        this.setState({ profile: data })
      })
    })

    // Get stats
    window.fetch('http://ow-api.herokuapp.com/stats/pc/us/VoA-1535').then(response => {
      response.json().then(data => {
        console.log('stats data: ', data)
        this.setState({ stats: data.stats })
        // winLossChart(data)
      })
    })
  }

  render () {
    const ready = this.state && this.state.profile && this.state.stats

    return (
      <div>
        {ready &&
          <div>
            <div>
              <h1 className='header header--primary'>Name:</h1>
              <h1 className='header header--primary'>{this.state.profile.username}</h1>
            </div>
            <div>
              <h1 className='header header--primary'>Rank:</h1>
              <h1 className='header header--primary'>{this.state.profile.competitive.rank}</h1>
            </div>
            <div>
              <h1 className='header header--primary'>Level:</h1>
              <h1 className='header header--primary'>{this.state.profile.level}</h1>
            </div>
            <div>
              <h1 className='header header--primary'>Playtime:</h1>
              <h1 className='header header--primary'>{this.state.profile.playtime.competitive}</h1>
            </div>
            <div>
              <h1 className='header header--primary'>Top hero:</h1>
              <h1 className='header header--primary'>{this.state.stats.top_heroes.competitive[0].hero}</h1>
            </div>
            <div>
              <h1 className='header header--primary'>Healing:</h1>
              <h1 className='header header--primary'>{this.state.stats.assists.competitive[0].value}</h1>
            </div>
            <div>
              <h1 className='header header--primary'>Damage:</h1>
              <h1 className='header header--primary'>{this.state.stats.combat.competitive[3].value}</h1>
            </div>
            <div>
              <h1 className='header header--primary'>Elims:</h1>
              <h1 className='header header--primary'>{this.state.stats.combat.competitive[9].value}</h1>
            </div>
          </div>}
      </div>
    )
  }
}

export default MainContent
