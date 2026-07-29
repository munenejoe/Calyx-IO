# Calyx repository review

Review date: 2026-07-29. Scope: read-only review of the complete tracked
repository. The only intended repository change is this report.

## Executive summary

The project is a React/Vite single-page application backed by FastAPI and
Supabase, with an image-identification pipeline that combines local image
processing and Hugging Face inference. The user interface type-checks, but the
repository is not currently release-ready: public API protections are not
wired in, two health/root endpoints call a missing database method, and the
automated test suite provides almost no behavioural coverage.

Priority order: protect the API and error responses, repair the backend
composition/runtime failures, then consolidate duplicated data access and add
contract tests before further feature work.

## Architecture

- `frontend/` is a TypeScript React 18 application built with Vite. Routing is
  centralized in `frontend/src/App.tsx`; page components call the FastAPI API
  through `frontend/src/lib/api.ts`.
- `backend/main.py` composes FastAPI routers. Dependencies expose singleton
  instances from `backend/main_state.py`; `backend/database.py` contains the
  active Supabase client and data access methods. Identification flows from
  `api/routes/identify.py` through `services/identify_service.py` and image/
  trait extractors to Supabase and Hugging Face.
- The intended repository layer is incomplete. `backend/repositories/` repeats
  much of the database client but is not imported by the application, while
  the active `backend/database.py` does not implement every method expected by
  routes.

## Findings

### Critical / high

1. **API authentication is implemented but unused.** `backend/auth.py` defines
   `require_api_key`, yet no router applies it (`rg` finds no
   `Depends(require_api_key)` or `require_user`). Every API route, including
   image uploads, feedback, statistics, and health data, is public. Apply an
   explicit authentication/authorization policy at router level and retain only
   intentionally public endpoints.

2. **Internal exceptions are returned to callers.** The global handler in
   `backend/main.py` returns `str(exc)` in every 500 response. This can expose
   Supabase, filesystem, or implementation details. Log structured details
   server-side and return a stable generic public error.

3. **Root and health endpoints have a runtime defect.** `backend/api/routes/
   health.py` calls `db.get_species_count()`, but the active
   `backend/database.py` has no such method. The method exists only in the
   unused `backend/repositories/species_repository.py`, so `/`, `/health`, and
   `/supabase/ping` will raise against the configured application.

4. **Rate limiting is not applied.** `backend/main.py` creates a SlowAPI
   limiter and handler, but no route uses `@limiter.limit`. The README's rate
   limiting claim is therefore not implemented, leaving costly image inference
   and public endpoints susceptible to abuse.

### Medium

5. **Async routes execute blocking work.** Supabase `.execute()` calls and
   NumPy processing in `backend/database.py` are synchronous but are invoked
   directly from `async` functions. Under load they block the event loop.
   Use an async client where available or isolate blocking work in a bounded
   worker/thread pool.

6. **The identification fallback is nondeterministic.** On a Hugging Face
   failure, `VisionModel._get_dummy_embedding()` returns a random vector
   (`backend/vision.py`), which can yield arbitrary species matches. Return an
   explicit unavailable/low-confidence outcome instead of querying with random
   data.

7. **Caching is unused and the query parameter is mis-typed.** The identify
   route passes `request.query_params.get("use_cache", True)`, so `"false"` is
   a truthy string, and `identify_flower_service` never uses `use_cache` or the
   image hash despite cache methods in `backend/database.py`. Use FastAPI's
   typed parameter and implement or remove the feature.

8. **Search filters interpolate request values into PostgREST expressions.**
   `text_search` and catalogue name filtering construct `.or_(f"...")` with
   user input in `backend/database.py`. This is not parameter binding; special
   PostgREST syntax may alter filters. Validate/escape the search grammar or
   use a database RPC with typed parameters.

9. **Filter counts are an N+1 workload.** `get_available_filters()` fetches all
   species and then awaits a count query for every distinct color and country.
   Move aggregation/counting into a single database query or cached endpoint.

