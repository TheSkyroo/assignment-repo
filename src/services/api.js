import axios from "axios";

const BASE_URL = import.meta.env.DEV
  ? "/off-proxy"
  : "https://world.openfoodfacts.org";

export const searchProductsByName = (query, page = 1, signal) =>
  axios.get(`${BASE_URL}/cgi/search.pl`, {
    params: { search_terms: query, json: true, page, page_size: 24 },
    timeout: 25000,
    signal,
  });

// /category/{name}.json → 503 server-side; use tagtype search instead.
export const getProductsByCategory = (category, page = 1, signal) =>
  axios.get(`${BASE_URL}/cgi/search.pl`, {
    params: {
      action: "process",
      tagtype_0: "categories",
      tag_contains_0: "contains",
      tag_0: category,
      json: 1,
      page,
      page_size: 24,
    },
    timeout: 25000,
    signal,
  });

export const getProductByBarcode = (barcode) =>
  axios.get(`${BASE_URL}/api/v0/product/${barcode}.json`, { timeout: 25000 });

// /categories.json → 503. Taxonomy endpoint is the working alternative.
export const getCategories = () =>
  axios.get(`${BASE_URL}/data/taxonomies/categories.json`, { timeout: 30000 });
