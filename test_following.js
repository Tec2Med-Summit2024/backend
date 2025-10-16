const http = require('http');

// Test data - replace with actual test user credentials
const testToken = 'your_test_token_here'; // You'll need to get a valid token by logging in

// Test endpoints
const testEndpoints = [
  {
    name: 'Get following list',
    method: 'GET',
    path: '/api/users/following',
  },
  {
    name: 'Follow user testpartner',
    method: 'POST',
    path: '/api/users/follow/testpartner',
  },
  {
    name: 'Check if following testpartner',
    method: 'GET',
    path: '/api/users/following/testpartner',
  },
  {
    name: 'Unfollow user testpartner',
    method: 'DELETE',
    path: '/api/users/follow/testpartner',
  }
];

// Function to make HTTP request
const makeRequest = (endpoint) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 9999,
      path: endpoint.path,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        ...(testToken && { Authorization: `Bearer ${testToken}` })
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          endpoint: endpoint.name,
          status: res.statusCode,
          data: data ? JSON.parse(data) : null
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
      req.write(JSON.stringify({}));
    }

    req.end();
  });
};

// Run tests
async function runTests() {
  console.log('Starting Following API tests...\n');
  
  for (const endpoint of testEndpoints) {
    try {
      console.log(`Testing: ${endpoint.name}`);
      const result = await makeRequest(endpoint);
      console.log(`Status: ${result.status}`);
      console.log(`Response:`, JSON.stringify(result.data, null, 2));
      console.log('---\n');
    } catch (error) {
      console.error(`Error testing ${endpoint.name}:`, error.message);
      console.log('---\n');
    }
  }
  
  console.log('Tests completed!');
}

// Run the tests
runTests();