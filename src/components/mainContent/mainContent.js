import './mainContent.css'

import React, { Component } from 'react'

import AccountModal from '../accountModal/accountModal'
import { Progress } from 'reactstrap'
import { Tooltip } from 'react-tippy'
import errorAnimation from '../../images/dva-error.gif'
import fetchProfile from '../../services/profileFetcher'
import fetchStats from '../../services/statsFetcher'
import getTimeInMinutesFromString from '../../helpers/getTimeInMinutesFromString'
import importImageFolder from '../../helpers/importImageFolder'
import loadingAnimation from '../../images/ow-loader.gif'
import restartApp from '../../helpers/restartApp'
import stripCommasFromNumbers from '../../helpers/stripCommasFromNumbers'

class MainContent extends Component {
  constructor () {
    super()

    this.state = {
      modalIsOpen: false,
      apiError: false
    }

    this.addonStorage = window.chrome.storage

    this.heroIcons = importImageFolder(require.context('../../images/hero-icons', false, /\.(png|jpe?g|svg)$/))
  }

  /**
   * Remove's the loader from the dom
   */
  removeLoaderFromDom = () => {
    window.setTimeout(() => {
      const loaderWrapper = document.querySelector('.loader')

      if (loaderWrapper) {
        document.querySelector('.background').removeChild(loaderWrapper)
      }
    }, 1000)
  }

