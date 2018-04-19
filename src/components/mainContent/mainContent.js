import './mainContent.css'

import React, { Component } from 'react'

import { Progress } from 'reactstrap'
// import { connect } from 'react-redux'
import fetchProfile from '../../services/profileFetcher'
import fetchStats from '../../services/statsFetcher'
import importImageFolder from '../../helpers/importImageFolder'
import loadingAnimation from '../../images/ow-loader.gif'
import restartApp from '../../helpers/restartApp'

// import { newProfile } from '../../actions/addProfile'

class MainContent extends Component {
  constructor () {
    super()

    this.state = {}
    this.addonStorage = window.chrome.storage
    this.heroIcons = importImageFolder(require.context('../../images/hero-icons', false, /\.(png|jpe?g|svg)$/))
  }

  /**
   * Remove's the loader from the dom
   */
  removeLoaderFromDom = () => {
    window.setTimeout(() => {
      const loaderWrapper = document.querySelector('.loader')
      document.querySelector('.background').removeChild(loaderWrapper)
    }, 1000)
  }

  /**
   * Requests new battle tag, clears data then requests and saves new data
   */
  changeAccount = async () => {
    // Get new battletag from user
    let battleTag = prompt("So you're ready for a change? What's the new BattleTag?")

    // Clear the previous data from chrome storage
    this.clearPlayerData()

    // Grab player and save to both chrome storage and component state
    this.fetchAndSavePlayerData(battleTag, true)
  }

  /**
   * Clears all data saved in chrome storage
   */
  clearPlayerData = async () => {
    await this.addonStorage.sync.clear()
  }

  /**
   * Saves the given battleTag to chrome storage
   * Fetches data based on the given battleTag
   * Saves the data to component state
   *
   * @param {String} battleTag
   *        Required. The battleTag used to grab new player data (in the form of 'MyName-1234')
   *
   * @param {Boolean} restart
   *        Optional. Specify if you want the app to reload after battleTag is set
   */
  fetchAndSavePlayerData = async (battleTag, restart = false) => {
    // Save the new player tag to chrome storage
    await this.addonStorage.sync.set({ battleTag: battleTag })

    // Restart the app with the new battleTag
    if (restart) {
      restartApp()
    }

    // Get data with given battleTag
    const profile = await fetchProfile(battleTag)
    const stats = await fetchStats(battleTag)
    console.log('profile', profile)
    console.log('stats', stats)

    // Grab the parts of the profile and stats we want
    const username = profile.username
    const rank = profile.competitive.rank
    const level = profile.level
    const playTime = profile.playtime.competitive
    const healing = stats.assists.competitive.find(stat => stat.title === 'Healing Done').value
    const heroDamage = stats.combat.competitive.find(stat => stat.title === 'Hero Damage Done').value
    const eliminations = stats.combat.competitive.find(stat => stat.title === 'Eliminations').value
    const topHero = stats.top_heroes.competitive[0].hero

    // Win loss ratio
    const gamesPlayed = stats.game.competitive.find(stat => stat.title === 'Games Played').value
    const gamesWon = stats.game.competitive.find(stat => stat.title === 'Games Won').value
    const winLoss = Math.round(gamesWon / gamesPlayed * 100)
    console.log('winLoss', winLoss)

    // Set the associated player data to local component state
    this.setState({
      player: {
        username,
        rank,
        level,
        playTime,
        healing,
        heroDamage,
        eliminations,
        topHero,
        winLoss
      }
    })

    console.log('this.state.player', this.state.player)
  }

  /**
   * Fades in grid tiles by adding a class to all grid tiles
   * based on an exponentially incremental formula
   */
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

  /**
   * Occurs after component is loaded
   */
  componentDidMount () {
    const hasAddonStorage = Boolean(this.addonStorage)

    if (hasAddonStorage) {
      this.addonStorage.sync.get('battleTag', async resultObject => {
        let battleTag = resultObject.battleTag
        const userHasSavedBattleTag = Boolean(battleTag)

        // If the user has not saved a battle tag before
        if (!userHasSavedBattleTag) {
          // Get new battletag from user
          battleTag = prompt('What BattleTag inspires fear among your enemies?')
        }

        this.fetchAndSavePlayerData(battleTag)
      })
    }
  }

  /**
   * Render the component!
   */
  render () {
    const ready = this.state && this.state.player

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
            <div className='grid__tile grid__tile--wide'>
              <h1 className='header header--primary inline-text'>Name:</h1>
              <h1 className='header header--secondary inline-text'>
                {this.state.player.username}
              </h1>
            </div>
            <div className='grid__tile grid__tile--wide'>
              <h1 className='header header--primary inline-text'>Rank:</h1>
              <h1 className='header header--secondary inline-text'>
                {this.state.player.rank || 'Unplaced'}
              </h1>
            </div>
            <div className='grid__tile grid__tile--featured'>
              <h1 className='header header--primary'>Stats:</h1>
              <div>
                <Progress
                  color={this.state.player.winLoss > 50 ? 'success' : 'danger'}
                  value={this.state.player.winLoss}
                >{`${this.state.player.winLoss}%`}</Progress>
                <h1 className='header header--secondary'>Win/Loss:</h1>
              </div>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Something:</h1>
              <h1 className='header header--secondary'>
                Blah blah
              </h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Level:</h1>
              <h1 className='header header--secondary'>{this.state.player.level}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Playtime:</h1>
              <h1 className='header header--secondary'>{this.state.player.playTime}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Top hero:</h1>
              <div className='center-inner-element hero-icon-container'>
                <img
                  src={this.heroIcons[`${this.state.player.topHero.toLowerCase()}.png`]}
                  alt={`${this.state.player.topHero} spray`}
                  className='hero-icon-container__hero-icon'
                />
              </div>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Healing:</h1>
              <h1 className='header header--secondary'>{this.state.player.healing}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Hero damage:</h1>
              <h1 className='header header--secondary'>{this.state.player.heroDamage}</h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Eliminations:</h1>
              <h1 className='header header--secondary'>{this.state.player.eliminations}</h1>
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
