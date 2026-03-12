/**
 * INTERMEDIATE: Cart components
 * Demonstrates: multiple components sharing one context, computed state consumption
 */
import { useCart } from "../../hooks";
import type { Product } from "../../types";

// ─── Mock product catalog ─────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: "p1", name: "Mechanical Keyboard", price: 149.99, image: "⌨️", category: "Tech", stock: 5 },
  { id: "p2", name: "Ergonomic Mouse", price: 79.99, image: "🖱️", category: "Tech", stock: 3 },
  { id: "p3", name: "Monitor Stand", price: 49.99, image: "🖥️", category: "Desk", stock: 8 },
  { id: "p4", name: "USB-C Hub", price: 39.99, image: "🔌", category: "Tech", stock: 10 },
];

// ─── Product Grid ─────────────────────────────────────────────────────────────
export function ProductGrid() {
  const { items, addItem } = useCart();

  return (
    <div className="product-grid">
      {PRODUCTS.map((product) => {
        const inCart = items.find((i) => i.id === product.id);
        return (
          <div key={product.id} className="product-card">
            <span className="product-emoji">{product.image}</span>
            <h4 className="product-name">{product.name}</h4>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <button
              onClick={() => addItem(product)}
              disabled={inCart ? inCart.quantity >= product.stock : false}
              className="btn btn-primary btn-sm"
            >
              {inCart ? `In Cart (${inCart.quantity})` : "Add to Cart"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Cart Badge (reads itemCount only — minimal re-renders) ──────────────────
export function CartBadge() {
  const { itemCount, toggleCart } = useCart();
  return (
    <button className="cart-badge-btn" onClick={toggleCart} aria-label="Open cart">
      🛒
      {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
    </button>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
export function CartDrawer() {
  const {
    items, isOpen, toggleCart, removeItem, updateQuantity,
    subtotal, total, discount, coupon, applyCoupon, clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = (require("react") as typeof import("react")).useState("");

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={(e) => e.target === e.currentTarget && toggleCart()}>
      <div className="cart-drawer">
        <div className="cart-header">
          <h3>Your Cart ({items.length} items)</h3>
          <button className="cart-close" onClick={toggleCart}>✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="cart-empty">Cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <span className="cart-item-emoji">{item.image}</span>
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >+</button>
                </div>
                <button className="cart-remove" onClick={() => removeItem(item.id)}>🗑</button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="coupon-row">
            <input
              placeholder="Coupon code (SAVE10, SAVE20, HALF50)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="coupon-input"
            />
            <button
              onClick={() => { applyCoupon(couponInput); setCouponInput(""); }}
              className="btn btn-sm btn-ghost"
            >Apply</button>
          </div>

          {coupon && (
            <p className="coupon-applied">✅ Coupon {coupon}: −{(discount * 100).toFixed(0)}%</p>
          )}

          <div className="cart-totals">
            <div className="total-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && (
              <div className="total-row discount">
                <span>Discount</span><span>−${(subtotal * discount).toFixed(2)}</span>
              </div>
            )}
            <div className="total-row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          <button onClick={clearCart} className="btn btn-danger btn-full">Clear Cart</button>
        </div>
      </div>
    </div>
  );
}
