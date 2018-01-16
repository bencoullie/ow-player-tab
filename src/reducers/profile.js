import { ADD_PROFILE } from '../actions/addProfile'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PROFILE:
      return [...state, action.payload]

    default:
      return state
  }
}
