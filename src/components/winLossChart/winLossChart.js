import Chart from 'chart.js'

export default data => {
  var ctx = document.getElementById('myChart')
  var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          // data: [data.stats.game.competitive[2], data.stats.game.competitive.wins[3].value],
          data: [data.stats.game.competitive[2].value, data.stats.game.competitive[3].value],
          backgroundColor: ['rgba(250,160,46, 1)', 'rgba(88,79,74, 1)']
        }
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ['Wins', 'Losses']
    },
    options: {
      'animation.animateScale': true
    }
  })
}
