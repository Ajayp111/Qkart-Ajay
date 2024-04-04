import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const {enqueueSnackbar} = useSnackbar();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [debaounceTimer, setDebaounceTimer] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const token = localStorage.getItem("token");

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    try {
      let response = await axios.get(`${config.endpoint}/products`);
      return response.data;
    } catch (e) {}
  };
  useEffect(() => {
    const onLoadHandler = async () => {
    const productsData = await performAPICall();
    const cartData = await fetchCart(token);
    const cartDetails = generateCartItemsFrom(cartData,productsData);
    setItems(cartDetails);
    }
    onLoadHandler();

    performAPICall()
      .then((data) => {
        setProducts(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      let response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setProducts(response.data);
    } catch (e) {
      if (e.response.status === 404) {
        setProducts([]);
      } else {
        
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout);

    let timerId = setTimeout(() => {
      performSearch(event.target.value)  
        
      
    }, 500);
    setDebaounceTimer(timerId);
  };
  // useEffect(() => {
  //   return () => {
  //     clearTimeout(debaounceTimer); //timerId
  //   };
  // }, [debaounceTimer]); //timerId
  // };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    // try {
    //   // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    // } catch (e) {
    //   if (e.response && e.response.status === 400) {
    //     enqueueSnackbar(e.response.data.message, { variant: "error" });
    //   } else {
    //     enqueueSnackbar(
    //       "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
    //       {
    //         variant: "error",
    //       }
    //     );
    //   }
    //   return null;
    // }
    try {
      let response = await axios.get(
        `${config.endpoint}/cart`,
        {
          headers: {
            Authorization:`Bearer ${token}`
          }
        }
      );
      
      return response.data
    } catch (e) {
      if(e.response){
                enqueueSnackbar(e.response.data.message, {variant: "error"});
      } else {
        enqueueSnackbar(
          "Could not fetch the cartitems. Check that the backend is running,rechable and return",
          {
            variant:"error",
          }
        )
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    return items.find(item => item.productId === productId)
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const updateCartItems = (cartData, products) => {
    const cartItems = generateCartItemsFrom(cartData, products);
    setItems(cartItems);
  };

  const addToCart = async (
    token,
    items,
    products, 
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token){
      enqueueSnackbar("Login to add an item to the cart", {variant: "warning"});
      return;
    }
    if(options.preventDuplicate && isItemInCart(items, productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", {variant: "warning"});
      return;
    }
    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        {
            productId, qty
        },
        {
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      updateCartItems(response.data, products);
      return response.data
    } catch (e) {
      if(e.response){
                enqueueSnackbar(e.response.data.message, {variant: "error"});
      } else {
        enqueueSnackbar(
          "Could not add/update product in the cart. Check that the backend is running,rechable and return",
          {
            variant:"error",
          }
        )
      }
      return null;
    }
  };



return (
  <div>
    <Header>
      {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      <TextField
        className="search-desktop"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e, debaounceTimer);
        }}
      />
    </Header>

    {/* Search view for mobiles */}
    <TextField
      className="search-mobile"
      size="small"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search color="primary" />
          </InputAdornment>
        ),
      }}
      placeholder="Search for items/categories"
      name="search"
      onChange={(e) => {
        debounceSearch(e, debaounceTimer);
      }}
    />

    <Grid container>
      <Grid item xs={12} md={9} className="product-grid">
        {/* Nested Grid container for hero section and products */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your doorstep
              </p>
            </Box>
          </Grid>

          {loading ? (
            <Grid item xs={12}>
              <Box className="loading">
                <CircularProgress />
                <h4>Loading Products...</h4>
              </Box>
            </Grid>
          ) : (
            products.length ? (
              products.map((product) => (
                <Grid key={product._id} item xs={6} lg={3}>
                  <ProductCard
                    product={product}
                    handleAddToCart={async () => {
                      await addToCart(
                        token,
                        items,
                        products,
                        product._id,
                        1,
                        {
                          preventDuplicate: true,
                        }
                      );
                    }}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4 style={{ color: "#636363" }}>No products found</h4>
                </Box>
              </Grid>
            )
          )}
        </Grid>
      </Grid>

      {token && (
        // Grid item for the Cart component
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart 
          hasCheckoutButton={true}
          products={products}
           items={items} 
           handleQuantity={addToCart} 
           />
        </Grid>
      )}
    </Grid>

    {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
    <Footer />
  </div>
);
};

export default Products;