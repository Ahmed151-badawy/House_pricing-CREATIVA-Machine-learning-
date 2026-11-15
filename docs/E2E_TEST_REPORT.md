# PropVal AI — End-to-End (E2E) QA & Verification Report

## 1. Executive Summary

Comprehensive end-to-end verification of **PropVal AI** (React + TypeScript + Vite frontend, FastAPI backend, and Scikit-Learn `RandomForestRegressor` pipeline) was completed using live Chrome browser automation via Chrome DevTools MCP, API inspection, automated backend tests, and production build checks.

**Overall Result:** **PASS (12/12 E2E test suites passed)** after resolving two UI/layout issues and one local Python virtual environment configuration drift discovered during live QA. All user flows—homepage rendering, dropdown/input interactivity, client-side validation & accessibility states, real ML inference across multiple property configurations, INR Lac/Cr formatting, navigation/404/offline error handling, and responsive layouts across desktop, laptop, tablet, and mobile—are verified and operational.

---

## 2. Environment

| Component | Details |
| :--- | :--- |
| **OS** | Windows (`win32`) |
| **Python Version** | Python `3.12.8` (`.venv`) |
| **Node.js / npm** | Node `v24.12.0` / npm `11.6.2` |
| **Browser** | Google Chrome `157.0.0.0` (via Chrome DevTools MCP) |
| **Backend URL** | `http://localhost:8000` (`uvicorn app.main:app --reload`) |
| **Frontend URL** | `http://localhost:5173` (`npm run dev`) |
| **Model Artifact** | `models/house_price.pkl` (`25.41 MB`, SHA-256 `CD329C161285CA47BFBC997970CF2AFD534466F5615F1D68877A32CBDC785F6D`) |

---

## 3. Test Results

| Test | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| E2E-01 | Homepage loading | **PASS** | Header branding (`PropVal AI`), `Model Ready` health indicator, main heading, all 9 form fields, and 51-city location dropdown rendered cleanly with zero console errors. Screenshot: [01-homepage-desktop.png](e2e/01-homepage-desktop.png) |
| E2E-02 | Form functionality | **PASS** | Verified location `<select>`, numeric inputs (`carpet_area_sqft`, `floor_num`, `bathroom`, `balcony`), and attribute `<select>` controls (`furnishing`, `transaction`, `ownership`, `facing`) update and retain values. Screenshot: [03-location-dropdown.png](e2e/03-location-dropdown.png) |
| E2E-03 | Input validation | **PASS** | Tested empty submission, `0` carpet area, decimal floor (`2.5`), and negative/malformed inputs. Friendly error text, `aria-invalid="true"`, dynamic `aria-describedby`, and `aria-live="polite"` announcements updated accurately; zero `POST /predict` requests sent when invalid; errors cleared on valid input. Screenshot: [04-validation-errors.png](e2e/04-validation-errors.png) |
| E2E-04 | Successful prediction | **PASS** | Submitted Mumbai test case (`1000 sqft`, Floor `5`, `2` bath, `1` balcony, `Semi-Furnished`, `Resale`, `Freehold`, `East`). `OPTIONS` (`200`) + `POST /predict` (`200`) returned `{"predicted_price": 30756974.19, "formatted_price": "₹ 3.08 Cr"}`, matching UI display exactly. Note: Transient loading state (`Calculating Estimate...`) resolves in <50ms locally even under emulated `Slow 3G` loopback. Screenshot: [06-result-page.png](e2e/06-result-page.png) |
| E2E-05 | Result page | **PASS** | Verified INR Lac/Cr formatting (`₹ 3.08 Cr`), exact INR formatting (`₹3,07,56,974`), price per sqft (`₹30,757 / sqft`), all 9 submitted attributes, zero `NaN`/`undefined`/`null` values, and `"Estimate Another Property"` navigation. Screenshot: [06-result-page.png](e2e/06-result-page.png) |
| E2E-06 | Multiple predictions | **PASS** | Tested 4 distinct configurations via live browser: (A) Mumbai `1000 sqft` $\rightarrow$ **`₹ 3.08 Cr`** (`₹30,757 / sqft`); (B) Gurgaon `1500 sqft` $\rightarrow$ **`₹ 1.82 Cr`** (`₹12,115 / sqft`); (C) Vadodara `650 sqft` $\rightarrow$ **`₹ 27.23 Lac`** (`₹4,189 / sqft`); (D) Bangalore `1200 sqft` $\rightarrow$ **`₹ 79.46 Lac`** (`₹6,622 / sqft`). Screenshot: [05-result-bangalore-desktop.png](e2e/05-result-bangalore-desktop.png) |
| E2E-07 | Navigation | **PASS** | Verified `/` $\leftrightarrow$ `/result` transitions, browser refresh (`reload`) on `/result` preserving History API state, browser Back/Forward navigation, direct `/result` empty state (`"No Valuation Data Found"`), and custom `/nonexistent-route` 404 page with `"Return Home"` link. Screenshot: [07-404-page.png](e2e/07-404-page.png) |
| E2E-08 | Error handling | **PASS** | Controlled backend shutdown showed `"API Offline"` badge in header; submitting valid form displayed `"Prediction Request Failed — Unable to connect to the prediction backend. Please verify the API server is running."` cleanly without crashing. Restarting backend restored `"Model Ready"` and normal predictions. Screenshot: [10-backend-offline-error.png](e2e/10-backend-offline-error.png) |
| E2E-09 | Responsive design | **PASS** | Tested Desktop (`1920×1080`), Laptop (`1366×768`), Tablet (`768×1024`), and Mobile (`390×844`) on Homepage and Result Page; all viewports reported `scrollWidth === innerWidth` (`overflowX: false`) with clean grid stacking and `48px` tap targets. Screenshots: [02-homepage-mobile.png](e2e/02-homepage-mobile.png), [08-tablet-layout.png](e2e/08-tablet-layout.png), [09-result-mobile.png](e2e/09-result-mobile.png) |
| E2E-10 | Browser console | **PASS** | Inspected DevTools Console and Network panels across normal operation: **0** JavaScript runtime errors, **0** React warnings, **0** CORS errors, and **200/304** status on all assets and `/health`, `/predict` endpoints (`ERR_CONNECTION_REFUSED` appeared solely during the deliberate E2E-08 offline test). |
| E2E-11 | Backend tests | **PASS** | `pytest -v` in `backend/` passed **7/7** tests (`test_health_endpoint`, `test_model_loading_behavior`, `test_prediction_successful`, `test_prediction_unknown_location`, `test_prediction_invalid_area`, `test_prediction_missing_required_field`, `test_locations_endpoint`) in `17.23s`. Verified identical SHA-256 hash across `models/house_price.pkl`, `backend/models/house_price.pkl`, and `notebooks/models/house_price.pkl`. |
| E2E-12 | Production build | **PASS** | `npm run lint` (`oxlint`) reported **0 warnings, 0 errors**; `npm run build` (`tsc -b && vite build`) succeeded cleanly in `895ms`, generating `dist/`. |

