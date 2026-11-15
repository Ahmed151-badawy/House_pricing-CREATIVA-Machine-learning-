import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ResultPage } from "./pages/ResultPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { checkHealth } from "./api/predictionClient";
import "./App.css";

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);
  return null;
};

export const App: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    let active = true;
    checkHealth()
      .then((res) => {
        if (active) {
          setApiStatus(res.status === "ok" && res.model_loaded ? "online" : "offline");
        }
      })
      .catch(() => {
        if (active) setApiStatus("offline");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="app-shell">
        <header className="site-header">
          <nav className="header-nav-grid" aria-label="Primary navigation">
            <Link to="/" className="nav-cell nav-brand-cell">
              <span className="brand-mark" aria-hidden="true" />
              <span className="brand-wordmark">PROPVAL AI</span>
            </Link>

            <Link to="/" className="nav-cell nav-link-cell">
              VALUATOR
            </Link>
            <Link to="/#methodology" className="nav-cell nav-link-cell">
              PIPELINE
            </Link>
            <Link to="/#markets" className="nav-cell nav-link-cell">
              MARKETS
            </Link>

            <div className="nav-cell nav-status-cell api-status-badge" aria-live="polite">
              <span
                className={`status-dot ${
                  apiStatus === "online"
                    ? "online"
                    : apiStatus === "offline"
                    ? "offline"
                    : ""
                }`}
                aria-hidden="true"
              />
              <span>
                {apiStatus === "online"
                  ? "Model Ready"
                  : apiStatus === "offline"
                  ? "API Offline"
                  : "Connecting..."}
              </span>
            </div>

            <Link to="/#valuation-form" className="nav-cell nav-cta-cell">
              <span>ESTIMATE NOW</span>
              <span aria-hidden="true">→</span>
            </Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <div className="footer-top-grid">
            <div className="footer-cta-panel">
              <div>
                <h2 className="footer-cta-heading">
                  PRECISION VALUATIONS ENGINEERED FOR CLARITY.
                </h2>
                <p className="footer-cta-copy">
                  Submit property dimensions, floor metadata, and locality parameters for
                  an instant Random Forest market price estimate in INR.
                </p>
              </div>
              <Link to="/#valuation-form" className="btn btn-crox-orange">
                <span>RUN AN ESTIMATE</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="footer-links-stack">
              <Link to="/" className="footer-link-row">
                <span>VALUATOR</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/#valuation-form" className="footer-link-row">
                <span>CONFIGURE SPECS</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/#methodology" className="footer-link-row">
                <span>ML PIPELINE</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/#markets" className="footer-link-row">
                <span>COVERED MARKETS</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/result" className="footer-link-row">
                <span>VALUATION VIEW</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="footer-meta-panel">
              <div className="footer-meta-block">
                <div className="footer-meta-label">MODEL ENGINE</div>
                <div className="footer-meta-value">Scikit-Learn Random Forest</div>
              </div>
              <div className="footer-meta-block">
                <div className="footer-meta-label">TRAINING CORPUS</div>
                <div className="footer-meta-value">171,000+ Indian Listings</div>
              </div>
              <div className="footer-meta-block">
                <div className="footer-meta-label">BACKEND SERVICE</div>
                <div className="footer-meta-value">FastAPI REST Inference</div>
              </div>
            </div>
          </div>

          <div className="footer-wordmark-panel" aria-hidden="true">
            <div className="footer-giant-wordmark">PROPVAL</div>
          </div>

          <div className="footer-bottom-bar">
            <span>&copy; 2026 PROPVAL AI. PRECISION REAL ESTATE VALUATION.</span>
            <span>INDIAN HOUSE PRICE PREDICTION &bull; FASTAPI &amp; SCIKIT-LEARN</span>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
