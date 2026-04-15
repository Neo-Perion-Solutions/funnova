const axios = require('axios');
require('dotenv').config();

async function testLogin() {
  console.log('🧪 Testing Login API\n');

  try {
    console.log('1️⃣ Testing Admin Login...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      login_id: 'ADMIN-001',
      password: 'password123'
    });

    console.log('   ✅ LOGIN SUCCESSFUL!\n');
    console.log('Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('   ❌ LOGIN FAILED\n');
    console.log('Error Status:', error.response?.status);
    console.log('Error Message:', error.response?.data?.message);
    console.log('Full Error:', JSON.stringify(error.response?.data, null, 2));
  }
}

testLogin();
