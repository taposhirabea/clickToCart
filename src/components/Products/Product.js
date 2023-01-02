import React from "react";
import { Link } from "react-router-dom";
// impt
import PropTypes from "prop-types";
import img from "../../assets/mainBcg.jpeg";
export default function Product({ image, name, id, price }) {
  return (
    <article className="product">
      <div className="img-container">
        <img src={image || img} alt={name || "default title"} />
        <Link to={`products/${id}`} className="btn btn-primary product-link">
          details
        </Link>
      </div>
      <div className="product-footer">
        <p className="product-title">{name || "default title"}</p>
        <p className="product-price">${price || 0}</p>
      </div>
    </article>
  );
}
Product.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
  
};
