import './App.css'

import React, { Component } from 'react'

import GameTab from './components/gameTab/gameTab.js'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <GameTab />
      </div>
    )
  }
}

export default App
