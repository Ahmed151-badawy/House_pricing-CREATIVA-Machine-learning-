import React from "react";
import { useLocation, Link } from "react-router-dom";
import type { PredictionResultState } from "../types/prediction";

function formatLocationDisplay(slug: string): string {
  if (slug === "other") return "Other / Unlisted";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatINRNumber(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const ResultPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as PredictionResultState | null;

  if (!state || !state.response || !state.request) {
    return (
      <section className="crox-subpage" aria-labelledby="empty-heading">
        <div className="crox-grid-frame">
          <div className="empty-state-panel">
            <span className="section-eyebrow">STATUS / NO RECORD</span>
            <h1 id="empty-heading" className="section-display-heading">
              No Valuation Data Found
            </h1>
            <p className="empty-state-copy">
              Submit property specifications on the valuation form to generate an
              estimated Indian market price.
            </p>
            <Link to="/" className="btn btn-crox-orange">
              <span>Go to Valuation Form</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { request, response } = state;
  const pricePerSqft = Math.round(response.predicted_price / request.carpet_area_sqft);
  const floorLabel =
    request.floor_num === 0
      ? "Ground"
      : request.floor_num < 0
      ? "Basement"
      : `Floor ${request.floor_num}`;

  const specs = [
    { key: "Location", val: formatLocationDisplay(request.location) },
    { key: "Carpet Area", val: `${request.carpet_area_sqft.toLocaleString()} sqft` },
    { key: "Floor", val: floorLabel },
    { key: "Bathrooms", val: String(request.bathroom) },
    { key: "Balconies", val: String(request.balcony) },
    { key: "Furnishing", val: request.furnishing },
    { key: "Transaction", val: request.transaction },
    { key: "Ownership", val: request.ownership },
    { key: "Facing", val: request.facing },
  ];

  return (
    <section className="crox-subpage" aria-labelledby="result-heading">
      <div className="crox-grid-frame">
        {/* DARK TELEMETRY OUTPUT HERO */}
        <div className="result-hero-grid">
          <div className="telemetry-rail" aria-hidden="true">
            <span>VALUATION / OUTPUT</span>
          </div>

          <div className="result-hero-main">
            <p className="valuation-label">Estimated Property Market Value</p>
            <h1 id="result-heading" className="valuation-amount">
              {response.formatted_price}
            </h1>
            <p className="valuation-exact">
              {formatINRNumber(response.predicted_price)} &bull; Approx.{" "}
              {formatINRNumber(pricePerSqft)} / sqft
            </p>
          </div>

          <div className="result-telemetry-box">
            <div className="result-box-heading">MODEL READOUT</div>
            <dl className="spec-leader-list spec-leader-dark">
              <div className="spec-leader-row">
                <dt>EXACT INR</dt>
                <dd>{formatINRNumber(response.predicted_price)}</dd>
              </div>
              <div className="spec-leader-row">
                <dt>RATE / SQFT</dt>
                <dd>{formatINRNumber(pricePerSqft)}</dd>
              </div>
              <div className="spec-leader-row">
                <dt>LOCALITY</dt>
                <dd>{formatLocationDisplay(request.location)}</dd>
              </div>
              <div className="spec-leader-row">
                <dt>STATUS</dt>
                <dd>VERIFIED</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* SPECIFICATION MATRIX */}
        <div className="result-specs-section">
          <div className="result-specs-header">
            <h2 className="summary-section-title">Property Specifications Summary</h2>
            <span className="summary-count-tag">9 PARAMETERS LOCKED</span>
          </div>

          <div className="summary-grid">
            {specs.map((item) => (
              <div className="summary-item" key={item.key}>
                <div className="summary-key">{item.key}</div>
                <div className="summary-val">{item.val}</div>
              </div>
            ))}
          </div>

          <div className="result-actions-bar">
            <Link to="/" className="btn btn-crox-orange">
              <span>Estimate Another Property</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
