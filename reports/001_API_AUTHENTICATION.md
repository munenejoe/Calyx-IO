# Issue 001: API authentication enforcement

## Scope

Applied the existing `require_api_key` dependency to the versioned application API routes.

## Design decisions

- `/` and `/health` remain public operational endpoints, preserving deployment health checks.
- All routes mounted beneath `/api/v1` require `Authorization: Bearer <CALYX_API_KEY>`.
- Authentication is applied when routers are included so every current endpoint in each protected router is covered consistently without altering endpoint business logic.

## Files changed

- `backend/main.py`
- `backend/test_authentication.py`
- `reports/001_API_AUTHENTICATION.md`

## Verification performed

- Started the FastAPI application under Uvicorn with test-only configuration.
- Exercised public root and health endpoints with dependency overrides.
- Confirmed a protected endpoint rejects a missing bearer token with HTTP 401.
- Confirmed the same endpoint accepts the configured bearer token and preserves its HTTP 200 response.

## Remaining follow-up work

- Configure `CALYX_API_KEY` in every deployment environment and in authorized API clients.
- If `/supabase/ping` is exposed outside trusted infrastructure, consider moving it behind authentication or removing it; it remains part of the public operational health router in this scoped change.
