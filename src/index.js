import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PicturesApiController from './js/request-controller';
import InterfaceController from './js/interface-controller';

import 'notiflix/dist/notiflix-3.2.6.min.css';
import 'font-awesome/css/font-awesome.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreButton: document.querySelector('.load-more'),
};

const picturesApiController = new PicturesApiController();
const interfaceController = new InterfaceController();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreButton.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();

  const query = sanitizeQuery(event.target.elements.searchQuery.value);

  if (query === '') {
    Notify.failure("Search field can't be empty");
    return;
  }

  interfaceController.initInterfaceOnNewSearch();

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
        interfaceController.renderPicturesMarkup(
          hits,
          totalHits,
          picturesApiController.hits
        );
      }
    })
    .catch(error => {
      Notify.failure(error.message);
    })
    .finally(() => {
      interfaceController.enableSearchButtons();
    });
}

function onLoadMore() {
  interfaceController.disableSearchButtons();
  picturesApiController
    .getPictures()
    .then(({ hits, totalHits }) => {
      interfaceController.renderPicturesMarkup(hits, totalHits);
    })
    .catch(error => {
      Notify.failure(error.message);
    })
    .finally(() => {
      interfaceController.enableSearchButtons();
      scrollOnLoadMore();
    });
}

function sanitizeQuery(crudeQuery) {
  return crudeQuery.trim();
}

function scrollOnLoadMore() {
  const { height: cardHeight } = document
    .querySelector('.photo-card')
    .getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.5,
    behavior: 'smooth',
  });
}
