import React from "react";
import { CartContext } from "../context/cart";
import { UserContext } from "../context/user";
import { useNavigate } from "react-router-dom";
import EmptyCart from "../components/Cart/EmptyCart";
import {
  CardElement,
  StripeProvider,
  ElementsConsumer,
  Elements,
  injectStripe
} from "@stripe/react-stripe-js";
import {loadStripe} from '@stripe/stripe-js';
import submitOrder from "../strapi/submitOrder";

function Checkout(props) {
  const { cart, total, clearCart } = React.useContext(CartContext);
  const { user, showAlert, hideAlert, alert } = React.useContext(UserContext);
  const history = useNavigate();
  // state values
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const isEmpty = !name || alert.show;
  async function handleSubmit(e) {
    showAlert({ msg: "submitting order... please wait" });
    e.preventDefault();
    const response = await props.stripe
      .createToken()
      .catch(error => console.log(error));

    const { token } = response;
    if (token) {
      setError("");
      const { id } = token;

      let order = await submitOrder({
        name: name,
        total: total,
        items: cart,
        stripeTokenId: id,
        userToken: user.token
      });

      if (order) {
        showAlert({ msg: "your order is complete" });
        clearCart();
        history("/");
        return;
      } else {
        showAlert({
          msg: "there was an error with your order. please try again!",
          type: "danger"
        });
      }
    } else {
      hideAlert();
      setError(response.error.message);
    }
  }
  if (cart.length < 1) return <EmptyCart />;
  return (
    <section className="section form">
      <h2 className="section-title">Checkout</h2>
      <form className="checkout-form">
        <h3>
          order total : <span>{total}৳</span>
        </h3>
        {/* single input */}
        <div className="form-control">
          <label htmlFor="name">name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => {
              setName(e.target.value);
            }}
          />
        </div>
        {/* end of single input */}
        {/* card element */}
        <div className="stripe-input">
          <label htmlFor="card-element">Credit or Debit Cart</label>
          <p className="stripe-info">
            Test using this credit card : <span>4242 4242 4242 4242</span>
            <br />
            enter any 5 digits for the zip code
            <br />
            enter any 3 digits for the CVC
          </p>
        </div>
        {/* end of card element */}
        {/* STRIPE ELEMENTS */}
        <CardElement className="card-element"></CardElement>
        {/* stripe errors */}
        {error && <p className="form-empty">{error}</p>}
        {/* empty value */}
        {isEmpty ? (
          <p className="form-empty">please fill out name field</p>
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary btn-block"
          >
            submit
          </button>
        )}
      </form>
    </section>
  );
}
// const CardForm = injectStripe(Checkout);

// const StripeWrapper = () => {
//   return (
//     <StripeProvider apiKey="pk_test_51MJaD7DSDNEmWJ9QlNLBhK42D4UhwEAQ3wrbl8DdxpYx4xDrOPLkLXrCNHh1MCt2D31ubRc7kBTsb1TXpKcW7rpS00Wrws7A3o">
//       <Elements>
//         <CardForm></CardForm>
//       </Elements>
//     </StripeProvider>
//   );
// };
const InjectedCheckoutForm = () => (
   <ElementsConsumer>
     {({stripe, elements}) => (
      <Checkout  />
  )}
  </ElementsConsumer>
);

const stripePromise = loadStripe('pk_test_51MJaD7DSDNEmWJ9QlNLBhK42D4UhwEAQ3wrbl8DdxpYx4xDrOPLkLXrCNHh1MCt2D31ubRc7kBTsb1TXpKcW7rpS00Wrws7A3o');

const StripeWrapper = () => (
  <Elements stripe={stripePromise}>
    <InjectedCheckoutForm />
  </Elements>
);

export default StripeWrapper;
