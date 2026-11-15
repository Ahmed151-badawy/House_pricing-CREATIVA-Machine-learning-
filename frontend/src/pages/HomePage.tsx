import React from "react";
import { PredictionForm } from "../components/PredictionForm";

const TICKER_ITEMS = [
  "MUMBAI METRO",
  "BENGALURU TECH CORRIDOR",
  "DELHI NCR",
  "PUNE",
  "HYDERABAD",
  "CHENNAI",
  "KOLKATA",
  "AHMEDABAD",
  "GURGAON",
  "NOIDA",
];

const PIPELINE_SPECS = [
  {
    code: "01",
    tag: "FEATURE INGESTION",
    title: "LOCATION CLUSTERING",
    desc: "High-cardinality Indian cities and localities grouped into top-N market clusters with an Other fallback tier.",
  },
  {
    code: "02",
    tag: "UNIT NORMALIZATION",
    title: "AREA & FLOOR PARSING",
    desc: "Carpet area standardized in square feet alongside signed integer floor indices from Basement (-5) to high-rise.",
  },
  {
    code: "03",
    tag: "ML INFERENCE",
    title: "RANDOM FOREST ENGINE",
    desc: "Scikit-Learn ColumnTransformer preprocessing paired with an ensemble regressor trained on verified Indian listings.",
  },
  {
    code: "04",
    tag: "CURRENCY ENGINE",
    title: "INR LAC / CR OUTPUT",
    desc: "Exact INR market valuation automatically formatted into Indian Lakh and Crore scales with rate-per-sqft metrics.",
  },
];

const FEATURED_MARKETS = [
  {
    tag: "TIER-1 METRO",
    year: "TOP CLUSTER",
    title: "MUMBAI & THANE CORRIDOR",
    desc: "High-density vertical residential towers calibrated across floor elevation, carpet area, and ownership tenure.",
    metric: "CARPET AREA + FLOOR SENSITIVE",
  },
  {
    tag: "TECH HUB",
    year: "TOP CLUSTER",
    title: "BENGALURU & PUNE MARKETS",
    desc: "Modern apartment developments modeled with furnishing status, balcony counts, and Vastu-aligned facing direction.",
    metric: "51 CITY CLUSTERS",
  },
];

