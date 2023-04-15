import countryInfo from '../pug-templates/country-info.pug';
import countryList from '../pug-templates/country-list.pug';

const refs = {
  countryInfoEl: document.querySelector('.country-info'),
  countryListEl: document.querySelector('.country-list'),
};

function fillHTML(countries) {
  if (countries.length === 1) {
    appendCountryInfo(refs.countryInfoEl, countries[0]);
  } else {
    appendCountryList(refs.countryListEl, countries);
  }
}

function clearOutputElements() {
  Object.values(refs).map(element => (element.innerHTML = ''));
}

function appendCountryInfo(element, country) {
  element.innerHTML = countryInfo(country);
}

function appendCountryList(element, countries) {
  element.innerHTML = countryList(countries);
}

export { fillHTML, clearOutputElements };
