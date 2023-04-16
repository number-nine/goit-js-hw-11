import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';

// 35449391-877499d7e02cc8d7dbb493e51

const requestParameters = {
  key: '35449391-877499d7e02cc8d7dbb493e51',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};


getPictures();

async function getPictures() {
  const response = await axios.get(
    `https://pixabay.com/api/?q=cat&${makeQueryString()}`
  );
  console.log(response);
}

function makeQueryString() {
    return Object.entries(requestParameters)
      .map(([key, value]) => {
        return `${key}=${value}`;
      })
      .join('&');
  }
