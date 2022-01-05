import API from '/fetchCountries';
import counterCard from '../src/templates/counterCard.hbs';
import counterAllCards from '../src/templates/counterAllCards.hbs';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();
  const input = e.target.value.trim();

  if (!input) return (refs.countryList.innerHTML = ''), (refs.countryInfo.innerHTML = '');
  API.fetchCountries(input).then(createMarkUpCountries).catch(onFetchError);
}

function createMarkUpCountries(country) {
  const markupList = counterAllCards(country);
  const markup = counterCard(country);
  refs.countryList.innerHTML = markupList;

  if (country.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    refs.countryList.innerHTML = '';
  } else if (country.length === 1) {
    refs.countryInfo.innerHTML = markup;
    refs.countryList.innerHTML = '';
  } else if (country.length >= 2 && country.length <= 10) {
    refs.countryInfo.innerHTML = '';
  }
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
