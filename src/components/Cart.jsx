
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  addItem,
  removeItem,
  clearCart,
  applyPromoCode
} from '../redux/cartSlice';

export default function Cart() {
  const {
    items,
    totalCount,
    totalPrice,
    discountPercent
  } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  // DEFI 2: Promo code input
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  const discountedPrice =
    totalPrice - (totalPrice * discountPercent / 100);

  const handlePromo = () => {
    if (promoCode.trim() === 'POLY2027') {
      dispatch(applyPromoCode('POLY2027'));
      setPromoMessage('Promo code applied successfully!');
    } else {
      dispatch(applyPromoCode(promoCode.trim()));
      setPromoMessage('Invalid promo code!');
    }
  };

  return (
    <div className="cart-card">
      <div className="cart-header">
        <h3>My Redux Cart</h3>

        {items.length > 0 && (
          <button onClick={() => {
            dispatch(clearCart());
            setPromoCode('');
            setPromoMessage('');
          }}>
            Clear
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="cart-row">
              <span>
                {item.name} ({item.price} DT x {item.quantity})
              </span>

              <div>
                <button
                  onClick={() => dispatch(removeItem(item.id))}
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => dispatch(addItem(item))}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <p>
            Total Items: <strong>{totalCount}</strong>
          </p>

          <p>
            Subtotal: <strong>{totalPrice} DT</strong>
          </p>

          {/* DEFI 2: Promo Code Section */}
          <div className="promo-section">
            <h4>Promo Code</h4>

            <input
              type="text"
              placeholder="Enter POLY2027"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />

            <button onClick={handlePromo}>
              Apply
            </button>

            {promoMessage && (
              <p>{promoMessage}</p>
            )}
          </div>

          {/* Discount Display */}
          {discountPercent > 0 && (
            <p style={{ color: 'green' }}>
              Discount: {discountPercent}%
            </p>
          )}

          <p>
            Grand Total:{' '}
            <strong style={{ color: discountPercent > 0 ? 'green' : 'inherit' }}>
              {discountedPrice.toFixed(2)} DT
            </strong>
          </p>
        </>
      )}
    </div>
  );
}
