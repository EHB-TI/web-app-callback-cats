import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Table, Button } from "react-bootstrap";

import { getProducts } from "../../services/service";

const Stock = props => {
  const [products, setProducts] = useState([]);

  const history = useHistory()

  useEffect(() => {
    getProducts().then(response => setProducts(response.data));
  }, [])

  return (
    <div className="App">

      {props.user && props.user.type === "admin" &&
        <div className="App">
          <div style={{ width: 'fit-content', margin: '0 auto', padding: '2.5em' }}>
            <h1>Stock</h1>
          </div>

          <Table className="table-striped" style={{ marginTop: '2em' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                return (
                  <tr key={product._id}>
                    <td>{products.indexOf(product) + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.stock}</td>
                    <td>&euro;{product.price / 100}</td>
                    <td>
                      <Link to={`/dashboard/stock/edit/${product._id}`}>Edit</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>

          <Button variant="primary" href="/dashboard/stock/create">Create</Button>
        </div>
      }

      {
        !props.user && history.push("/")
      }

    </div>
  );
}

export default Stock;