  /**
   * Clears data then requests and saves new data
   */
  changeAccount = async battleTag => {
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
    let profile
    let stats
    try {
      profile = await fetchProfile(battleTag)
      stats = await fetchStats(battleTag)
      console.log('profile', profile)
      console.log('stats', stats)
    } catch (err) {
      this.setState({
        apiError: true,
        errorType: err
      })
    }

    if (!this.state.apiError) {
      // Don't try hydrate the page
      if (profile.private) {
        this.setState({
          isPrivateProfile: true
        })

        return
      }

      // Grab the parts of the profile and stats we want
      const username = profile.username
      const rank = profile.competitive.rank
      const level = profile.level
      const playTime = profile.playtime.competitive
      const healing = stats.assists.competitive.find(stat => stat.title === 'Healing Done').value
      const heroDamage = stats.combat.competitive.find(stat => stat.title === 'Hero Damage Done').value

      // Win loss ratio
      const gamesPlayed = stats.game.competitive.find(stat => stat.title === 'Games Played').value
      const gamesTied = stats.game.competitive.find(stat => stat.title === 'Games Tied')
        ? stats.game.competitive.find(stat => stat.title === 'Games Tied').value
        : 0
      const gamesWon = stats.game.competitive.find(stat => stat.title === 'Games Won').value
      const winLoss = Math.round(gamesWon / (gamesPlayed - gamesTied) * 100)

      // Kill per death
      const eliminations = stripCommasFromNumbers(
        stats.combat.competitive.find(stat => stat.title === 'Eliminations').value
      )
      const deaths = stripCommasFromNumbers(stats.combat.competitive.find(stat => stat.title === 'Deaths').value)
      const totalOfKillsAndDeaths = eliminations + deaths
      const killPerDeath = (eliminations / deaths).toFixed(1)
      const killVsDeathRatio = Math.round(eliminations / totalOfKillsAndDeaths * 100)

      // Kill per assist
      const defensiveAssists = stripCommasFromNumbers(
        stats.assists.competitive.find(stat => stat.title === 'Defensive Assists').value
      )
      const offensiveAssists = stripCommasFromNumbers(
        stats.assists.competitive.find(stat => stat.title === 'Offensive Assists').value
      )
      const totalAssists = defensiveAssists + offensiveAssists
      let killVsAssistsRatio
      let killVsAssistTitle
      if (eliminations >= totalAssists) {
        killVsAssistTitle = 'Kill vs Assist'
        killVsAssistsRatio = Math.round(eliminations / (eliminations + totalAssists) * 100)
      } else {
        killVsAssistTitle = 'Assist vs Kill'
        killVsAssistsRatio = Math.round(totalAssists / (eliminations + totalAssists) * 100)
      }

      // Healing vs damage ratio
      let greaterOfHealingVsDamage
      let healingVsDamageTitle
      let healingNumber = stripCommasFromNumbers(healing)
      let damageNumber = stripCommasFromNumbers(heroDamage)
      let totalOfHealingAndDamage = healingNumber + damageNumber
      if (damageNumber >= healingNumber) {
        healingVsDamageTitle = 'Damage vs Healing'
        greaterOfHealingVsDamage = Math.round(damageNumber / totalOfHealingAndDamage * 100)
      } else {
        healingVsDamageTitle = 'Healing vs Damage'
        greaterOfHealingVsDamage = Math.round(healingNumber / totalOfHealingAndDamage * 100)
      }

      // Top hero calculator
      let topHero
      const arrOfWeightedHeroScores = []
      try {
        stats.top_heroes.competitive.win_rate.forEach(winRateHero => {
          const heroName = winRateHero.hero
          const winRateForHero = winRateHero.win_rate

          const timePlayedAsHeroString = stats.top_heroes.competitive.played.find(
            playedHero => playedHero.hero === heroName
          ).played

          const timePlayedAsHeroInMinutes = getTimeInMinutesFromString(timePlayedAsHeroString)
          const timePlayedInMinutes = getTimeInMinutesFromString(playTime)
          const numericWinRateForHero = parseFloat(winRateForHero) / 100.0
          const portionOfTotalTimeAsHero = timePlayedAsHeroInMinutes / timePlayedInMinutes
          const weightedHeroScore = portionOfTotalTimeAsHero * numericWinRateForHero

          const statsForHero = {
            heroName,
            weightedHeroScore
          }

          arrOfWeightedHeroScores.push(statsForHero)
        })

        const topWeightedScore = Math.max.apply(Math, arrOfWeightedHeroScores.map(hero => hero.weightedHeroScore))
        topHero = arrOfWeightedHeroScores.find(hero => hero.weightedHeroScore === topWeightedScore).heroName
      } catch (err) {
        topHero = stats.top_heroes.competitive.win_rate[0].hero
      }

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
          winLoss,
          killPerDeath,
          killVsDeathRatio,
          killVsAssistsRatio,
          greaterOfHealingVsDamage,
          healingVsDamageTitle,
          killVsAssistTitle
        }
      })

      console.log('this.state.player', this.state.player)
    }
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

  openModal = () => {
    this.setState({
      modalIsOpen: true
    })
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
          // Open the modal to get a battletag from the user
          this.openModal()
        } else {
          this.fetchAndSavePlayerData(battleTag)
        }
      })
    }
  }

  /**
   * Render the component!
   */
  render () {
    const isErrored = this.state.apiError
    const isPrivate = this.state.isPrivateProfile

    const ready = this.state && this.state.player
    const shouldRemoveLoader = ready || isErrored || isPrivate

    ready && this.loadInGridTiles()
    shouldRemoveLoader && this.removeLoaderFromDom()

    return (
      <div className={'background ' + (ready || isErrored ? 'background--loaded' : 'background--loading')}>
        <div className='loader center-inner-element'>
          <img
            src={loadingAnimation}
            className={'loader__image ' + (ready || isErrored ? 'loader__image--loaded' : 'loader__image--loading')}
            alt='loading animation'
          />
        </div>

        {isErrored &&
          <div className='error center-inner-element'>
            <Tooltip
              open='true'
              theme='light'
              title='Suh fam 👋 Looks like something went wrong while trying to grab your stats. Please try again later.'
            >
              <img src={errorAnimation} className={'error__image'} alt='error animation' />
            </Tooltip>
          </div>}

        {isPrivate &&
          <div className='error center-inner-element'>
            <Tooltip
              open='true'
              theme='light'
              title="Suh fam 👋 Looks like the profile you entered is set to private. If it's yours, please open Overwatch and go: Options &gt; Social &gt; Career Profile Visibility &gt; Public."
            >
              <img src={errorAnimation} className={'error__image'} alt='error animation' />
            </Tooltip>
          </div>}

        {!isErrored &&
          ready &&
          <div className='grid'>
            <div className='grid__tile grid__tile--wide'>
              <h1 className='header header--primary inline-text'>Name:</h1>
              <h1 className='header header--secondary inline-text'>
                {this.state.player.username}
              </h1>
            </div>
            <div className='grid__tile'>
              <h1 className='header header--primary inline-text'>Rank:</h1>
              <h1 className='header header--secondary inline-text'>
                {this.state.player.rank || 'Unplaced'}
              </h1>
            </div>
            <Tooltip title='Useful as an indicator of in-game experience.'>
              <div className='grid__tile'>
                <h1 className='header header--primary inline-text'>Level:</h1>
                <h1 className='header header--secondary inline-text'>{this.state.player.level}</h1>
              </div>
            </Tooltip>
            <div className='grid__tile grid__tile--featured'>
              <h1 className='header header--primary'>Stats:</h1>
              <div>
                <h1 className='header header--secondary mt-4'>Win vs Loss:</h1>
                <Progress multi>
                  <Progress bar color='success' value={this.state.player.winLoss}>
                    {this.state.player.winLoss}%
                  </Progress>
                  <Progress bar color='warning' value={100 - this.state.player.winLoss} />
                </Progress>

                <h1 className='header header--secondary mt-4'>Kill vs Death:</h1>
                <Progress multi>
                  <Progress bar color='success' value={this.state.player.killVsDeathRatio}>
                    {this.state.player.killVsDeathRatio}%
                  </Progress>
                  <Progress bar color='warning' value={100 - this.state.player.killVsDeathRatio} />
                </Progress>

                <h1 className='header header--secondary mt-4'>{this.state.player.killVsAssistTitle}</h1>
                <Progress multi>
                  <Progress bar color='success' value={this.state.player.killVsAssistsRatio}>
                    {this.state.player.killVsAssistsRatio}%
                  </Progress>
                  <Progress bar color='warning' value={100 - this.state.player.killVsAssistsRatio} />
                </Progress>

                <h1 className='header header--secondary mt-4'>{this.state.player.healingVsDamageTitle}:</h1>
                <Progress multi>
                  <Progress bar color='success' value={this.state.player.greaterOfHealingVsDamage}>
                    {this.state.player.greaterOfHealingVsDamage}%
                  </Progress>
                  <Progress bar color='warning' value={100 - this.state.player.greaterOfHealingVsDamage} />
                </Progress>
              </div>
            </div>
            <Tooltip title='Stats on page are for current competitive season only.'>
              <div className='grid__tile'>
                <h1 className='header header--primary'>Mode:</h1>
                <h1 className='header header--secondary'>
                  Competitive
                </h1>
              </div>
            </Tooltip>
            <Tooltip title='Kills Per Death.'>
              <div className='grid__tile'>
                <h1 className='header header--primary'>KPD:</h1>
                <h1 className='header header--secondary'>
                  {this.state.player.killPerDeath}
                </h1>
              </div>
            </Tooltip>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Playtime:</h1>
              <h1 className='header header--secondary'>{this.state.player.playTime}</h1>
            </div>
            <Tooltip title='Calculated primarily by win rate.'>
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
            </Tooltip>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Healing:</h1>
              <h1 className='header header--secondary'>{this.state.player.healing}</h1>
            </div>
            <Tooltip title="Hero damage. Rein's shield doesn't count mate.">
              <div className='grid__tile'>
                <h1 className='header header--primary'>Damage:</h1>
                <h1 className='header header--secondary'>{this.state.player.heroDamage}</h1>
              </div>
            </Tooltip>
            <div className='grid__tile'>
              <h1 className='header header--primary'>Eliminations:</h1>
              <h1 className='header header--secondary'>{this.state.player.eliminations}</h1>
            </div>
            <Tooltip title='Settings.'>
              <div className='grid__tile center-inner-element icon-wrapper js--config-box' onClick={this.openModal}>
                <i className='fa fa-cog icon icon--setup' />
              </div>
            </Tooltip>
          </div>}

        <AccountModal changeAccount={this.changeAccount} modalIsOpen={this.state.modalIsOpen} />
      </div>
    )
  }
}

export default MainContent
// import setPlayer from '../../actions/setPlayer'
// import { connect } from 'react-redux'
//
// this.setPlayer({
//   username,
//   rank,
//   level,
//   playTime,
//   healing,
//   heroDamage,
//   eliminations,
//   topHero,
//   winLoss,
//   killPerDeath
// })
//
// const mapStateToProps = state => {
//   return {
//     player: state.player
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     setPlayer: newPlayer => dispatch(setPlayer(newPlayer))
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(MainContent)
