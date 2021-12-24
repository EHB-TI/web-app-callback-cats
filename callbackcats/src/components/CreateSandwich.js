import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {
  getToppings,
  getBreads,
  getVegetables,
  getSauces,
} from "../services/service";

const CreateSandwich = (props) => {
  //console.log(JSON.parse(localStorage.getItem('cart')).filter(p => p.product.name.startsWith('Sandwich')).length)
  
  const [product, setProduct] = useState({
    name: `Sandwich #${JSON.parse(localStorage.getItem('cart')).filter(p => p.product.name.startsWith('Sandwich')).length + 1}`,
    ingredients: {
      bread: 'white',
      toppings: [],
      vegetables: [],
      sauces: []
    },
    price: 50,
  });

  const [toppings, setToppings] = useState([]);
  const [breads, setBreads] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [sauces, setSauces] = useState([]);

  const history = useHistory();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getToppings().then((response) => {
      const array = [];
      response.data.forEach((topping) => {
        array.push({
          label: topping.name,
          value: topping.name,
        });
        setToppings(array);
      });
    });
    getBreads().then((response) => {
      console.log();
      const array = [];
      response.data.forEach((bread) => {
        array.push({
          label: bread.name,
          value: bread.name,
        });
        setBreads(array);
      });
    });
    getVegetables().then((response) => {
      const array = [];
      response.data.forEach((vegetable) => {
        array.push({
          label: vegetable.name,
          value: vegetable.name,
        });
        setVegetables(array);
      });
    });
    getSauces().then((response) => {
      const array = [];
      response.data.forEach((sauce) => {
        array.push({
          label: sauce.name,
          value: sauce.name,
        });
        setSauces(array);
      });
    });
  }, []);

  const handleBreadChange = event => {
    setProduct(prevProduct => ({ ...prevProduct, ingredients: { ...prevProduct.ingredients, bread: event.target.id } }))
  };

  const handleToppingChange = event => {
    if (!product.ingredients.toppings.includes(event.target.id)) {
      setProduct(prevProduct => ({ ...prevProduct, ingredients: { ...prevProduct.ingredients, toppings: prevProduct.ingredients.toppings.concat(event.target.id) }, price: prevProduct.price += 50 }))
    }
    else setProduct(prevProduct => ({ ...prevProduct, ingredients: { ...prevProduct.ingredients, toppings: prevProduct.ingredients.toppings.filter(topping => topping !== event.target.id) }, price: prevProduct.price -= 50 }))
  };

  const handleVegetableChange = event => {
    if (!product.ingredients.vegetables.includes(event.target.id)) setProduct(prevProduct => ({ ...prevProduct, ingredients: { ...prevProduct.ingredients, vegetables: prevProduct.ingredients.vegetables.concat(event.target.id) }, price: prevProduct.price += 50 }))
    else setProduct(prevProduct => ({ ...prevProduct, ingredients: { ...prevProduct.ingredients, vegetables: prevProduct.ingredients.vegetables.filter(vegetable => vegetable !== event.target.id) }, price: prevProduct.price -= 50 }))
  };

  const handleSauceChange = event => {
    if (!product.ingredients.sauces.includes(event.target.id)) setProduct(prevProduct => ({ ...prevProduct, ingredients: { ...prevProduct.ingredients, sauces: prevProduct.ingredients.sauces.concat(event.target.id) }, price: prevProduct.price += 50 }))
    else setProduct(prevProduct => ({ ...prevProduct, ingredients: { ...prevProduct.ingredients, sauces: prevProduct.ingredients.sauces.filter(sauce => sauce !== event.target.id) }, price: prevProduct.price -= 50 }))
  };

  // const handleSumbit = event => {
  //   event.preventDefault()

  //   props.addToCart(product, 1)
  // }

  return (
    <div className="App">
      {props.user && props.user.type === "normal" && (
        <div className="App" style={{ margin: "15px" }}>
          <Button
            variant="primary"
            onClick={handleShow}
            style={{ padding: "25px" }}
          >
            Start making your own sandwich
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Choose your ingredients</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form id="form-sandwich">
                <Form.Group key="radio" className="mb-3">
                  <Form.Label>Bread</Form.Label>
                  {breads.map(bread => {
                    return (
                      <Form.Check
                        defaultChecked={bread.value === breads[0].value}
                        key={breads.indexOf(bread)}
                        label={bread.value}
                        name="bread"
                        type="radio"
                        id={bread.value}
                        onChange={handleBreadChange}
                        required
                      />
                    )
                  })}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Topping(s)</Form.Label>
                  {toppings.map(topping => {
                    return (
                      <Form.Check
                        key={toppings.indexOf(topping)}
                        label={topping.value}
                        name="bread"
                        type="checkbox"
                        id={topping.value}
                        onChange={handleToppingChange}
                      />
                    )
                  })}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Vegetable(s)</Form.Label>
                  {vegetables.map(vegetable => {
                    return (
                      <Form.Check
                        key={vegetables.indexOf(vegetable)}
                        label={vegetable.value}
                        name="bread"
                        type="checkbox"
                        id={vegetable.value}
                        onChange={handleVegetableChange}
                      />
                    )
                  })}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sauce(s)</Form.Label>
                  {sauces.map(sauce => {
                    return (
                      <Form.Check
                        key={sauces.indexOf(sauce)}
                        label={sauce.value}
                        name="bread"
                        type="checkbox"
                        id={sauce.value}
                        onChange={handleSauceChange}
                      />
                    )
                  })}
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="primary"
                type="submit"
                form="form-sandwich"
                onClick={() => props.addToCart(product, 1)}
              >
                Add to cart
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}

      {!props.user && history.push("/")}
    </div>
  );
};

export default CreateSandwich;
