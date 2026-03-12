/**
 * IntermediatePage — useReducer + Context, async actions, split context pattern
 */
import { useAuth } from "../hooks";
import { LoginForm } from "../components/intermediate/LoginForm";
import { UserProfile } from "../components/intermediate/UserProfile";
import { ProductGrid, CartDrawer } from "../components/intermediate/CartComponents";
import { NotificationTriggers } from "../components/intermediate/NotificationToast";

function ConceptCard({ title, code, desc }: { title: string; code: string; desc: string }) {
  return (
    <div className="concept-card">
      <h3 className="concept-title">{title}</h3>
      <pre className="concept-code"><code>{code}</code></pre>
      <p className="concept-desc">{desc}</p>
    </div>
  );
}

export function IntermediatePage() {
  const { status } = useAuth();

  return (
    <div className="page">
      <div className="page-header">
        <span className="page-badge page-badge-orange">INTERMEDIATE</span>
        <h1 className="page-title">useReducer + Context</h1>
        <p className="page-subtitle">
          Reducer pattern · Split context · Async dispatch · Computed state
        </p>
      </div>

      {/* Auth Demo */}
      <section className="demo-section">
        <h2 className="section-title">Auth — async dispatch + split context</h2>
        <div className="demo-row">
          {status !== "authenticated" ? <LoginForm /> : <UserProfile />}
          <div className="concepts-mini">
            <ConceptCard
              title="Split Context Pattern"
              code={`const StateCtx = createContext(null);\nconst DispatchCtx = createContext(null);\n\n// Components that only dispatch\n// won't re-render on state change`}
              desc="Separate state and dispatch into two contexts so non-state consumers avoid unnecessary renders."
            />
            <ConceptCard
              title="Async Action Wrapper"
              code={`async function login(email, password) {\n  dispatch({ type: 'LOGIN_REQUEST' });\n  const user = await api.login(email, password);\n  dispatch({ type: 'LOGIN_SUCCESS', payload: user });\n}`}
              desc="Reducers must be pure & synchronous. Wrap async logic in a function, then dispatch results."
            />
          </div>
        </div>
      </section>

      {/* Cart Demo */}
      <section className="demo-section">
        <h2 className="section-title">Cart — computed/derived state in context</h2>
        <div className="demo-box">
          <p className="demo-note">Click items to add to cart, then open 🛒 in the nav</p>
          <ProductGrid />
          <CartDrawer />
        </div>
      </section>

      {/* Notifications Demo */}
      <section className="demo-section">
        <h2 className="section-title">Notifications — side-effects from context (auto-dismiss)</h2>
        <div className="demo-box">
          <p className="demo-note">Each toast auto-dismisses after 4s via useEffect in the provider</p>
          <NotificationTriggers />
        </div>
      </section>
    </div>
  );
}
