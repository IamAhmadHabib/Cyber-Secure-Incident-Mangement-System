// Simple test to check if API is working
const testAPI = async () => {
  try {
    console.log('Testing API endpoint...');
    
    // First, let's login to get a token
    console.log('Step 1: Logging in...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },      body: JSON.stringify({
        username: 'admin',
        password: 'Admin123!'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response data:', loginData);
    
    if (loginData.success && loginData.token) {
      // Now test the dashboard endpoint with the token
      console.log('Step 2: Testing dashboard endpoint with token...');
      const dashboardResponse = await fetch('http://localhost:3000/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      console.log('Dashboard response status:', dashboardResponse.status);
      const dashboardData = await dashboardResponse.json();
      console.log('Dashboard response data:', JSON.stringify(dashboardData, null, 2));
    }
    
  } catch (error) {
    console.error('API Test Error:', error);
  }
};

testAPI();
