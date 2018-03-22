import './mainContent.css'

import React, { Component } from 'react'

// import { connect } from 'react-redux'
import fetchProfile from '../../services/profileFetcher'
import fetchStats from '../../services/statsFetcher'
import loadingAnimation from '../../images/ow-loader.gif'

// import { newProfile } from '../../actions/addProfile'

// import winLossChart from '../winLossChart/winLossChart'

class MainContent extends Component {
  constructor () {
    super()
    this.state = {}
    this.addonStorage = window.chrome.storage
  }

  removeLoaderFromDom = () => {
    window.setTimeout(() => {
      const loaderWrapper = document.querySelector('.loader')
      document.querySelector('.background').removeChild(loaderWrapper)
    }, 1000)
  }

  changeAccount = async () => {
    // Get new battletag from user
    let battleTag = prompt("So you're ready for a change? What's the new BattleTag?")

    this.fetchAndSavePlayerData(battleTag)
  }

  fetchAndSavePlayerData = async battleTag => {
    // Get data with given battleTag
    const profile = await fetchProfile(battleTag)
    const stats = await fetchStats(battleTag)

    // Set the assosciated profile to local component state
    this.setState({ profile: profile })
    this.setState({ stats: stats })
  }

  loadInGridTiles = () => {
    window.setTimeout(() => {
      const tiles = document.getElementsByClassName('grid__tile')

      let secondsToDelay = 1
      Array.prototype.forEach.call(tiles, (tile, i) => {
        secondsToDelay += i
        window.setTimeout(() => {
          tile.classList.add('fade-in')
        }, secondsToDelay * 1000 / 100)
      })
    }, 100)
  }

  componentDidMount () {
    const hasAddonStorage = Boolean(this.addonStorage)

    if (hasAddonStorage) {
      this.addonStorage.sync.get('battleTag', async resultObject => {
        let battleTag = resultObject.battleTag
        const userHasSavedbattleTag = Boolean(battleTag)

        // If the user has not saved a battle tag before
        if (!userHasSavedbattleTag) {
          // Get new battletag from user
          battleTag = prompt('What BattleTag inspires fear among your enemies?')

          // And persist it in chrome addon storage
          await this.addonStorage.sync.set({ battleTag: battleTag })
        }

        this.fetchAndSavePlayerData(battleTag)
      })
    }
  }

  render () {
    const ready = this.state && this.state.profile && this.state.stats

    ready && this.removeLoaderFromDom()
    ready && this.loadInGridTiles()

    return (
      <div className={'background ' + (!ready ? 'background--loading' : 'background--loaded')}>
        <div className='loader center-inner-element'>
          <img
            src={loadingAnimation}
            className={'loader__image ' + (!ready ? 'loader__image--loading' : 'loader__image--loaded')}
            alt='loading animation'
          />
        </div>

        {ready &&
          <div className='grid'>
            <div className='grid__tile grid__tile--featured'>
              <h1 className='header header--primary'>Name:</h1>
              <h1 className='header header--secondary'>{this.state.profile.username}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Rank:</h1>
              <h1 className='header header--secondary'>
                {this.state.profile.competitive.rank || 'Still qualifying!'}
              </h1>
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
              <h1 className='header header--secondary'>{this.state.stats.combat.competitive[2].value}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Elims:</h1>
              <h1 className='header header--secondary'>{this.state.stats.combat.competitive[8].value}</h1>
            </div>
            <div className='grid__tile center-inner-element icon-wrapper js--config-box' onClick={this.changeAccount}>
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
