import os
os.environ['DATABASE_URL'] = 'sqlite:///./test.db'
os.environ['SECRET_KEY'] = 'test-secret-key-123456'

from fastapi.testclient import TestClient
from main import app


def test_health():
    with TestClient(app) as client:
        response = client.get('/health')
        assert response.status_code == 200
        assert response.json() == {'status': 'healthy'}


def test_products_endpoint_empty_database():
    with TestClient(app) as client:
        response = client.get('/api/products/')
        assert response.status_code == 200
        assert response.json()['items'] == []
