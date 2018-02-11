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
        this.setState({ stats: data })
        // winLossChart(data)
      })
    })
  }

  render () {
    const ready = this.state && this.state.profile && this.state.stats

    return (
      <div className='main-content-wrapper'>
        {ready &&
          <div>
            <div><h1>{this.state.profile.username}</h1></div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
          </div>}
      </div>
    )
  }
}

export default MainContent
