# FreshCart React

FreshCart grocery e-commerce frontend built with React 18, Vite and React Router. The source folder layout follows the supplied Route Posts React project convention: components, contexts, helpers, layouts, pages, services, validation and assets.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## API

Default API base URL: `https://ecommerce.routemisr.com/api/v1`

To override it, create `.env` and set:

```env
VITE_API_URL=https://ecommerce.routemisr.com/api/v1
```

The API token is stored as `freshcart_token` in localStorage after login/register. API calls are centralized in `src/services/api.js`.

## Implemented flows

- Authentication: sign in, sign up, forgot password, change password
- Home, products, product details, categories and category details, brands and brand details
- Cart: display, add, remove and quantity update
- Wishlist: display, add and remove
- Checkout: cash on delivery and online checkout-session redirect
- Orders: fetch signed-in user's order history

Some endpoints require a valid account/token and the API's configured payment gateway. See the supplied Postman collection for exact environment/account requirements.
