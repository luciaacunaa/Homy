import pytest
from app import app as flask_app # importa directamente el objeto Flask
import os
import sys
# Agregar la carpeta raíz (Homy) al path de Python
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

@pytest.fixture
def client():
    flask_app.config.update(TESTING= True)
    with flask_app.test_client() as client:
        yield client
