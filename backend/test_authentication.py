from fastapi.testclient import TestClient

from backend import auth
from backend.dependencies import get_db, get_vision
from backend.main import app


class FakeDatabase:
    async def get_species_count(self):
        return 1

    def is_connected(self):
        return True

    async def text_search(self, query, limit):
        return []


class FakeVision:
    def is_loaded(self):
        return True


def test_health_routes_remain_public_and_api_routes_require_a_key(monkeypatch):
    monkeypatch.setattr(auth, "API_KEY", "test-api-key")
    app.dependency_overrides[get_db] = lambda: FakeDatabase()
    app.dependency_overrides[get_vision] = lambda: FakeVision()

    try:
        client = TestClient(app)

        assert client.get("/").status_code == 200
        assert client.get("/health").status_code == 200
        assert client.get("/api/v1/search?q=rose").status_code == 401

        response = client.get(
            "/api/v1/search?q=rose",
            headers={"Authorization": "Bearer test-api-key"},
        )
        assert response.status_code == 200
        assert response.json() == []
    finally:
        app.dependency_overrides.clear()
