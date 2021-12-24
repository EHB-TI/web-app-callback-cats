import { useEffect, useState } from "react";
import { getProduct } from "../services/service";

import { Button, Form, FormLabel } from "react-bootstrap"
import { useHistory } from "react-router-dom";

const Product = props => {
    const [product, setProduct] = useState({
        _id: null,
        name: null,
        stock: null,
        ingredients: [],
        allergies: [],
        price: null
    });
    const [quantity, setQuantity] = useState(product ? props.cart.find(item => item.product._id === product._id) ? props.cart.find(item => item.product._id === product._id).quantity : 1 : 1);

    const history = useHistory();

    useEffect(() => {
        getProduct(props.match.params.id).then(response => {
            console.log(response);
            setProduct(response.data)
        });
    }, [props.match.params.id]);

    return (
        <div className="App">

            {props.user &&
                <div className="App">
                    <div style={{ width: 'fit-content', margin: '0 auto', padding: '2.5em' }}>
                        <h1>{product.name}</h1>
                    </div>

                    <div className="container">
                        <div>
                            <label>Price: &euro;{product.price / 100}</label>
                        </div>

                        <hr />

                        <div>
                            <label>Ingredients:</label>
                            <ul style={{ listStyleType: "none" }}>
                                {product.ingredients.map(ingredient => {
                                    return (
                                        <li key={ingredient}>{ingredient}</li>
                                    )
                                })}
                            </ul>
                        </div>

                        <hr />

                        <div>
                            <label>Allergies:</label>
                            <ul style={{ listStyleType: "none" }}>
                                {product.allergies.map(allergie => {
                                    return (
                                        <li key={allergie}>{allergie}</li>
                                    )
                                })}
                            </ul>
                        </div>

                        <Form.Group>
                            <FormLabel label="Quantity">
                                <Form.Control className="form-control" type="number" name="quantity" placeholder="quantity" onChange={(event) => setQuantity(event.target.value)} defaultValue={quantity} min="1" required />
                            </FormLabel>
                        </Form.Group>
                        {/* <input type="number" className="form-control" onChange={(event) => setQuantity(event.target.value)} defaultValue={quantity} min="1" required /> */}
                        { product._id !== null &&
                            props.cart.find(item => item.product._id === product._id)
                                ?
                                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                                    <Button variant="danger" onClick={() => props.removeFromCart(product)}>Remove from cart</Button>
                                    <Button variant="warning" onClick={() => props.updateCart(product, parseInt(quantity))}>Update cart</Button>
                                </div>
                                :
                                <Button variant="primary" onClick={() => props.addToCart(product, parseInt(quantity))}>Add to cart</Button>
                        }
                    </div>
                </div>
            }

            {
                !props.user && history.push("/")
            }

        </div>
    );

}

export default Product;