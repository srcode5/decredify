import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css';
//1. import from react-redux and redux
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {rootReducer} from './reducers';
//2. create user reducer function

//3. combine multiple reducers

//4. create redux store
const store = createStore(rootReducer, composeWithDevTools());
//5. provide redux sore to the entire app

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>

      <App />
    </Provider>
    
  </React.StrictMode>,
  document.getElementById('root')
);
