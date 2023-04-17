import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PicturesApiController from './js/request-controller';
import photoCardTmpl from './templates/photo-card.pug';

import 'notiflix/dist/notiflix-3.2.6.min.css';
import 'font-awesome/css/font-awesome.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreButton: document.querySelector('.load-more'),
  galleryContainer: document.querySelector('.gallery'),
  searchButtons: document.querySelectorAll('.search-button'),
};

const picturesApiController = new PicturesApiController();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  const query = sanitizeQuery(event.target.elements.searchQuery.value);

  if (query === '') {
    Notify.failure("Search field can't be empty");
    return;
  }
  
  resetGalleryMarkup();
  hideLoadMoreButton();
  disableSearchButtons(refs.searchButtons);

  picturesApiController.initNewSearch(query);
  picturesApiController
    .getPictures()
    .then(({ hits, totalHits }) => {
      if (hits.length === 0) {
        Notify.failure(
          `Sorry, there are no images matching your search query. Please try again.`
        );
        return;
      }
      if (hits.length > 0) {
        Notify.info(`Hooray! We found ${totalHits} images.`);
        renderPicturesMarkup(hits, totalHits);
      }
    })
    .catch(error => {
      Notify.failure(error.message);
    })
    .finally(() => {
      enableSearchButtons(refs.searchButtons);
    });
}

function onLoadMore() {
  disableSearchButtons(refs.searchButtons);
  picturesApiController
    .getPictures()
    .then(({ hits, totalHits }) => {
      renderPicturesMarkup(hits, totalHits);
    })
    .catch(error => {
      Notify.failure(error.message);
    })
    .finally(() => {
      enableSearchButtons(refs.searchButtons);
    });
}

function sanitizeQuery(crudeQuery) {
  return crudeQuery.trim();
}

function resetGalleryMarkup() {
  refs.galleryContainer.innerHTML = '';
}

function renderPicturesMarkup(hits, totalHits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', photoCardTmpl(hits));
  if (picturesApiController.hits >= totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    hideLoadMoreButton();
    return;
  }
  showLoadMoreButton();
}

function hideLoadMoreButton() {
  const classList = refs.loadMoreButton.classList;
  classList.contains('search-button--hidden') ||
    classList.add('search-button--hidden');
}

function showLoadMoreButton() {
  const classList = refs.loadMoreButton.classList;
  classList.contains('search-button--hidden') &&
    classList.remove('search-button--hidden');
}

function disableSearchButtons(elements) {
  elements.forEach(element => {
    element.disabled = true;
    element.classList.add('search-button--disabled');
    element.firstElementChild.classList.remove('search-button__icon--hidden');
  });
}

function enableSearchButtons(elements) {
  elements.forEach(element => {
    element.disabled = false;
    element.classList.remove('search-button--disabled');
    element.firstElementChild.classList.add('search-button__icon--hidden');
  });
}
