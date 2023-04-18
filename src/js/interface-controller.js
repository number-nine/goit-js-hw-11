import photoCardTmpl from '../templates/photo-card.pug';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

import 'notiflix/dist/notiflix-3.2.6.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

export default class InterfaceController {
  constructor() {
    this.refs = {
      galleryContainer: document.querySelector('.gallery'),
      searchButtons: document.querySelectorAll('.search-button'),
      loadMoreButton: document.querySelector('.load-more'),
      };
      
    this.simpleLightbox = new SimpleLightbox('.gallery .gallery__item', {
      sourceAttr: 'data-img',
    });
  }
  resetGalleryMarkup() {
    this.refs.galleryContainer.innerHTML = '';
  }

  renderPicturesMarkup(hits, totalHits, renderedHits) {
    this.refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      photoCardTmpl(hits)
      );
      this.simpleLightbox.refresh();

    if (renderedHits >= totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      this.hideLoadMoreButton();
      return;
    }
      this.showLoadMoreButton();

      
  }

  hideLoadMoreButton() {
    const classList = this.refs.loadMoreButton.classList;
    classList.contains('search-button--hidden') ||
      classList.add('search-button--hidden');
  }

  showLoadMoreButton() {
    const classList = this.refs.loadMoreButton.classList;
    classList.contains('search-button--hidden') &&
      classList.remove('search-button--hidden');
  }

  disableSearchButtons() {
    this.refs.searchButtons.forEach(element => {
      element.disabled = true;
      element.classList.add('search-button--disabled');
      element.firstElementChild.classList.remove('search-button__icon--hidden');
    });
  }

  enableSearchButtons() {
    this.refs.searchButtons.forEach(element => {
      element.disabled = false;
      element.classList.remove('search-button--disabled');
      element.firstElementChild.classList.add('search-button__icon--hidden');
    });
  }

  initInterfaceOnNewSearch() {
    this.resetGalleryMarkup();
    this.hideLoadMoreButton();
    this.disableSearchButtons();
  }
}
