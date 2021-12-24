# API
| File   | Method | Routing                     | Middlewares | File Path     |
| ------ | ------ | --------------------------- | ----------- | ------------- |
| app.js |        |                             |             |               |
|        | get    | /api/v1/me                  | auth        | app.js#L63-63 |
|        | get    | /api/v1/menus               | auth        | app.js#L66-66 |
|        | get    | /api/v1/products            | auth        | app.js#L68-68 |
|        | get    | /api/v1/products/:productId | auth        | app.js#L71-71 |
|        | get    | /api/v1/toppings            | auth        | app.js#L75-75 |
|        | get    | /api/v1/breads              | auth        | app.js#L76-76 |
|        | get    | /api/v1/vegetables          | auth        | app.js#L77-77 |
|        | get    | /api/v1/sauces              | auth        | app.js#L78-78 |
|        | get    | /api/v1/orders              | auth        | app.js#L82-82 |
|        | post   | /api/v1/logout              | auth        | app.js#L64-64 |
|        | post   | /api/v1/products/edit       | auth        | app.js#L72-72 |
|        | post   | /api/v1/products/add        | auth        | app.js#L73-73 |
|        | post   | /api/v1/createPaymentIntent | auth        | app.js#L80-80 |
|        | post   | /api/v1/addOrder            | auth        | app.js#L83-83 |
|        | post   | /api/v1/removeOrder         | auth        | app.js#L84-84 |
|        | post   | /api/v1/register            |             | app.js#L86-86 |
|        | post   | /api/v1/verify              |             | app.js#L91-91 |
