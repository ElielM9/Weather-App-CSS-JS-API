// Constantes
const FORM = document.querySelector(`#search-form`);
const MAIN__CONTAINER = document.querySelector(`#main`);

window.addEventListener(`load`, startApp);

// Función para iniciar la app
function startApp() {
  // Funcion de eventos
  eventListeners();
}

// Función para manejar eventos
function eventListeners() {
  FORM.addEventListener(`submit`, searchWeather);
}

// Función para buscar el clima
function searchWeather(e) {
  e.preventDefault();

  // Validar el formulario
  const CITY_NAME = document.querySelector(`#city-name`).value.trim();
  const SELECTED_COUNTRY = document.querySelector(`#country-name`).value;
  const STRING_VOID = ``;

  if (CITY_NAME === STRING_VOID || SELECTED_COUNTRY === STRING_VOID) {
    showError(`Por favor, ingrese un nombre de ciudad y país válidos.`);

    return;
  }

  // Mostrar el loader antes de consultar la API
  showLoader();

  // Consultar la API después de 3 segundos
  setTimeout(() => {
    consultApi(CITY_NAME, SELECTED_COUNTRY);
  }, 1500);
}

// Función para mostrar error
function showError(message) {
  const ERROR_MESSAGE = message;

  // Eliminar alerta anterior
  const previousAlert = document.querySelector(`.alert`);

  if (!previousAlert) {
    // Mostrar alertaj
    const alertDiv = document.createElement(`div`);
    alertDiv.textContent = ERROR_MESSAGE;
    alertDiv.classList.add(`alert`, `alert--error`);
    FORM.appendChild(alertDiv);

    // Eliminar alerta después de 3 segundos
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }
}

// Función para consultar la API
function consultApi(cityName, countryCode) {
  const API_KEY = `2d143467c2e890d28d6f09fbd953e757`;
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${API_KEY}`;

  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      // Limpiar HTML antes de mostrar resultados
      clearHTML();

      console.log(data);

      // Validar que los resultados existan
      if (data.cod === `404`) {
        showError(`Ciudad no encontrada`);

        return;
      }

      // Mostrar resultados en el HTML
      showWeather(data);
    });
}

// Función para mostrar los resultados en el HTML
function showWeather(data) {
  const {
    name,
    main: { temp, temp_max, temp_min },
    weather: [{ description, icon }],
    sys: { country },
  } = data;

  const CELCIUS = convertKelvinToCelsius(temp);
  const TEMP_MIN = convertKelvinToCelsius(temp_min);
  const TEMP_MAX = convertKelvinToCelsius(temp_max);

  // Crear la card que muestra el clima
  const WEATHER_CARD = document.createElement(`div`);
  WEATHER_CARD.classList.add(`weather-card`);
  WEATHER_CARD.innerHTML = `
    <h2 class="weather-card__location">${name}, ${country}</h2>
    <p class="weather-card__temperature">${CELCIUS}&#8451;</p>
    <img class="weather-card__icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description} icono">
    <p class="weather-card__description">${description}</p>
    <p class="weather-card__range">Min: ${TEMP_MIN} / Max: ${TEMP_MAX} &#8451;</p>`;

  // Añadir la card al HTML
  MAIN__CONTAINER.appendChild(WEATHER_CARD);
}

/* HELPERS */

// Función para convertir de Kelvin a celcius
function convertKelvinToCelsius(kelvin) {
  return parseInt(kelvin - 273.15);
}

// Función para limpiar el HTML
function clearHTML() {
  while (MAIN__CONTAINER.firstChild) {
    MAIN__CONTAINER.removeChild(MAIN__CONTAINER.firstChild);
  }
}

// Función para mostrar un loader
function showLoader() {
  // Limpiar el HTML
  clearHTML();

  const LOADER = document.createElement(`span`);
  LOADER.classList.add(`loader`);

  MAIN__CONTAINER.appendChild(LOADER);
}
