import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import App from './App';

// 当前执行的环境
const isDev = process.env.NODE_ENV === 'development';
const Root = document.querySelector('#root');
const render = (Comment) => {
  if (isDev) {
    ReactDom.render(
      <AppContainer>
        <Comment />
      </AppContainer>,
      Root,
    );
  } else {
    ReactDom.hydrate(
      <AppContainer>
        <Comment />
      </AppContainer>,
      Root,
    );
  }
};


render(App);

if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    const NextApp = require('./App.jsx').default; // eslint-disable-line
    render(NextApp);
  });
}
