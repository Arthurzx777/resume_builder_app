import unittest
import os
import sys

# Add the project root to the Python path to allow imports from src
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, project_root)

from src.main import app # Import your Flask app instance
from src.routes.pdf_generator import generate_resume_html # Import the HTML generation logic if you want to test it separately

class PDFGenerationTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_generate_pdf_endpoint_success(self):
        # Mock data similar to what the frontend would send
        mock_resume_data = {
            "fullName": "João da Silva Teste",
            "email": "joao.teste@example.com",
            "phone": "(11) 99999-8888",
            "summary": "Profissional dedicado com experiência em testes.",
            "experiences": [
                {"jobTitle": "Analista de Testes", "company": "Empresa Teste", "period": "Jan 2020 - Atual"}
            ],
            "education": [
                {"institution": "Universidade Teste", "course": "Ciência da Computação", "period": "2015 - 2019"}
            ],
            "skills": "Python, Flask, WeasyPrint, Testes Automatizados"
        }
        payload = {
            "resumeData": mock_resume_data,
            "templateId": "template1"
        }

        response = self.app.post("/api/pdf/generate", json=payload)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.mimetype, "application/pdf")
        self.assertIn("attachment; filename=curriculo_João_da_Silva_Teste.pdf", response.headers["Content-Disposition"])
        self.assertTrue(len(response.data) > 1000) # Check if PDF content is not empty (basic check)

    def test_generate_pdf_endpoint_missing_data(self):
        payload = {
            "templateId": "template1"
            # Missing resumeData
        }
        response = self.app.post("/api/pdf/generate", json=payload)
        self.assertEqual(response.status_code, 400)
        json_data = response.get_json()
        self.assertIn("Dados do currículo ausentes", json_data.get("error"))

    def test_generate_resume_html_structure(self):
        # Test the HTML generation logic separately if needed
        mock_data = {"fullName": "Maria Testadora", "email": "maria@test.com"}
        html_content, css_string = generate_resume_html("template1", mock_data, None, None)
        self.assertIn("<title>Currículo - Maria Testadora</title>", html_content)
        self.assertIn("<h1>Maria Testadora</h1>", html_content)
        self.assertIn("body {", css_string) # Check if basic CSS is present

if __name__ == '__main__':
    unittest.main()

