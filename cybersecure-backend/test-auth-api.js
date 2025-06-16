const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test credentials - we'll use the default admin user from seed data
const TEST_USER = {
  username: 'admin@cybersecure.com', // Can use email as username
  password: 'password123' // Default password from seed data
};

async function testAuthentication() {
  console.log('🔐 Testing Authentication & Dashboard API...\n');

  try {
    // Step 1: Login to get authentication token
    console.log('1. Attempting to login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, TEST_USER);
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    
    console.log('✅ Login successful!');
    console.log(`   User: ${user.name} (${user.email})`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Token: ${token.substring(0, 20)}...`);
    console.log('');

    // Step 2: Test dashboard stats with authentication
    console.log('2. Testing dashboard stats with authentication...');
    const dashboardResponse = await axios.get(`${BASE_URL}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Dashboard API successful!');
    console.log('   Dashboard Stats:');
    console.log(`   - Total Users: ${dashboardResponse.data.totalUsers}`);
    console.log(`   - Total Incidents: ${dashboardResponse.data.totalIncidents}`);
    console.log(`   - Total Assets: ${dashboardResponse.data.totalAssets}`);
    console.log(`   - Open Incidents: ${dashboardResponse.data.openIncidents}`);
    console.log(`   - High Risk Assets: ${dashboardResponse.data.highRiskAssets}`);
    console.log('');

    // Step 3: Test incidents API
    console.log('3. Testing incidents API...');
    const incidentsResponse = await axios.get(`${BASE_URL}/incidents`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Incidents API successful!');
    console.log(`   Found ${incidentsResponse.data.length} incidents`);
    if (incidentsResponse.data.length > 0) {
      console.log(`   First incident: ${incidentsResponse.data[0].title}`);
    }
    console.log('');

    // Step 4: Test assets API
    console.log('4. Testing assets API...');
    const assetsResponse = await axios.get(`${BASE_URL}/assets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Assets API successful!');
    console.log(`   Found ${assetsResponse.data.length} assets`);
    if (assetsResponse.data.length > 0) {
      console.log(`   First asset: ${assetsResponse.data[0].name}`);
    }
    console.log('');

    // Step 5: Test users API
    console.log('5. Testing users API...');
    const usersResponse = await axios.get(`${BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Users API successful!');
    console.log(`   Found ${usersResponse.data.length} users`);
    console.log('');

    console.log('🎉 All API tests passed! The backend is working correctly.');
    console.log('   The issue is likely that the frontend is not sending the authentication token.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   💡 Make sure the backend server is running on port 3000');
    }
  }
}

// Run the test
testAuthentication();
