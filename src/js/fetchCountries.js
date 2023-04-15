const BASE_URL = 'https://restcountries.com/v3.1/name/';

export function fetchCountries(query) {
  const options = {
    headers: {
      'Accept': 'application/json',
    },
  };

  return fetch(
    `${BASE_URL}${query}?fields=name,capital,population,flags,languages`,
    options
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('Oops, there is no country with that name');
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 10) {
        throw new Error(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      return transformData(data);
    });
}

function transformData(data) {
  const countries = data.map(element => {
    const country = {};
    ({
      name: { official: country.name },
      capital: country.capital,
      flags: { svg: country.flag },
      population: country.population,
      languages: country.languages,
    } = element);
    return country;
  });
  return countries;
}
