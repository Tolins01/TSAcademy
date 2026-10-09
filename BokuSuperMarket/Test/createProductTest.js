const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function run() {
  // 1. Log in first to get a real token
  // Replace with an email/password that ACTUALLY exists in your MongoDB users collection
  const loginRes = await axios.post('http://localhost:8000/users/loginuser', {
    email: 'rotymivictor95@gmail.com',   // <-- replace with your real test user's email
    password: 'coledazdaz'       // <-- replace with your real test user's password
  });

  console.log('LOGIN RESPONSE:', loginRes.data);

  const token = loginRes.data.token;

  if (!token) {
    throw new Error('No token returned from login — check credentials or login route');
  }

  // 2. Build the product form data
  const data = new FormData();
  data.append('name', 'Beans');
  data.append('size', '10kg');
  data.append('description', 'parboiled rice');
  data.append('color', 'white');
  data.append('image', fs.createReadStream('"C:\Users\Victor Ilori\Desktop\Dell_Folder\NC\3d Candy -1.png"'));
  data.append('price', '$5');
  data.append('quantity', '2 paints');

  // 3. Create the product using the real token
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:8000/products/createproduct',
    headers: {
      'Authorization': 'Bearer ' + token, // NOTE: no extra quotes around the token
      ...data.getHeaders()
    },
    data
  };

  const response = await axios.request(config);
  console.log('CREATE PRODUCT RESPONSE:', JSON.stringify(response.data));
}

run().catch((error) => {
  if (error.response) {
    // Server responded with an error status
    console.log('ERROR STATUS:', error.response.status);
    console.log('ERROR DATA:', error.response.data);
  } else {
    // Request never got a response (network issue, server down, etc.)
    console.log('ERROR:', error.message);
  }
});