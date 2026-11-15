import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  return (
    <section className="crox-subpage" aria-labelledby="notfound-heading">
      <div className="crox-grid-frame">
        <div className="empty-state-panel">
          <span className="section-eyebrow">ERROR / 404</span>
          <h1 id="notfound-heading" className="section-display-heading">
            Page Not Found
          </h1>
          <p className="empty-state-copy">
            The requested route does not exist or has been relocated inside PropVal AI.
          </p>
          <Link to="/" className="btn btn-crox-orange">
            <span>Return Home</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
