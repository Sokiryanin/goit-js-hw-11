import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './refs';
import createCardMarkup from './card-markup';
import clearMarkup from './clear-gallery';
// import scroll from './scroll';
import fetchImg from './fetch';

let gallery = new SimpleLightbox('.gallery a');

export let page = 1;
let searchQuery = '';
let totalImg = 0;

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMore.addEventListener('click', onLoadMoreClick);

function onFormSubmit(event) {
  event.preventDefault();

  refs.loadMore.classList.add('is-hidden');
  clearMarkup();
  searchQuery = event.target.elements.searchQuery.value;
  if (!searchQuery) {
    clearMarkup();
    return;
  }
  resetPage();
  renderGallery(searchQuery);
}

function onLoadMoreClick() {
  page += 1;
  renderGallery(searchQuery);
}

async function renderGallery(query) {
  const response = await fetchImg(query);
  totalImg = response.data.totalHits;
  const data = await response.data.hits;
  if (page === 1 && data.length !== 0) {
    Notify.info(`Hooray! We found ${totalImg} images.`);
  }
  if (data.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  data.forEach(picture => {
    createCardMarkup(picture);
  });
  gallery.refresh();
  if (page > 1) {
    scroll();
  }
  refs.loadMore.classList.remove('is-hidden');
  if (totalImg <= refs.gallery.children.length) {
    refs.loadMore.classList.add('is-hidden');
    Notify.info(`We're sorry, but you've reached the end of search results.`);
  }
}

function resetPage() {
  page = 1;
}
