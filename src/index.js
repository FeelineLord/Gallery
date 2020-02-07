import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Gallery from './Gallery';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <BrowserRouter
    basename={process.env.PUBLIC_URL}>
    <Gallery />
  </BrowserRouter>, 
document.getElementById('root'));

serviceWorker.unregister();
