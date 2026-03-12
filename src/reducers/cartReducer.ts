/**
 * INTERMEDIATE: cartReducer
 * Demonstrates: complex state shape, derived computations in reducer, multi-action patterns
 */
import type { CartState, CartAction, CartItem, Product } from "../types";

export const initialCartState: CartState = {
  items: [],
  isOpen: false,
  coupon: null,
  discount: 0,
};

const COUPON_CODES: Record<string, number> = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  HALF50: 0.5,
};

function addOrIncrease(items: CartItem[], product: Product): CartItem[] {
  const existing = items.find((i) => i.id === product.id);
  if (existing) {
    return items.map((i) =>
      i.id === product.id
        ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
        : i
    );
  }
  return [...items, { ...product, quantity: 1 }];
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: addOrIncrease(state.items, action.payload) };

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [], coupon: null, discount: 0 };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "APPLY_COUPON": {
      const code = action.payload.toUpperCase();
      const discount = COUPON_CODES[code] ?? 0;
      if (!discount) return state; // invalid coupon — no change
      return { ...state, coupon: code, discount };
    }

    case "REMOVE_COUPON":
      return { ...state, coupon: null, discount: 0 };

    default:
      return state;
  }
}

// ─── Selectors (pure functions, co-located with reducer) ──────────────────────
export function selectSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function selectTotal(items: CartItem[], discount: number): number {
  const subtotal = selectSubtotal(items);
  return subtotal - subtotal * discount;
}

export function selectItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
