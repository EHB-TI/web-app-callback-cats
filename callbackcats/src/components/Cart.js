import { useHistory } from "react-router-dom";

import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const Cart = props => {
    const history = useHistory();

    return (
        <div className="App">

            {props.user && props.user.type === "normal" &&
                <div className="App">
                    <div style={{ width: 'fit-content', margin: '0 auto', padding: '2.5em' }}>
                        <h1>Cart</h1>
                    </div>

                    <div className="mx-auto" style={{ width: "50%" }}>
                        <Table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Price each</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.cart.map(item => {
                                    return (
                                        <tr key={props.cart.indexOf(item)}>
                                            <th>{props.cart.indexOf(item) + 1}</th>
                                            {
                                                item.product.name.startsWith('Sandwich') ? 
                                                    <td className="position-relative">
                                                        {item.product.name}
                                                        <span className="ml-4 badge rounded-pill bg-danger" title={item.product.ingredients.sauces.concat(item.product.ingredients.toppings, item.product.ingredients.vegetables).join(', ')}>{item.product.ingredients.sauces.length + item.product.ingredients.toppings.length + item.product.ingredients.vegetables.length} ingredients</span>
                                                    </td> 
                                                    : 
                                                    <td onClick={() => history.push(`/product/${item.product._id}`)} style={{ cursor: "pointer" }}>
                                                        {item.product.name}
                                                    </td>
                                            }
                                            <td>{item.quantity}x</td>
                                            <td>&euro; {(item.product.price / 100).toFixed(2)}</td>
                                            <td>
                                                <Button variant="outline-secondary" onClick={() => history.push(`/product/${item.product._id}`)} style={{ cursor: "pointer" }}>Edit</Button>
                                                <Button variant="danger" onClick={() => props.removeFromCart(item.product)}>Remove all</Button>
                                            </td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </Table>

                        <Link to={"/checkout"} className="btn btn-success">Checkout</Link>
                    </div>
                </div>
            }

            {
                !props.user && history.push("/")
            }

        </div>
    );

}

export default Cart;