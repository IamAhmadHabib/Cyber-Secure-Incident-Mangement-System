console.log('Testing dashboard API...');

// Test without fetch - using simple HTTP request
const http = require('http');

const testLogin = () => {
  const postData = JSON.stringify({
    username: 'admin',
    password: 'Admin123!'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Login response:', JSON.parse(data));
    });
  });

  req.on('error', (e) => {
    console.error('Login error:', e.message);
  });

  req.write(postData);
  req.end();
};

testLogin();
