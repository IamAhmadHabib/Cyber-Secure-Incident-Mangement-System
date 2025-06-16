const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testIncidentsAPI() {
  try {
    console.log('🔐 Testing Incidents API...');
    
    // 1. Login first
    console.log('1. Attempting to login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data);
      return;
    }
    
    console.log('✅ Login successful');
    const token = loginResponse.data.token;
    
    // 2. Test incidents API
    console.log('2. Testing incidents API...');
    const incidentsResponse = await axios.get(`${API_BASE_URL}/api/incidents`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Incidents API Response:');
    console.log('Success:', incidentsResponse.data.success);
    console.log('Data structure:', Object.keys(incidentsResponse.data.data || {}));
    console.log('Incidents array length:', incidentsResponse.data.data?.incidents?.length || 0);
    
    if (incidentsResponse.data.data?.incidents?.length > 0) {
      console.log('First incident:', incidentsResponse.data.data.incidents[0]);
    }
    
    // 3. Test assets API
    console.log('3. Testing assets API...');
    const assetsResponse = await axios.get(`${API_BASE_URL}/api/assets`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Assets API Response:');
    console.log('Success:', assetsResponse.data.success);
    console.log('Data structure:', Object.keys(assetsResponse.data.data || {}));
    console.log('Assets array length:', assetsResponse.data.data?.assets?.length || 0);
    
    if (assetsResponse.data.data?.assets?.length > 0) {
      console.log('First asset:', assetsResponse.data.data.assets[0]);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testIncidentsAPI();
