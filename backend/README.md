# AutoPartsPro Backend — FastAPI

Kenya's automotive parts e-commerce backend API built with FastAPI, SQLAlchemy, and PostgreSQL.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | FastAPI 0.104 |
| Language | Python 3.11 |
| Database | PostgreSQL 15 |
| ORM | SQLAlchemy 2.0 |
| Auth | JWT (python-jose) |
| Password Hashing | Bcrypt |
| Server | Uvicorn |
| Containerization | Docker + Docker Compose |

## Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Clone and navigate to backend
cd backend

# 2. Start services
docker-compose up -d

# 3. Create database tables
docker-compose exec api alembic upgrade head
# OR (if using direct SQLAlchemy)
# The tables will be created automatically on first run

# 4. Open API docs
# http://localhost:8000/docs
```

### Option 2: Local Development

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment
cp .env.example .env
# Edit .env with your local database URL

# 4. Run server
python main.py
# Server runs on http://localhost:8000
```

## Project Structure

```
backend/
├── app/
│   ├── models/
│   │   ├── product.py      # Product, Category, ProductCompatibility
│   │   ├── user.py         # User, SavedVehicle, WishlistItem
│   │   ├── order.py        # Order, OrderItem
│   │   └── cart.py         # CartItem
│   │
│   ├── schemas/
│   │   ├── product.py      # Pydantic schemas for products
│   │   ├── user.py         # User schemas
│   │   ├── order.py        # Order schemas
│   │   └── cart.py         # Cart schemas
│   │
│   ├── routes/
│   │   ├── auth.py         # /api/auth (register, login)
│   │   ├── users.py        # /api/users (profile, saved vehicles)
│   │   ├── categories.py   # /api/categories
│   │   ├── products.py     # /api/products (list, search, detail)
│   │   ├── cart.py         # /api/cart (add, remove, update)
│   │   └── orders.py       # /api/orders (create, list, status)
│   │
│   ├── utils/
│   │   └── security.py     # JWT, password hashing
│   │
│   ├── database.py         # SQLAlchemy setup
│   ├── config.py           # Settings from environment
│   └── __init__.py
│
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
├── Dockerfile              # Container image
├── docker-compose.yml      # Local dev with PostgreSQL
└── README.md
```

## API Documentation

Once running, interactive docs available at:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Key Endpoints

### Authentication
```
POST   /api/auth/register      Register new user
POST   /api/auth/login         Login and get JWT token
GET    /api/auth/me            Get current user
```

### Products
```
GET    /api/products           List with filters/sorting
GET    /api/products/{id}      Get by ID
GET    /api/products/slug/{slug}  Get by slug
GET    /api/products/search    Search products
```

### Categories
```
GET    /api/categories         List all
GET    /api/categories/{id}    Get by ID
GET    /api/categories/slug/{slug}  Get by slug
```

### Cart
```
GET    /api/cart               Get user's cart
POST   /api/cart/items         Add to cart
PATCH  /api/cart/items/{id}    Update quantity
DELETE /api/cart/items/{id}    Remove item
DELETE /api/cart               Clear cart
```

### Orders
```
POST   /api/orders             Create order
GET    /api/orders             List user's orders
GET    /api/orders/{id}        Get order details
PATCH  /api/orders/{id}/status Update order status
```

### Users
```
GET    /api/users/profile      Get user profile
POST   /api/users/saved-vehicles  Add saved vehicle
GET    /api/users/saved-vehicles  List saved vehicles
DELETE /api/users/saved-vehicles/{id}  Delete vehicle
```

## Environment Variables

See `.env.example` for all variables. Key ones:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/autoparts
SECRET_KEY=your-super-secret-key
CORS_ORIGINS=["http://localhost:3000"]
MPESA_CONSUMER_KEY=your-key
MPESA_CONSUMER_SECRET=your-secret
```

## Database Migrations

When you change models, create a migration:

```bash
alembic revision --autogenerate -m "Add new field"
alembic upgrade head
```

## Next Steps

1. **Add database migrations** — Set up Alembic for schema versioning
2. **Wire frontend** — Update `src/lib/data.ts` in Next.js to call `/api/` endpoints
3. **M-Pesa integration** — Implement Safaricom Daraja payment flow
4. **Admin panel** — Create `/admin/` routes for product management
5. **Email notifications** — Add order confirmation emails
6. **Search optimization** — Add full-text search, faceted filters
7. **Caching** — Redis for frequently accessed data
8. **Deployment** — Railway, Render, or AWS

## Testing

```bash
# Run tests (when test suite is added)
pytest
pytest --cov  # With coverage
```

## Troubleshooting

### PostgreSQL connection error
```
Check DATABASE_URL in .env
Ensure PostgreSQL service is running
docker-compose logs db
```

### Port 8000 already in use
```bash
# Change port in docker-compose.yml or use:
uvicorn main:app --port 8001
```

### Alembic migration issues
```bash
alembic current  # Check current version
alembic history  # View migration history
alembic downgrade -1  # Rollback one version
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

Private project — AutoPartsPro
