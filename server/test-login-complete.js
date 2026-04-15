#!/usr/bin/env node

/**
 * Complete login test - mimics what the frontend does
 * Tests the entire auth flow with proper error handling
 */

const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(responseBody)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: responseBody
          });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

async function testLogin() {
  console.log('\n🧪 COMPLETE LOGIN TEST\n');
  console.log('Testing: http://localhost:5000/api/auth/login\n');

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const testCases = [
    {
      name: 'Admin Login (Valid)',
      data: { login_id: 'ADMIN-001', password: 'password123' },
      expectSuccess: true
    },
    {
      name: 'Student Login (Valid)',
      data: { login_id: 'STU-001', password: 'password123' },
      expectSuccess: true
    },
    {
      name: 'Invalid Login ID',
      data: { login_id: 'INVALID-123', password: 'password123' },
      expectSuccess: false
    },
    {
      name: 'Invalid Password',
      data: { login_id: 'ADMIN-001', password: 'wrongpassword' },
      expectSuccess: false
    },
    {
      name: 'Missing login_id',
      data: { password: 'password123' },
      expectSuccess: false
    }
  ];

  for (const testCase of testCases) {
    console.log(`📝 Test: ${testCase.name}`);
    console.log(`   Data: ${JSON.stringify(testCase.data)}`);

    try {
      const response = await makeRequest(options, testCase.data);

      const isSuccess = response.status === 200;
      const passed = isSuccess === testCase.expectSuccess;

      console.log(`   Status: ${response.status}`);
      if (response.body.data?.token) {
        console.log(`   Token: ${response.body.data.token.substring(0, 20)}...`);
      }
      if (response.body.message) {
        console.log(`   Message: ${response.body.message}`);
      }
      console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    } catch (error) {
      console.log(`   Error: ${error.message}`);
      console.log(`   Result: ❌ FAIL`);
    }
    console.log();
  }

  console.log('tests complete!\n');
}

testLogin().catch(console.error);
