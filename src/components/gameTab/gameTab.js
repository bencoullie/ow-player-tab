import React, { Component } from 'react'

// import LoadScreen from './loadScreen'
import MainContent from '../mainContent/mainContent'

class GameTab extends Component {
  // {ready ? <MainContent /> : <LoadScreen/>}
  render () {
    return <MainContent />
  }
}

export default GameTab

// <div>
// <div>
//   <h1>{this.state.profile.username}</h1>
//   <h1>Time in Comp: {this.state.profile.playtime.competitive}</h1>
//   <img src={this.state.profile.competitive.rank_img} alt='current rank' />
// </div>
// <div className='chart-grid-container'>
//   <canvas id='myChart' className='chart-grid-child' />
//   <div className='chart-grid-child b'>B</div>
//   <div className='chart-grid-child c'>C</div>
//   <div className='chart-grid-child d'>D</div>
// </div>
// </div>
