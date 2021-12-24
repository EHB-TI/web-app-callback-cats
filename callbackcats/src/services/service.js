import axios from 'axios';
import Cookies from 'js-cookie';

let http = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? `http://localhost/api/v1/` : `${process.env.REACT_APP_API_URL}/api/v1/`,
  headers: {
    "Content-type": "application/json",
    "x-access-token": Cookies.get('token'),
  },
  withCredentials: true
});

// USER
export const getUser = (...options) => {
  return http.get(`me?${options.join('&')}`);
}

// LOGOUT
export const logout = _ => {
  return http.post('logout');
}

// MENUS
export const getMenus = _ => {
  return http.get("menus");
}

// PRODUCTS
export const getProducts = _ => {
  return http.get("products");
}

export const getToppings = _ => {
  return http.get("toppings");
}

export const getBreads = _ => {
  return http.get("breads");
}

export const getVegetables = _ => {
  return http.get("vegetables");
}

export const getSauces = _ => {
  return http.get("sauces");
}

export const getProduct = productId => {
  return http.get(`products/${productId}`);
}

export const updateStock = product => {
  return http.post("products/edit", product);
}

export const addProduct = product => {
  return http.post("products/add", product);
}

// USER
export const login = user => {
  return http.post("login", user);
}

export const createPaymentIntent = (items) => {
  return http.post(`createPaymentIntent`, { items });
}

// ORDERS
export const getOrders = _ => {
  return http.get("orders");
}

export const addOrder = (userId, order) => {
  return http.post("addOrder", { userId, order });
}

export const removeOrder = order => {
  return http.post("removeOrder", order);
}