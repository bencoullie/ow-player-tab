import { createStore } from 'redux'
import rootReducer from './reducers'

export default () => {
  console.log('happening!')
  return createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
}
