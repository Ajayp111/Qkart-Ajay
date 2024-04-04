import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia component='img' alt={product.name} image={product.image} />
      <CardContent>
        <p>{product.name}</p>
        <p style={{
          fontWeight:700
        }}>${product.cost}</p>
        <Rating
         value={product.rating}
         precision={0.5}
         readOnly
        />
      </CardContent>
      <CardActions>
        <Button
        variant='contained'
        fullWidth
        startIcon={<AddShoppingCartOutlined />}
        onClick={handleAddToCart}
        >Add to Cart</Button>
      </CardActions>

    </Card>
  );
};

export default ProductCard;
