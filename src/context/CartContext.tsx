/**
 * INTERMEDIATE: CartContext
 * Demonstrates: useReducer with selectors, memoized context value,
 *               exposing computed/derived state through context
 */
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
} from "react";
import {
  cartReducer,
  initialCartState,
  selectSubtotal,
  selectTotal,
  selectItemCount,
} from "../reducers/cartReducer";
import type { CartState, CartAction, Product } from "../types";

interface CartContextValue extends CartState {
  dispatch: React.Dispatch<CartAction>;
  // Derived / computed
  subtotal: number;
  total: number;
  itemCount: number;
  // Action helpers
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Memoize the context value so stable references are passed down
  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      dispatch,
      subtotal: selectSubtotal(state.items),
      total: selectTotal(state.items, state.discount),
      itemCount: selectItemCount(state.items),
      addItem: (product) => dispatch({ type: "ADD_ITEM", payload: product }),
      removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
      updateQuantity: (id, quantity) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
      applyCoupon: (code) => dispatch({ type: "APPLY_COUPON", payload: code }),
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside <CartProvider>");
  return ctx;
}
