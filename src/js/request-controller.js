import axios from 'axios';

export default class PicturesApiController {
  constructor() {
    this.defaultRequestConfig = {
      baseURL: 'https://pixabay.com/api',
      params: {
        key: '35449391-877499d7e02cc8d7dbb493e51',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 200,
        page: 1,
        q: '',
      },
    };
    this.returnedHits = 0;
    this.axiosInstance = axios.create(this.defaultRequestConfig);
  }

  async getPictures() {
    try {
      const { data } = await this.axiosInstance.get();
      this.incrementPageCounter();
      this.incrementHitsCounter(data.hits.length);
      console.log(this.returnedHits);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  resetPageCounter() {
    this.axiosInstance.defaults.params.page = 1;
  }

  initNewSearch(newQuery) {
    this.resetPageCounter();
    this.resetHitsCounter();
    this.query = newQuery;
  }

  incrementPageCounter() {
    this.axiosInstance.defaults.params.page += 1;
  }

  incrementHitsCounter(recievedHits) {
    this.hits += recievedHits;
  }

  resetHitsCounter() {
    this.hits = 0;
  }

  get query() {
    return this.axiosInstance.defaults.params.q;
  }

  set query(query) {
    this.axiosInstance.defaults.params.q = query;
  }

  get hits() {
    return this.returnedHits;
  }
  set hits(recievedHits) {
    this.returnedHits = recievedHits;
  }
}