export const HomePage: React.FC = () => {
  return (
    <div className="crox-page" aria-labelledby="home-heading">
      {/* HERO SECTION WITH STRUCTURAL GRID LINES */}
      <section className="crox-hero">
        <div className="hero-meta-bar">
          <span>INDIAN REAL ESTATE ML ENGINE</span>
          <span>MUMBAI &bull; BENGALURU &bull; DELHI NCR</span>
          <span>CORPUS: 171K+ LISTINGS</span>
        </div>

        <div className="hero-top-grid">
          <div className="hero-circle-badge">
            <span className="circle-num">171K+</span>
            <span className="circle-caption">Verified listings in corpus</span>
          </div>

          <div className="hero-pipeline-note">
            <div className="pipeline-chain">
              LOCATION <span aria-hidden="true">→</span> CARPET AREA{" "}
              <span aria-hidden="true">→</span> VALUATION
            </div>
            <div className="pipeline-sub">ENGINEERED AS ONE PIPELINE</div>
          </div>

          <div className="hero-intro-block">
            <p className="hero-subtitle">
              We calibrate residential property prices across India using verified
              market features. Carpet area, floor level, locality, and legal status
              evaluated in one deterministic ML pipeline.
            </p>
            <a href="#valuation-form" className="btn btn-crox-orange">
              <span>START VALUATION</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <h1 id="home-heading" className="hero-monumental-title">
          <span>PROPVAL</span>
          <span>INTELLIGENCE</span>
        </h1>

        {/* TELEMETRY & WIREFRAME ROW */}
        <div className="telemetry-row">
          <div className="telemetry-rail" aria-hidden="true">
            <span>MODEL / RANDOM FOREST</span>
          </div>

          <div className="telemetry-canvas">
            <svg
              className="wireframe-svg"
              viewBox="0 0 640 280"
              role="img"
              aria-label="Isometric architectural property wireframe blueprint"
            >
              <g stroke="rgba(227,231,235,0.22)" strokeWidth="1" fill="none">
                <polygon points="320,34 450,104 320,174 190,104" />
                <polygon points="320,98 450,168 320,238 190,168" />
                <line x1="320" y1="34" x2="320" y2="98" />
                <line x1="450" y1="104" x2="450" y2="168" />
                <line x1="190" y1="104" x2="190" y2="168" />
                <line x1="320" y1="174" x2="320" y2="238" />
              </g>
              <g
                stroke="#e3e7eb"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                fill="none"
              >
                <polygon points="320,56 410,104 320,152 230,104" />
                <polygon points="320,118 410,166 320,214 230,166" />
                <line x1="320" y1="56" x2="320" y2="118" />
                <line x1="410" y1="104" x2="410" y2="166" />
                <line x1="230" y1="104" x2="230" y2="166" />
                <line x1="320" y1="152" x2="320" y2="214" />
              </g>
              <circle cx="320" cy="34" r="3.5" fill="#ff5f14" />
              <circle cx="320" cy="238" r="3.5" fill="#ff5f14" />
              <circle cx="190" cy="104" r="3.5" fill="#ff5f14" />
              <circle cx="450" cy="104" r="3.5" fill="#ff5f14" />
            </svg>
            <div className="canvas-telemetry-meta">
              <span>GRID: 01-INR</span>
              <span>FEATURE VECTOR: 9D</span>
            </div>
          </div>

          <div className="telemetry-specs">
            <h2 className="telemetry-heading">SYSTEM STATUS</h2>
            <dl className="spec-leader-list">
              <div className="spec-leader-row">
                <dt>TRAINING CORPUS</dt>
                <dd>171,000+ LISTINGS</dd>
              </div>
              <div className="spec-leader-row">
                <dt>INPUT DIMENSIONS</dt>
                <dd>9 FEATURES</dd>
              </div>
              <div className="spec-leader-row">
                <dt>COVERED MARKETS</dt>
                <dd>51 LOCATIONS</dd>
              </div>
              <div className="spec-leader-row">
                <dt>OUTPUT SCALE</dt>
                <dd>INR / LAC / CR</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* DARK TICKER STRIP */}
      <div className="ticker-band" aria-label="Supported metropolitan regions">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <span className="ticker-item" key={`${item}-${idx}`}>
              <span>{item}</span>
              <span className="ticker-slash" aria-hidden="true">
                /
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ARCHITECTURAL HERO SHOWCASE BANNER */}
      <section className="visual-showcase-band" aria-label="Architectural valuation overview">
        <div className="showcase-grid-frame">
          <div className="showcase-banner-inner">
            <img
              src="/images/hero-architecture.jpg"
              alt="Twin 66-storey luxury residential skyscrapers in Mumbai at sunset"
              className="showcase-hero-img"
              fetchPriority="high"
              width={1440}
              height={560}
            />
            <div className="showcase-gradient-scrim" aria-hidden="true" />
            <div className="showcase-banner-overlay">
              <span className="showcase-tag">RESIDENTIAL INTELLIGENCE</span>
              <p className="showcase-headline">
                BUILT FOR ACCURATE INDIAN RESIDENTIAL PRICE DISCOVERY.
              </p>
            </div>
            <div className="showcase-caption-badge">
              <span>MUMBAI &bull; 66-STOREY RESIDENTIAL TOWERS</span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUATION FORM SECTION — STYLED AFTER CROX /CONTACT */}
      <section id="valuation-form" className="valuation-section" aria-labelledby="form-section-title">
        <div className="crox-grid-frame">
          <div className="valuation-split">
            <div className="valuation-info-panel">
              <div className="valuation-info-top">
                <span className="section-eyebrow">01 / VALUATION INPUTS</span>
                <h2 id="form-section-title" className="section-display-heading">
                  CONFIGURE PROPERTY SPECS.
                </h2>
                <p className="valuation-lead">
                  Enter exact carpet area, floor elevation, room counts, and legal
                  attributes. The trained Random Forest model returns an instant INR
                  valuation estimate.
                </p>
              </div>

              <div className="hatch-accent-row">
                <div className="hatch-square" aria-hidden="true" />
                <div className="valuation-notes">
                  <div className="valuation-note-title">INPUT SPECIFICATION NOTES</div>
                  <ul>
                    <li>Use 0 for Ground floor, negative integers (-1 to -5) for Basement levels.</li>
                    <li>Carpet area accepts 1 to 50,000 square feet.</li>
                    <li>Over 50 Indian cities &amp; &ldquo;Other / Unlisted Location&rdquo; supported.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="valuation-form-panel">
              <PredictionForm />
            </div>
          </div>
        </div>
      </section>

      {/* COVERED MARKETS / SELECTED WORK STYLE */}
      <section id="markets" className="markets-section" aria-labelledby="markets-heading">
        <div className="section-header-strip">
          <div>
            <h2 id="markets-heading" className="section-strip-title">
              SELECTED MARKETS
            </h2>
            <p className="section-strip-sub">
              High-density metropolitan hubs &amp; residential corridors modeled in the training corpus.
            </p>
          </div>
          <a href="#valuation-form" className="btn btn-crox-dark">
            <span>CONFIGURE ESTIMATE</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="crox-grid-frame">
          <div className="markets-grid">
            {FEATURED_MARKETS.map((mkt, index) => (
              <article className="market-card" key={mkt.title}>
                <div className="market-media-slot">
                  <div className="market-blueprint-grid" aria-hidden="true" />
                  <span className="market-slot-label">
                    IMAGE SLOT 0{index + 1} / PROPERTY VISUAL
                  </span>
                </div>
                <div className="market-card-body">
                  <div className="market-card-meta">
                    <span>{mkt.tag}</span>
                    <span>{mkt.year}</span>
                  </div>
                  <h3 className="market-card-title">{mkt.title}</h3>
                  <p className="market-card-desc">{mkt.desc}</p>
                  <div className="market-card-footer">
                    <span className="market-metric">{mkt.metric}</span>
                    <a href="#valuation-form" className="market-action-link">
                      ESTIMATE HERE <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CORE PIPELINE / INFRASTRUCTURE SECTION */}
      <section id="methodology" className="infra-section" aria-labelledby="infra-heading">
        <div className="section-divider-bar">
          <span>CORE ARCHITECTURE</span>
          <span aria-hidden="true">&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&gt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
        </div>

        <div className="section-header-strip">
          <div>
            <h2 id="infra-heading" className="section-strip-title">
              IN-HOUSE ML INFRASTRUCTURE
            </h2>
            <p className="section-strip-sub">
              Four deterministic stages from raw input validation to Indian market price output.
            </p>
          </div>
        </div>

        <div className="crox-grid-frame">
          <div className="infra-grid">
            {PIPELINE_SPECS.map((spec) => (
              <article className="infra-card" key={spec.code}>
                <div className="infra-card-top">
                  <span className="infra-tag">{spec.tag}</span>
                  <span className="infra-num">{spec.code}</span>
                </div>
                <h3 className="infra-title">{spec.title}</h3>
                <p className="infra-desc">{spec.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