---

## 4. Issues Found & Resolved During QA

### Issue 1 — Sticky Header Overlapping Scrolled Result Banner & Validation Focus
- **Description:** Navigating from the bottom of the prediction form to `/result` preserved the form's scroll offset (`scrollY = 262px`). Because `.site-header` used `position: sticky; top: 0;`, the sticky header visually overlapped the middle of `.valuation-hero` on `/result` and overlapped scrolled hero text when focusing invalid fields on submit.
- **How to Reproduce:** Scroll down to click `Predict House Price` on `/` and observe `/result` preserving scroll offset beneath the sticky header.
- **Root Cause:** Missing route-change scroll reset in `frontend/src/App.tsx`, missing `scroll-padding-top` in `frontend/src/index.css`, and unnecessary `position: sticky; top: 0;` on `.site-header` in `frontend/src/App.css`.
- **Fix Applied:**
  1. Added `<ScrollToTop />` in `frontend/src/App.tsx` to reset `window.scrollTo` on route transitions.
  2. Added `scroll-padding-top: 5.5rem;` in `frontend/src/index.css`.
  3. Changed `.site-header` in `frontend/src/App.css` to normal document flow (removed `position: sticky; top: 0; z-index: 20;`).
- **Retest Result:** **PASS** — Navigating to `/result` resets `scrollY` to `0`, and validation focus scrolls cleanly without header overlap ([04-validation-errors.png](e2e/04-validation-errors.png), [05-result-bangalore-desktop.png](e2e/05-result-bangalore-desktop.png)).

### Issue 2 — Malformed Number Input Error Message & Stale Live Announcement
- **Description:** When typing malformed non-numeric text into an HTML `<input type="number">` (which sets `validity.badInput = true` and exposes `value === ""` to React), `validateField` showed `"<Field> is required."` instead of `"Please enter a valid number."`, and `liveAnnouncement` retained the prior validation string after fixing the field.
- **How to Reproduce:** Enter non-numeric characters such as `1200-50` into Carpet Area and submit.
- **Root Cause:** `validateField` only inspected `val.trim() === ""` without checking `inputEl.validity?.badInput`, and `handleChange` did not clear `liveAnnouncement` when `errorMsg` became empty.
- **Fix Applied:** Updated `validateField` and `handleChange` in `frontend/src/components/PredictionForm.tsx` to handle `validity.badInput` explicitly and clear `liveAnnouncement("")` upon resolution.
- **Retest Result:** **PASS** — `npm run lint`, `npm run build`, and live browser form validation/submission passed with zero errors.

### Issue 3 — `.venv` `pyvenv.cfg` Overwritten to Global Python `3.10.0`
- **Description:** During the controlled backend restart in `E2E-08`, `uvicorn` child worker spawning failed with `ImportError: cannot import name 'Self' from 'typing' (C:\Program Files\Python310\lib\typing.py)` because `.venv\pyvenv.cfg` had been externally overwritten at `5:52 PM` to point `home` and `version` to system Python `3.10.0` while site-packages contained Python `3.12` wheels.
- **How to Reproduce:** Run `.venv\Scripts\python.exe -m uvicorn app.main:app --reload` when `.venv\pyvenv.cfg` references Python `3.10.0`.
- **Root Cause:** `.venv\pyvenv.cfg` pointed to `C:\Program Files\Python310` instead of `C:\Users\ASH\AppData\Local\Programs\Python\Python312`.
- **Fix Applied:** Executed `py -3.12 -m venv --upgrade .venv` to restore `.venv\pyvenv.cfg` to Python `3.12.8`.
- **Retest Result:** **PASS** — `uvicorn app.main:app --reload` started cleanly, loaded the model in ~8 seconds, and served live predictions; `pytest -v` passed 7/7 tests.

---

## 5. Final Assessment

| Metric | Count |
| :--- | :---: |
| **Total Tests Executed** | 12 |
| **Tests Passed** | 12 |
| **Tests Failed** | 0 |
| **Tests Blocked** | 0 |
| **Remaining Issues** | None |

**Overall E2E Readiness:** **READY FOR PUBLIC GITHUB PUBLICATION & PORTFOLIO DEMONSTRATION.**  
All core ML, backend API, frontend UX, responsive layout, accessibility, automated test, and production build checks are verified end-to-end with genuine browser screenshots and clean Git hygiene (`.env`, `.venv/`, `node_modules/`, `dist/`, and raw CSV excluded via `.gitignore`).

