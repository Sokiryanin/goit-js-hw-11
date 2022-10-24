import { page } from './index';
import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com';
const API_KEY = '30517244-e729ceb83709aa7ca3195b0ba';

export default function fetchImg(query) {
  return axios.get(
    `/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
}
