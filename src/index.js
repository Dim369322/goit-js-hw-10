import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce' ;
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchCountryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchCountryInput.addEventListener('input', debounce((e) => {
    e.preventDefault();
    const searchValue = e.target.value.trim();
  
    if(searchValue){
      fetchCountries(searchValue)
      .then(takeCountries)
      .catch(notifyOnError);
    }
    resetCountry();
   
}, DEBOUNCE_DELAY));

function takeCountries(values){
    if (values.length > 10){
       return Notify.info('Too many matches found. Please enter a more specific name');
    }
    createElements(values);
}

function notifyOnError(){
  return Notify.failure('Oops, there is no country with that name');
}

function resetCountry(){
  countryList.innerHTML = "";
  countryInfo.innerHTML = "";
}

function createElements(values){
  const countryValues = values.map(value => {
    countryList.insertAdjacentHTML("beforeend", `<li class="country-name">
    <img class="country-img" src="${value.flags.svg}" alt="${value.name.common}" width="30" height="30">${value.name.common}
    </li>`);
    if(values.length === 1){
      const valuesLang = Object.values(value.languages);
      countryInfo.insertAdjacentHTML("beforeend", `<p class="country-info">Capital: <span class="country-info__value">${value.capital}</span></p>
      <p class="country-info">Popultion: <span class="country-info__value">${value.population}</span></p>
      <p class="country-info">Languages: <span class="country-info__value">${valuesLang}</span></p>`);
  }
  });
  return countryValues;
}