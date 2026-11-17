import os
import re
from datetime import datetime, timezone
from flask import Flask, render_template, request, jsonify

app = Flask(__name__, static_folder='static', template_folder='templates')

# In-memory database of registered students
registered_students = []

@app.route('/')
def index():
    """Renders the main student details collection form."""
    return render_template('index.html')

@app.route('/health')
def health():
    """Healthcheck endpoint for Docker container and Jenkins pipeline verification."""
    return jsonify({
        'status': 'healthy',
        'service': 'student-details-form',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'registered_count': len(registered_students)
    }), 200

@app.route('/api/submit', methods=['POST'])
def submit_student():
    """Receives and validates student details payload."""
    data = request.get_json(silent=True) or request.form.to_dict()

    if not data:
        return jsonify({'success': False, 'error': 'No input data provided'}), 400

    # Mandatory fields
    mandatory_fields = ['fullName', 'studentId', 'email', 'phone', 'dob', 'gender', 'department', 'year', 'address']
    missing = [f for f in mandatory_fields if not data.get(f) or not str(data.get(f)).strip()]
    if missing:
        return jsonify({
            'success': False,
            'error': f'Mandatory fields missing: {", ".join(missing)}'
        }), 400

    # Format validations
    email = data.get('email', '').strip()
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
        return jsonify({'success': False, 'error': 'Invalid email address format'}), 400

    phone = re.sub(r'\D', '', data.get('phone', ''))
    if len(phone) != 10:
        return jsonify({'success': False, 'error': 'Mobile number must be 10 digits'}), 400

    student_record = {
        'id': len(registered_students) + 1,
        'fullName': data.get('fullName').strip(),
        'studentId': data.get('studentId').strip(),
        'email': email,
        'phone': phone,
        'dob': data.get('dob'),
        'gender': data.get('gender'),
        'department': data.get('department'),
        'year': data.get('year'),
        'address': data.get('address').strip(),
        'registeredAt': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
    }

    registered_students.append(student_record)

    return jsonify({
        'success': True,
        'message': 'Student details successfully registered and validated!',
        'student': student_record
    }), 201

@app.route('/api/students', methods=['GET'])
def list_students():
    """Returns all registered student records."""
    return jsonify({
        'total': len(registered_students),
        'students': registered_students
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
