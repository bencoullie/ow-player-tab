import Chart from 'chart.js'

export default data => {
  const ctx = document.getElementById('winLossChart')

  const massagedData = {
    ...data,
    ...{label: 'W/L'},
    ...{xAxisID: ''},
    ...{yAxisID: ''}
  }

  const options = {
    'animation.animateScale': true
  }

  const myBarChart = new Chart(ctx, {
    type: 'horizontalBar',
    massagedData,
    options
  });

  // import winLossChart from '../winLossChart/winLossChart'

  // winLossChart(chartData.winLoss)

  // <div className='grid__tile grid__tile--featured'>
  //   <h1 className='header header--primary'>Win Loss:</h1>
  //   <h1 className='header header--secondary'></h1>
  //   <div className='center'>
  //     <canvas id='winLossChart' />
  //   </div>
  // </div>


  // const myDoughnutChart = new Chart(ctx, {
  //   type: 'doughnut',
  //   data: {
  //     datasets: [
  //       {
  //         // data: [data.stats.game.competitive[2], data.stats.game.competitive.wins[3].value],
  //         data: [data.stats.game.competitive[2].value, data.stats.game.competitive[3].value],
  //         backgroundColor: ['rgba(250,160,46, 1)', 'rgba(88,79,74, 1)']
  //       }
  //     ],

  //     // These labels appear in the legend and in the tooltips when hovering different arcs
  //     labels: ['Wins', 'Losses']
  //   },
  //   options: {
  //     'animation.animateScale': true
  //   }
  // })
}


