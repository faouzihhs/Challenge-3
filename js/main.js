// Set api token for mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZm9vc2llMTIiLCJhIjoiY2s5Mms0NmJ0MDJhaDNxbXZjaWtoejRvYyJ9.HDqPlXesr3XSrA1AAtYcsQ';

// api token for openWeatherMap
let openWeatherMapApiKey = '551b6c3533dace025e6e2c5bc974a52f';

// Initiate map
let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [5.508852, 52.142480],
  zoom: 7
});

// zoek balk toevoegen (geocoder)
let geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  types: 'country'
});

// is ontzichtbaar maar wordt toegevoegd aan de wrapper
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


let input = document.getElementById('search');

// een event listener word toegoegvd hiermee aan de search input
input.addEventListener('keydown', function (event) {
  // if enter is hit, search the term, set the details of the country and the temperature
  if (event.key === "Enter") {
    let country = input.value.trim();
    // search the term that we entered in the input search box
    geocoder.query(country);
    // set the details of the country
    setDetails(country);
    // set the details of the country
    setWeather(country);
  }
});

// populatie word weergeven met numbers en commas er tussen
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// hier kan je de details van een land aanpassen
function setDetails(country){
  let url = 'https://restcountries.eu/rest/v2/name/' + country + '?fields=name;capital;population;languages;currencies';
  fetch(url)
      .then((response) => {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let country = document.getElementById('country');
        let capital = document.getElementById('capital');
        let population = document.getElementById('population');
        let language = document.getElementById('language');
        let currency = document.getElementById('currency');

        country.innerText = data[0]['name'];
        capital.innerText = data[0]['capital'];
        population.innerText = numberWithCommas(data[0]['population']);
        language.innerText = data[0]['languages'][0]['name'];
        currency.innerText = data[0]['currencies'][0]['name'];

      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
}

// hier kan je het weer aanpassen : temperatuur + icon
function setWeather(country) {
  let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + country + '&appid=' + openWeatherMapApiKey + '&units=metric';
  fetch(url)
      .then((response) => {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        let responseData = data;
        let c = '°C';
        let temp = document.getElementById('temp');
        let icon = document.getElementById('icon');

        temp.innerText = responseData.main.temp + c;
        icon.src = 'http://openweathermap.org/img/w/' + responseData.weather[0].icon + '.png';

      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
}
