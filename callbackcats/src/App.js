import './App.css';
import {
  Switch,
  Route,
} from "react-router-dom";
import { useState } from 'react';

import logo from "./icon.png"

import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

import Menu from './components/Menu';
import Product from './components/Product';
import Dashboard from "./components/Dashboard";
import Cart from './components/Cart';
import Profile from './components/Profile';
import CreateSandwich from './components/CreateSandwich';
import Login from './components/Login';
import Stock from './components/stock/Stock';
import EditStock from './components/stock/EditStock'
import CreateStock from './components/stock/CreateStock'
import Orders from './components/Orders'
import Checkout from './components/checkout/Checkout';
import NotFound from './components/NotFound';

import Cookies from 'js-cookie';

function App() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const login = async user => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    window.location.reload(false);
  }

  const logout = async _ => {
    localStorage.removeItem('user');
    Cookies.remove('token');
    setUser(JSON.parse(localStorage.getItem("user")));
  }

  const addToCart = async (product, quantity) => {
    
    let c = [...cart];
      // product in cart already
      let prodFound = false;
      for(let item of cart) {
        if(item.product._id && item.product._id === product._id) {
          item.quantity += quantity;
          prodFound = true;
        }
      }
    if(!prodFound) {
      // add product
      c.push({ product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(c));
    setCart(c);
  }

  const updateCart = async (product, quantity) => {
    let c = cart.map(item => {
      if (item.product._id === product._id) item.quantity = quantity
      return item;
    });
    localStorage.setItem('cart', JSON.stringify(c));
    setCart(c);
  }

  const removeFromCart = async product => {
    let c = cart.filter(item => item.product.name !== product.name);
    localStorage.setItem('cart', JSON.stringify(c));
    setCart(c);
  }

  const emptyCart = async _ => {
    let c = [];
    localStorage.setItem('cart', JSON.stringify(c));
    setCart(c);
  }

  return (
    <div className="App">
      {user != null &&
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">
              <img
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt="Eatee logo"
              />
              {" "}Eatee
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/menu">Menu</Nav.Link>

                {/* student */}
                {user != null && user.type === "normal" &&
                  <div>
                    <Nav.Link href="/profile">Profile</Nav.Link>
                  </div>
                }

                {user != null && user.type === "normal" &&
                  <div>
                    <Nav.Link href="/createsandwich">Create a sandwich</Nav.Link>
                  </div>
                }

                {user != null && user.type === "normal" &&
                  <div>
                    <Nav.Link href="/cart">Cart</Nav.Link>
                  </div>
                }

                {user == null &&
                  <Nav.Link href="/">Login</Nav.Link>
                }

                {/* admin */}
                {user != null && user.type === "admin" &&
                  <div>
                    <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                  </div>
                }
                              
                
              </Nav>
              <Nav>
                {/* student */}
                {user != null && user.type === "normal" &&
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                    <NavDropdown style={{ float: 'right' }} title={user.username} id="basic-nav-dropdown">
                      <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                      <NavDropdown.Divider/>
                      <NavDropdown.Item style={{ background: '#dc3545', color:'#fff' }} onClick={logout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                  </div>
                }
                
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      }

      <Switch>
        <Route
          exact
          path="/"
          render={props => (
            <Login {...props} user={user} login={login} />
          )}>
        </Route>
        <Route
          exact
          path="/menu"
          render={props => (
            <Menu {...props} user={user} addToCart={addToCart} />
          )}>
        </Route>

        <Route
          exact
          path="/cart"
          render={props => (
            <Cart {...props} user={user} cart={cart} removeFromCart={removeFromCart} />
          )}>
        </Route>
        <Route
          exact
          path="/profile"
          render={props => (
            <Profile {...props} user={user} logout={logout} />
          )}>
        </Route>
        <Route
          exact
          path="/createsandwich"
          render={props => (
            <CreateSandwich {...props} user={user} addToCart={addToCart} />
          )}>
        </Route>
        <Route
          exact
          path="/checkout"
          render={props => (
            <Checkout {...props} user={user} cart={cart} emptyCart={emptyCart} />
          )}>
        </Route>

        <Route
          exact
          path="/product/:id"
          render={props => (
            <Product {...props} user={user} cart={cart} addToCart={addToCart} updateCart={updateCart} removeFromCart={removeFromCart} />
          )}>
        </Route>

        <Route
          exact
          path="/dashboard"
          render={props => (
            <Dashboard {...props} user={user} logout={logout} />
          )}>
        </Route>
        <Route
          exact
          path="/dashboard/stock"
          render={props => (
            <Stock {...props} user={user} />
          )}>
        </Route>
        <Route
          exact
          path="/dashboard/stock/create"
          render={props => (
            <CreateStock {...props} user={user} />
          )}>
        </Route>
        <Route
          exact
          path="/dashboard/stock/edit/:id"
          render={props => (
            <EditStock {...props} user={user} />
          )}>
        </Route>
        <Route
          exact
          path="/dashboard/orders"
          render={props => (
            <Orders {...props} user={user} />
          )}>
        </Route>
        <Route

          render={_ => (
            <NotFound />
          )}>
        </Route>
      </Switch>

    </div>
  );
};

export default App;