10. **Client and server API contracts drift.** The frontend declares
    `VITE_API_BASE_URL` and sends an optional bearer key in `api.ts`, whereas
    `frontend/.env.example` documents `VITE_API_URL`; `calyxClient.ts` is a
    second, unused Axios client with a different upload/auth behaviour. Keep
    one typed client and one documented configuration name.

### Code quality and dead code

- `backend/api/routes/identify.py` imports `result` from `unittest` and prints
  it at module import. This is accidental production code.
- `backend/models.py` has duplicated imports and `Settings` in
  `backend/config.py` contains a `field_validator` on a non-Pydantic class plus
  duplicate `CORS_ORIGINS` declarations. These are signs of incomplete
  refactoring and should be simplified.
- `backend/database.py` duplicates the same catalogue query consecutively.
  `backend/repositories/` contains a second, unused `SupabaseClient` split
  across three files. Consolidate to one injected data-access implementation.
- `frontend/src/lib/api/calyxClient.ts` has no import sites and logs request,
  response, and error data to the browser console. Remove it or migrate the
  application to it with production-safe observability.
- Debug logging is widespread in database, candidate, pose, color, and debug
  image services. Replace with structured, level-controlled logging; do not
  log image URLs/identifiers by default.

## Security

- Upload validation has useful file-size, MIME, extension, decode, dimension,
  and pixel limits in `preprocess_service.py`. Keep those controls.
- Do not expose `/debug` by default: `backend/main.py` mounts the directory
  unconditionally, and `DEBUG=true` creates publicly retrievable processed
  images. Gate the mount in non-production, authenticate it, and set retention
  and cleanup.
- Use constant-time comparison for API keys if key authentication is retained,
  validate `CORS_ORIGINS` on startup, and avoid `allow_credentials=True` unless
  the explicit allowlist and cookie policy require it.
- No tracked secret files were found; `.env` files are ignored. The backend
  example correctly signals that `SUPABASE_KEY` is a service-role secret.

## Performance

- Identification does synchronous image analysis plus remote inference for
  each request. Add timeouts, concurrency limits, cache real results, and
  metrics around Hugging Face calls.
- The current in-process daily quota resets on restart and is not shared among
  workers. Enforce quotas centrally if they protect cost or availability.
- Catalogue multi-colour filtering occurs after a single page has been fetched,
  causing inaccurate totals/pages and potentially sparse pages. Filter in the
  database before pagination.

## Documentation gaps

- The root README describes PostgreSQL/vector search, rate limiting, privacy,
  and API endpoints but omits setup, environment variables, runnable commands,
  endpoint/auth contracts, deployment configuration, and known operational
  dependencies.
- README links `./LICENSE`, but the tracked license is `backend/LICENSE`.
- There is no contribution guide, security disclosure policy, API reference,
  architecture/dependency diagram, or documented image retention policy.

## Testing gaps and verification

Executed locally:

- `frontend/npm test`: passed, but only one placeholder assertion exists in
  `frontend/src/test/example.test.ts`.
- `frontend/npm run typecheck`: passed.
- `frontend/npm run lint`: failed with 15 errors and 13 warnings, including
  explicit `any` and React hook dependency violations.
- `python -m compileall -q backend`: passed syntax compilation only; it does
  not exercise imports requiring Supabase configuration or endpoint behaviour.

Missing coverage includes FastAPI route tests with mocked dependencies,
authentication/authorization, rate-limit enforcement, malformed and
decompression-bomb uploads, database/filter escaping, error-response
redaction, cache semantics, API schema compatibility, and frontend flows for
identify/search/catalogue/species/error states. Replace `backend/test_api.py`
(a manual remote-service script) with pytest integration/contract tests and
add component/e2e tests around the public UI paths.

## Suggested remediation sequence

1. Enforce authentication, rate limits, safe exception responses, and protected
   debug-image handling.
2. Consolidate the data layer and add the missing health method; add route
   contract tests proving health, search, catalogue, and identify behaviour.
3. Replace random inference fallback, implement cache semantics, and remove
   duplicate client/repository/debug code.
4. Fix lint errors, then document supported setup, security/retention policy,
   and the actual API contract.
