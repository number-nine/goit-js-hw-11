import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import { fillHTML, clearOutputElements } from './js/html-filler';

import 'notiflix/dist/notiflix-3.2.6.min.css';


const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');

searchEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();
  clearOutputElements();
  const query = purifyQuery(e.target.value);

  if (query === '') {
    Notify.failure("Search field can't be empty");
    return;
  }

  fetchCountries(query)
    .then(fillHTML)
    .catch(alert => {
      Notify.failure(alert.message);
    });
}

function purifyQuery(crudeQuery) {
  return crudeQuery.trim();
}
