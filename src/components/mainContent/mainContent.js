import './mainContent.css'

import React, { Component } from 'react'

import { connect } from 'react-redux'
import { newProfile } from '../../actions/addProfile'

// import winLossChart from '../winLossChart/winLossChart'

class MainContent extends Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    // Get profile
    window.fetch('http://ow-api.herokuapp.com/profile/pc/us/cupchip-2806').then(response => {
      response.json().then(data => {
        console.log('profile data: ', data)
        this.setState({ profile: data })
      })
    })

    // Get stats
    window.fetch('http://ow-api.herokuapp.com/stats/pc/us/cupchip-2806').then(response => {
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
          <div className='grid'>
            <div className='grid__tile grid__tile--featured'>
              <h1 className='header header--primary'>Name:</h1>
              <h1 className='header header--secondary'>{this.state.profile.username}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Rank:</h1>
              <h1 className='header header--secondary'>{this.state.profile.competitive.rank}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Level:</h1>
              <h1 className='header header--secondary'>{this.state.profile.level}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Playtime:</h1>
              <h1 className='header header--secondary'>{this.state.profile.playtime.competitive}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Top hero:</h1>
              <h1 className='header header--secondary'>{this.state.stats.top_heroes.competitive[0].hero}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Healing:</h1>
              <h1 className='header header--secondary'>{this.state.stats.assists.competitive[0].value}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Damage:</h1>
              <h1 className='header header--secondary'>{this.state.stats.combat.competitive[3].value}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Elims:</h1>
              <h1 className='header header--secondary'>{this.state.stats.combat.competitive[9].value}</h1>
            </div>
            <div className='grid__tile center icon-wrapper'>
              <i className='fa fa-cog icon icon--setup' />
            </div>
          </div>}
      </div>
    )
  }
}

export default MainContent

// <div className='grid__tile'>
//   <h1 className='header header--primary'>Win/loss:</h1>
//   <div className='center'>
//     <canvas id='winLossChart' />
//   </div>
// </div>
