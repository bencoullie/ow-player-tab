import { SET_PLAYER } from '../actions/setPlayer'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PLAYER:
      return action.payload

    default:
      return state
  }
}
