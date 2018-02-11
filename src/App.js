import './App.css'

import React, { Component } from 'react'

import GameTab from './components/gameTab/gameTab'

class App extends Component {
  render () {
    return (
      <div className='app-wrapper'>
        <GameTab />
      </div>
    )
  }
}

export default App
