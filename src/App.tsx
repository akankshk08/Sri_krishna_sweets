import { Component, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { DEPARTMENTS } from './data/catalog';
import { CartDrawer } from './components/CartDrawer';
import { DepartmentSection } from './components/DepartmentSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About, Gifting, WhyUs } from './components/StorySections';

/** Catches render errors so a bug shows a friendly message instead of a white screen. */
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="fatal" role="alert">
        <h1>Something went wrong</h1>
        <p>Sorry, this page couldn't load properly. Please refresh. Your cart is saved.</p>
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          Refresh page
        </button>
      </div>
    );
  }
}

function Toast() {
  const { toast, openCart, isOpen } = useCart();
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && !isOpen && (
        <div className="toast">
          <span>{toast}</span>
          <button type="button" className="link-btn link-btn--light" onClick={openCart}>
            View cart
          </button>
        </div>
      )}
    </div>
  );
}

/** Fades sections in once as they scroll into view (skipped for reduced-motion users via CSS). */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  useReveal();
  return (
    <ErrorBoundary>
      <CartProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">
          <Hero />
          <DepartmentSection dept={DEPARTMENTS[0]} tone="white" />
          <DepartmentSection dept={DEPARTMENTS[1]} tone="ivory" />
          <WhyUs />
          <Gifting />
          <About />
        </main>
        <Footer />
        <CartDrawer />
        <Toast />
      </CartProvider>
    </ErrorBoundary>
  );
}
