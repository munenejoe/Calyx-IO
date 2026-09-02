# Calyx Flora

A botanical intelligence and machine-learning identification platform.

[CALYX FLORA](https://calyxflora.space)

## Overview

Calyx Flora is being developed as an ML-powered plant and flower identification system with specialised AI integrated into the platform. The project evolved from a botanical catalogue and visual experience toward an intelligent identification platform that extracts botanical traits, understands images, and provides species recognition with confidence scoring.

## Product Vision

The long-term direction of Calyx Flora is to become a complete intelligent botanical platform featuring:
- ML-powered botanical identification using specialised AI
- Botanical trait extraction (pose, shape, color, reproductive characteristics)
- Image understanding and feature engineering
- Species recognition with confidence-aware outcomes
- Searchable botanical knowledge base
- Intelligent assistance and future automation capabilities

## Current System

Based on the current build version (2026-07-29), the current implementation consists of:
- A React/Vite single-page application (TypeScript) for the frontend
- A FastAPI backend backed by Supabase (PostgreSQL)
- An image-identification pipeline combining local image processing and Hugging Face inference
- The frontend routes are centralized in `frontend/src/App.tsx` with API calls via `frontend/src/lib/api.ts`
- The backend comprises `backend/main.py` (FastAPI composition), `backend/main_state.py` (singleton instances), and `backend/database.py` (Supabase client and data access)
- Identification flow: `api/routes/identify.py` → `services/identify_service.py` → image/trait extractors → Supabase and Hugging Face
- The repository layer (`backend/repositories/`) is incomplete and unused; active data access resides in `backend/database.py`

## Architecture

### Major Layers
- **Frontend**: TypeScript React 18 application built with Vite, using TailwindCSS and Three.js WebGL shaders
- **Backend**: Python FastAPI application with modular routers (`api/routes/`)
- **Data Layer**: Supabase client (`backend/database.py`) handling PostgreSQL with vector search capabilities
- **Vision/ML Components**: Local image preprocessing services and Hugging Face inference integration
- **Supporting Services**: Identification service, trait extraction modules (pose, shape, color, reproductive), preprocessing utilities

### Data Flow
1. Frontend user uploads image via UI
2. Request sent to FastAPI `/identify` endpoint
3. Backend processes image through preprocessing service
4. Trait extractors analyze pose, shape, color, and reproductive characteristics
5. Features combined into embedding vector
6. Similarity search performed against Supabase flower embeddings
7. Hugging Face inference used as supplementary/fallback identification
8. Results returned to frontend with species match and confidence score

## Machine Learning and Computer Vision Direction

The platform is evolving toward a specialised botanical AI system with the following planned components:
- **Image Preprocessing**: Standardized input pipelines for consistent analysis
- **Computer Vision**: Advanced pose estimation, shape analysis, and color histogram extraction
- **Botanical Trait Extraction**: Specialized modules for reproductive structure analysis and venation patterns
- **Feature Engineering**: Combining multiple trait vectors into robust identification features
- **Embeddings**: Learning botanical-specific representations via contrastive learning
- **Similarity Search**: Optimized vector search with taxonomic weighting
- **Classification**: Fine-tuned models for species-level recognition
- **Confidence Scoring**: Calibrated uncertainty quantification for reliable predictions
- **Evaluation and Benchmarking**: Systematic testing against botanical datasets
- **Specialised Botanical AI**: Domain-specific architecture incorporating plant morphology knowledge

Existing components include basic OpenCV-based pose extraction, NumPy/Scikit-learn color analysis, and Hugging Face inference integration. Planned enhancements focus on domain-specific improvements and end-to-end trainable systems.

## Engineering Roadmap

### Phase 1 — Repository and Engineering Foundation
- Consolidate data access layer into single repository pattern
- Implement proper API authentication and authorization
- Add rate limiting and secure exception handling
- Fix health endpoint runtime defects
- Establish contract tests for core APIs

### Phase 2 — Vision and Trait Extraction
- Replace random inference fallback with explicit unavailable outcomes
- Implement caching semantics for identification results
- Consolidate duplicate vision/service code
- Improve asynchronous handling of blocking operations
- Enhance preprocessing pipeline with standardized transforms

### Phase 3 — Intelligence and Identification
- Develop botanical-specific feature extraction models
- Implement confidence-aware identification outputs
- Add similarity search with taxonomic filtering
- Create evaluation framework for model benchmarking
- Integrate uncertainty quantification into identification pipeline

### Phase 4 — API and Productisation
- Document API contracts with OpenAPI/Swagger
- Implement proper search filtering with PostgREST safety
- Optimize N+1 workloads in filter counts
- Unify Axios client implementation
- Add API versioning and deprecation policies

### Phase 5 — Specialised AI and Automation
- Train domain-specific botanical identification models
- Implement active learning for continuous improvement
- Add automated retraining pipelines
- Develop plant care recommendation system
- Create species-specific growth stage recognition

## Repository / Project Structure

- `frontend/` — TypeScript React 18 application (Vite)
  - `src/App.tsx` — Centralized routing
  - `src/lib/api.ts` — API client wrapper
  - `src/components/` — UI components
  - `src/assets/` — Static assets
- `backend/` — Python FastAPI application
  - `main.py` — Application composition and middleware
  - `main_state.py` — Singleton service instances
  - `database.py` — Supabase client and data access methods
  - `api/routes/` — FastAPI route definitions
  - `services/` — Business logic (identification, preprocessing)
  - `vision/` — Image processing and trait extraction modules
  - `repositories/` — Incomplete repository layer (unused)
- `reports/` — Technical reviews and documentation
  - `000_REVIEW.md` — Architecture review and findings

## Development

### Prerequisites
- Node.js (for frontend development)
- Python 3.11+ (for backend development)
- Supabase account (for database and authentication)
- Hugging Face API key (for inference services)

### Setup Commands
```bash
# Frontend
cd frontend
npm install
npm run dev   # Start development server

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload   # Start API server
```

### Environment Variables
- `VITE_API_BASE_URL` — Frontend API endpoint
- `SUPABASE_URL` and `SUPABASE_KEY` — Supabase connection
- `HUGGINGFACE_API_KEY` — Hugging Face inference access
- `API_KEY` — Internal API key for external access (when authentication enabled)

## Configuration

Configuration is managed through environment variables without exposing secrets in the repository:
- Frontend: `VITE_API_BASE_URL` points to backend API
- Backend: Supabase credentials and Hugging Face API key
- Authentication: API key validation (to be enabled in Phase 1)
- CORS: Configured origins for frontend-backend communication
- Rate limiting: Requests per minute per endpoint (to be enabled in Phase 1)

## Known Limitations / Technical Debt

Based on the 2026-07-29 technical review:
- **Critical/High**: API authentication implemented but unused; internal exceptions exposed in responses; health endpoints call missing database method; rate limiting not applied to routes
- **Medium**: Async routes execute blocking work; nondeterministic identification fallback; unused caching with mis-typed parameters; SQL injection risk in search filters; N+1 workload in filter counts; API contract drift between frontend and backend
- **Code Quality**: Dead code (unused imports, duplicate clients); debugging statements in production code; inconsistent configuration and validation
- **Security**: Public `/debug` directory access; lack of constant-time API key comparison
- **Performance**: Synchronous image analysis per request; non-shared daily quota; inefficient multi-colour filtering
- **Documentation**: Missing setup guide, environment variables, deployment configuration, API reference
- **Testing**: Minimal behavioural coverage; missing route tests, authentication tests, contract tests

## Contributing / Development Direction

Contributions are welcome to improve the platform's foundation and advance the botanical intelligence vision. Please focus on:
- Addressing known limitations in priority order
- Maintaining type safety and code quality
- Adding tests for new functionality
- Following the engineering roadmap phases
- Preserving the long-term vision of a specialised AI botanical platform

## Contact

- **Email**: mmuniiin@gmail.com
- **Twitter**: [@CalyxApp](https://twitter.com/CalyxIO)

## Project

[CALYX FLORA](https://calyxflora.space)
