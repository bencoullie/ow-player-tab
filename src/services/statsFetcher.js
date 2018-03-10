export default function fetchProfile (battleTag) {
  const apiRequestString = `http://ow-api.herokuapp.com/stats/pc/us/${battleTag}`

  return window.fetch(apiRequestString).then(response => {
    return response.json().then(stats => stats.stats)
  })
}
