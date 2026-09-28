# AutoPartsPro Backend

## Run locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

## Run tests

```bash
cd backend
pytest
```

## Database migrations

```bash
cd backend
alembic upgrade head
```

The application retains startup table creation for local development. Production deployments should run migrations before starting the API and use a strong `SECRET_KEY`.
