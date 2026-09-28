# AutoPartsPro

Kenya-focused automotive parts marketplace with a Next.js frontend and FastAPI backend.

## Project structure

- `src/` — Next.js 14 App Router frontend
- `backend/` — FastAPI, SQLAlchemy, PostgreSQL API
- `backend/tests/` — backend smoke tests

## Frontend setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

The frontend runs at `http://localhost:3000`. Set `NEXT_PUBLIC_API_URL` in `.env.local` to the backend URL when it is not `http://localhost:8000`.

Useful commands:

```bash
npm run type-check
npm run lint
npm run build
```

## Backend setup with Docker

```bash
cd backend
docker compose up --build
```

The API runs at `http://localhost:8000`; interactive documentation is available at `/docs`.

## Backend setup locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn main:app --reload
```

Use a strong `SECRET_KEY` and a real PostgreSQL `DATABASE_URL` outside local development. The API supports SQLite for lightweight local tests.

## Main API endpoints

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/categories/`
- `GET /api/products/`
- `GET /api/products/search?q=...`
- `GET /api/products/slug/{slug}`
- `GET /api/cart/`
- `POST /api/cart/items`
- `POST /api/orders/`
- `GET /api/orders/`
- `POST /api/users/saved-vehicles`

Order status changes require an authenticated administrator.

## Testing

```bash
cd backend
pytest
```

For frontend validation, run `npm run type-check` and `npm run build` before opening a pull request.

## Configuration

Backend variables are documented in `backend/.env.example`. Frontend configuration is documented in `.env.local.example`. Never commit `.env`, `.env.local`, credentials, payment keys, or production secrets.

## Development notes

- Product data is loaded from the backend on the shop and product-detail pages.
- The cart remains available locally through Zustand and local storage.
- Checkout currently validates delivery details and payment selection in the UI. Payment-provider submission and authenticated order creation should be enabled only after the authentication/session flow is connected.
- M-Pesa credentials belong only in the backend environment.
