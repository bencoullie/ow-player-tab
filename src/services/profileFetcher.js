export default function fetchProfile (battleTag) {
  const apiRequestString = `http://ow-api.herokuapp.com/profile/pc/us/${battleTag}`

  return window.fetch(apiRequestString).then(response => {
    return response.json().then(profile => profile)
  })
}
