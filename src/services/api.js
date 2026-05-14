import axios from "axios";

const BASE_URL = import.meta.env.DEV
  ? "/off-proxy"
  : "https://world.openfoodfacts.org";

export const searchProductsByName = (query, page = 1) =>
  axios.get(`${BASE_URL}/cgi/search.pl`, {
    params: { search_terms: query, json: true, page, page_size: 24 },
    timeout: 15000,
  });

export const getProductsByCategory = (category) =>
  axios.get(`${BASE_URL}/category/${category}.json`, { timeout: 15000 });

export const getProductByBarcode = (barcode) =>
  axios.get(`${BASE_URL}/api/v0/product/${barcode}.json`, { timeout: 15000 });

export const getCategories = () =>
  axios.get(`${BASE_URL}/categories.json`, { timeout: 30000 });
