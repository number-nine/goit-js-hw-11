import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PicturesApiController from './js/request-controller';
import photoCardTmpl from './templates/photo-card.pug';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreButton: document.querySelector('.load-more'),
  galleryContainer: document.querySelector('.gallery'),
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
  picturesApiController.initNewSearch(query);
  picturesApiController
    .getPictures()
    .then(({ hits, totalHits }) => {
      (hits.length>0) && Notify.info(`Hooray! We found ${totalHits} images.`);
      renderPicturesMarkup(hits, totalHits);
    })
    .catch(error => {
      Notify.failure(error.message);
    });
}

function resetGalleryMarkup() {
  refs.galleryContainer.innerHTML = '';
}

function onLoadMore() {
  picturesApiController
    .getPictures()
    .then(({ hits, totalHits }) => {
      renderPicturesMarkup(hits, totalHits);
    })
    .catch(error => {
      Notify.failure(error.message);
    });
}

function sanitizeQuery(crudeQuery) {
  return crudeQuery.trim();
}

function renderPicturesMarkup(hits, totalHits) {
  console.log(totalHits);
  refs.galleryContainer.insertAdjacentHTML('beforeend', photoCardTmpl(hits));
  if (picturesApiController.hits >= totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}
