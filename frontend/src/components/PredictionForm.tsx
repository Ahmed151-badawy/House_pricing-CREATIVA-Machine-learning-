import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import locationsList from "../data/locations.json";
import { predictHousePrice, ApiError } from "../api/predictionClient";
import type { PredictionRequest } from "../types/prediction";

interface FormValues {
  location: string;
  carpet_area_sqft: string;
  floor_num: string;
  bathroom: string;
  balcony: string;
  furnishing: string;
  transaction: string;
  ownership: string;
  facing: string;
}

type FieldName = keyof FormValues;

const FURNISHING_OPTIONS = ["Semi-Furnished", "Unfurnished", "Furnished"];
const TRANSACTION_OPTIONS = ["Resale", "New Property", "Other"];
const OWNERSHIP_OPTIONS = [
  "Freehold",
  "Leasehold",
  "Co-operative Society",
  "Power Of Attorney",
];
const FACING_OPTIONS = [
  "East",
  "North",
  "North - East",
  "West",
  "South",
  "North - West",
  "South - East",
  "South -West",
];

function formatLocationLabel(slug: string): string {
  if (slug === "other") return "Other / Unlisted Location";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const PredictionForm: React.FC = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<FormValues>({
    location: "",
    carpet_area_sqft: "1200",
    floor_num: "3",
    bathroom: "2",
    balcony: "1",
    furnishing: "Semi-Furnished",
    transaction: "Resale",
    ownership: "Freehold",
    facing: "East",
  });

  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>("");

  const fieldRefs = useRef<Partial<Record<FieldName, HTMLInputElement | HTMLSelectElement | null>>>({});

  const validateField = (name: FieldName, val: string): string => {
    const inputEl = fieldRefs.current[name];
    const hasBadInput =
      inputEl instanceof HTMLInputElement && inputEl.validity?.badInput;

    switch (name) {
      case "location":
        if (!val.trim()) return "Please select a property location.";
        return "";
      case "carpet_area_sqft": {
        if (hasBadInput) return "Please enter a valid positive number for carpet area.";
        if (!val.trim()) return "Carpet area is required.";
        const num = Number(val);
        if (Number.isNaN(num) || num <= 0) {
          return "Carpet area must be greater than 0 sqft.";
        }
        if (num > 50000) {
          return "Carpet area cannot exceed 50,000 sqft.";
        }
        return "";
      }
      case "floor_num": {
        if (hasBadInput) return "Please enter a valid whole integer for floor number.";
        if (val.trim() === "") return "Floor number is required (use 0 for Ground).";
        const num = Number(val);
        if (Number.isNaN(num) || !Number.isInteger(num)) {
          return "Floor number must be a whole integer.";
        }
        if (num < -5 || num > 150) {
          return "Floor number must be between -5 (basement) and 150.";
        }
        return "";
      }
      case "bathroom": {
        if (hasBadInput) return "Please enter a valid whole number for bathrooms.";
        if (val.trim() === "") return "Number of bathrooms is required.";
        const num = Number(val);
        if (Number.isNaN(num) || !Number.isInteger(num) || num < 1 || num > 30) {
          return "Bathrooms must be an integer between 1 and 30.";
        }
        return "";
      }
      case "balcony": {
        if (hasBadInput) return "Please enter a valid whole number for balconies.";
        if (val.trim() === "") return "Number of balconies is required (0 if none).";
        const num = Number(val);
        if (Number.isNaN(num) || !Number.isInteger(num) || num < 0 || num > 20) {
          return "Balconies must be an integer between 0 and 20.";
        }
        return "";
      }
      case "furnishing":
        if (!val.trim()) return "Please choose a furnishing status.";
        return "";
      case "transaction":
        if (!val.trim()) return "Please choose a transaction type.";
        return "";
      case "ownership":
        if (!val.trim()) return "Please choose an ownership type.";
        return "";
      case "facing":
        if (!val.trim()) return "Please choose a facing direction.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as FieldName;
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    setApiError(null);

    // Clear error as soon as the user fixes the value while typing
    if (touched[fieldName]) {
      const errorMsg = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
      if (!errorMsg) {
        setLiveAnnouncement("");
      }
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as FieldName;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const errorMsg = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    if (errorMsg) {
      setLiveAnnouncement(`Validation error: ${errorMsg}`);
    }
  };

  const handleReset = () => {
    setValues({
      location: "",
      carpet_area_sqft: "1200",
      floor_num: "3",
      bathroom: "2",
      balcony: "1",
      furnishing: "Semi-Furnished",
      transaction: "Resale",
      ownership: "Freehold",
      facing: "East",
    });
    setTouched({});
    setErrors({});
    setApiError(null);
    setLiveAnnouncement("Form fields have been reset.");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    // Validate all fields on submit
    const fieldOrder: FieldName[] = [
      "location",
      "carpet_area_sqft",
      "floor_num",
      "bathroom",
      "balcony",
      "furnishing",
      "transaction",
      "ownership",
      "facing",
    ];

    const newErrors: Partial<Record<FieldName, string>> = {};
    const newTouched: Partial<Record<FieldName, boolean>> = {};
    let firstInvalidField: FieldName | null = null;

    for (const field of fieldOrder) {
      newTouched[field] = true;
      const err = validateField(field, values[field]);
      if (err) {
        newErrors[field] = err;
        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    }

    setTouched(newTouched);
    setErrors(newErrors);

    if (firstInvalidField) {
      const targetEl = fieldRefs.current[firstInvalidField];
      if (targetEl) {
        targetEl.focus();
      }
      setLiveAnnouncement(
        `Please fix validation errors before submitting. ${newErrors[firstInvalidField]}`
      );
      return;
    }

    const payload: PredictionRequest = {
      location: values.location,
      carpet_area_sqft: Number(values.carpet_area_sqft),
      floor_num: Number(values.floor_num),
      bathroom: Number(values.bathroom),
      balcony: Number(values.balcony),
      furnishing: values.furnishing,
      transaction: values.transaction,
      ownership: values.ownership,
      facing: values.facing,
    };

    setIsSubmitting(true);
    setLiveAnnouncement("Submitting property specifications to valuation model.");

    try {
      const result = await predictHousePrice(payload);
      navigate("/result", {
        state: {
          request: payload,
          response: result,
        },
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to connect to the prediction backend. Please verify the API server is running.";
      setApiError(message);
      setLiveAnnouncement(`Submission failed: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDescribedBy = (name: FieldName, hintId?: string): string | undefined => {
    const ids: string[] = [];
    if (hintId) ids.push(hintId);
    if (touched[name] && errors[name]) ids.push(`${name}-error`);
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  return (
    <form className="prediction-form" onSubmit={handleSubmit} noValidate>
      {/* Polite ARIA live region for screen reader announcements */}
      <div className="visually-hidden" aria-live="polite" role="status">
        {liveAnnouncement}
      </div>

      {apiError && (
        <div className="alert-banner" role="alert">
          <span className="alert-badge" aria-hidden="true">!</span>
          <div>
            <div className="alert-title">Prediction Request Failed</div>
            <div>{apiError}</div>
          </div>
        </div>
      )}

      {/* Group 1: Location & Size */}
      <fieldset className="form-fieldset">
        <legend className="form-legend">Location &amp; Dimensions</legend>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="location" className="form-label">
              City / Location <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <span id="location-hint" className="field-hint">
              Select the property&apos;s city or metropolitan locality.
            </span>
            <select
              id="location"
              name="location"
              ref={(el) => { fieldRefs.current.location = el; }}
              className={`form-control ${touched.location && errors.location ? "is-invalid" : ""}`}
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(touched.location && errors.location)}
              aria-describedby={getDescribedBy("location", "location-hint")}
            >
              <option value="">-- Select a Location --</option>
              {locationsList.map((loc) => (
                <option key={loc} value={loc}>
                  {formatLocationLabel(loc)}
                </option>
              ))}
            </select>
            {touched.location && errors.location && (
              <div id="location-error" className="error-msg">
                <span className="error-badge" role="img" aria-label="Error">!</span> {errors.location}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="carpet_area_sqft" className="form-label">
              Carpet Area (sqft) <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <span id="carpet_area_sqft-hint" className="field-hint">
              Usable floor area in square feet (e.g., 1200).
            </span>
            <input
              type="number"
              id="carpet_area_sqft"
              name="carpet_area_sqft"
              ref={(el) => { fieldRefs.current.carpet_area_sqft = el; }}
              className={`form-control ${touched.carpet_area_sqft && errors.carpet_area_sqft ? "is-invalid" : ""}`}
              value={values.carpet_area_sqft}
              onChange={handleChange}
              onBlur={handleBlur}
              min={1}
              max={50000}
              step="any"
              required
              aria-invalid={Boolean(touched.carpet_area_sqft && errors.carpet_area_sqft)}
              aria-describedby={getDescribedBy("carpet_area_sqft", "carpet_area_sqft-hint")}
            />
            {touched.carpet_area_sqft && errors.carpet_area_sqft && (
              <div id="carpet_area_sqft-error" className="error-msg">
                <span className="error-badge" role="img" aria-label="Error">!</span> {errors.carpet_area_sqft}
              </div>
            )}
          </div>
        </div>
      </fieldset>

      {/* Group 2: Layout & Floor */}
      <fieldset className="form-fieldset">
        <legend className="form-legend">Floor &amp; Room Configuration</legend>
        <div className="form-grid form-grid-3">
          <div className="form-group">
            <label htmlFor="floor_num" className="form-label">
              Floor Number <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <span id="floor_num-hint" className="field-hint">
              0 for Ground, -1 for Basement.
            </span>
            <input
              type="number"
              id="floor_num"
              name="floor_num"
              ref={(el) => { fieldRefs.current.floor_num = el; }}
              className={`form-control ${touched.floor_num && errors.floor_num ? "is-invalid" : ""}`}
              value={values.floor_num}
              onChange={handleChange}
              onBlur={handleBlur}
              min={-5}
              max={150}
              step={1}
              required
              aria-invalid={Boolean(touched.floor_num && errors.floor_num)}
              aria-describedby={getDescribedBy("floor_num", "floor_num-hint")}
            />
            {touched.floor_num && errors.floor_num && (
              <div id="floor_num-error" className="error-msg">
                <span className="error-badge" role="img" aria-label="Error">!</span> {errors.floor_num}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="bathroom" className="form-label">
              Bathrooms <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <span id="bathroom-hint" className="field-hint">
              Total count (1 to 30).
            </span>
            <input
              type="number"
              id="bathroom"
              name="bathroom"
              ref={(el) => { fieldRefs.current.bathroom = el; }}
              className={`form-control ${touched.bathroom && errors.bathroom ? "is-invalid" : ""}`}
              value={values.bathroom}
              onChange={handleChange}
              onBlur={handleBlur}
              min={1}
              max={30}
              step={1}
              required
              aria-invalid={Boolean(touched.bathroom && errors.bathroom)}
              aria-describedby={getDescribedBy("bathroom", "bathroom-hint")}
            />
            {touched.bathroom && errors.bathroom && (
              <div id="bathroom-error" className="error-msg">
                <span className="error-badge" role="img" aria-label="Error">!</span> {errors.bathroom}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="balcony" className="form-label">
              Balconies <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <span id="balcony-hint" className="field-hint">
              Total count (0 if none).
            </span>
            <input
              type="number"
              id="balcony"
              name="balcony"
              ref={(el) => { fieldRefs.current.balcony = el; }}
              className={`form-control ${touched.balcony && errors.balcony ? "is-invalid" : ""}`}
              value={values.balcony}
              onChange={handleChange}
              onBlur={handleBlur}
              min={0}
              max={20}
              step={1}
              required
              aria-invalid={Boolean(touched.balcony && errors.balcony)}
              aria-describedby={getDescribedBy("balcony", "balcony-hint")}
            />
            {touched.balcony && errors.balcony && (
              <div id="balcony-error" className="error-msg">
                <span className="error-badge" role="img" aria-label="Error">!</span> {errors.balcony}
              </div>
            )}
          </div>
        </div>
      </fieldset>

      {/* Group 3: Property Specifications */}
      <fieldset className="form-fieldset">
        <legend className="form-legend">Property Attributes &amp; Legal Status</legend>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="furnishing" className="form-label">
              Furnishing Status <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <select
              id="furnishing"
              name="furnishing"
              ref={(el) => { fieldRefs.current.furnishing = el; }}
              className={`form-control ${touched.furnishing && errors.furnishing ? "is-invalid" : ""}`}
              value={values.furnishing}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(touched.furnishing && errors.furnishing)}
              aria-describedby={getDescribedBy("furnishing")}
            >
              {FURNISHING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {touched.furnishing && errors.furnishing && (
              <div id="furnishing-error" className="error-msg">
                <span className="error-badge" role="img" aria-label="Error">!</span> {errors.furnishing}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="transaction" className="form-label">
              Transaction Type <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <select
              id="transaction"
              name="transaction"
              ref={(el) => { fieldRefs.current.transaction = el; }}
              className={`form-control ${touched.transaction && errors.transaction ? "is-invalid" : ""}`}
              value={values.transaction}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(touched.transaction && errors.transaction)}
              aria-describedby={getDescribedBy("transaction")}
            >
              {TRANSACTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {touched.transaction && errors.transaction && (
              <div id="transaction-error" className="error-msg">
                <span className="error-badge" role="img" aria-label="Error">!</span> {errors.transaction}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="ownership" className="form-label">
              Ownership Type <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <select
              id="ownership"
              name="ownership"
              ref={(el) => { fieldRefs.current.ownership = el; }}
              className={`form-control ${touched.ownership && errors.ownership ? "is-invalid" : ""}`}
              value={values.ownership}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(touched.ownership && errors.ownership)}
              aria-describedby={getDescribedBy("ownership")}
            >
              {OWNERSHIP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {touched.ownership && errors.ownership && (
              <div id="ownership-error" className="error-msg">
                <span className="error-badge" role="img" aria-label="Error">!</span> {errors.ownership}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="facing" className="form-label">
              Facing Direction <span className="required-mark" aria-hidden="true">*</span>
            </label>
            <select
              id="facing"
              name="facing"
              ref={(el) => { fieldRefs.current.facing = el; }}
              className={`form-control ${touched.facing && errors.facing ? "is-invalid" : ""}`}
              value={values.facing}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              aria-invalid={Boolean(touched.facing && errors.facing)}
              aria-describedby={getDescribedBy("facing")}
            >
              {FACING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {touched.facing && errors.facing && (
              <div id="facing-error" className="error-msg">
                <span className="error-badge" role="img" aria-label="Error">!</span> {errors.facing}
              </div>
            )}
          </div>
        </div>
      </fieldset>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={isSubmitting}
        >
          Reset Defaults
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <progress aria-label="Calculating estimate" className="loading-spinner" />
              Calculating Estimate...
            </>
          ) : (
            <>
              Predict House Price <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

