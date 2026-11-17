import unittest
from app import app, registered_students

class StudentFormTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        registered_students.clear()

    def test_homepage_loads(self):
        """Test GET / renders the form successfully."""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Student Information Management System', response.data)
        self.assertIn(b'fullName', response.data)
        self.assertIn(b'studentId', response.data)

    def test_health_endpoint(self):
        """Test GET /health returns healthy status."""
        response = self.app.get('/health')
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertEqual(json_data['status'], 'healthy')
        self.assertEqual(json_data['service'], 'student-details-form')

    def test_submit_valid_student(self):
        """Test POST /api/submit with valid student details."""
        payload = {
            'fullName': 'Shruti Bhagavatham',
            'studentId': '21B91A0501',
            'email': 'shrutibhagavatham@gmail.com',
            'phone': '9876543210',
            'dob': '2003-05-15',
            'gender': 'Female',
            'department': 'Computer Science & Engineering',
            'year': '4th Year (Semester 7 & 8)',
            'address': 'Plot 42, Green Park Avenue, Hyderabad 500001'
        }
        response = self.app.post('/api/submit', json=payload)
        self.assertEqual(response.status_code, 201)
        json_data = response.get_json()
        self.assertTrue(json_data['success'])
        self.assertEqual(json_data['student']['fullName'], 'Shruti Bhagavatham')
        self.assertEqual(json_data['student']['studentId'], '21B91A0501')

    def test_submit_missing_mandatory_field(self):
        """Test POST /api/submit rejects request when mandatory fields are omitted."""
        payload = {
            'fullName': 'Test User',
            # studentId missing
            'email': 'test@college.edu',
            'phone': '9876543210'
        }
        response = self.app.post('/api/submit', json=payload)
        self.assertEqual(response.status_code, 400)
        json_data = response.get_json()
        self.assertFalse(json_data['success'])
        self.assertIn('Mandatory fields missing', json_data['error'])

    def test_submit_invalid_email(self):
        """Test POST /api/submit rejects invalid email format."""
        payload = {
            'fullName': 'Shruti',
            'studentId': '21B91A0502',
            'email': 'not-an-email',
            'phone': '9876543210',
            'dob': '2003-05-15',
            'gender': 'Female',
            'department': 'Information Technology',
            'year': '3rd Year',
            'address': 'Valid address line here'
        }
        response = self.app.post('/api/submit', json=payload)
        self.assertEqual(response.status_code, 400)
        json_data = response.get_json()
        self.assertIn('Invalid email', json_data['error'])

if __name__ == '__main__':
    unittest.main()
