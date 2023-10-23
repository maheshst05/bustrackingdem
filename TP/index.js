const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gobusfb-default-rtdb.firebaseio.com/',
});

const database = admin.database();
const usersRef = database.ref('users');

const app = express();
app.use(bodyParser.json());

// Create a new user
app.post('/users', (req, res) => {
  const userData = req.body;
  usersRef.push(userData, (error) => {
    if (error) {
      res.status(500).send('Error creating user');
    } else {
      res.status(201).send('User created successfully');
    }
  });
});

// Read all users
app.get('/users', (req, res) => {
  usersRef.once('value', (snapshot) => {
    const users = snapshot.val();
    res.json(users);
  });
});

// Read a specific user by ID
app.get('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  usersRef.child(userId).once('value', (snapshot) => {
    const user = snapshot.val();
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  });
});

// Update a user by ID
app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const userData = req.body;

  usersRef.child(userId).update(userData, (error) => {
    if (error) {
      res.status(500).send('Error updating user');
    } else {
      res.status(200).send('User updated successfully');
    }
  });
});

// Delete a user by ID
app.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  usersRef.child(userId).remove((error) => {
    if (error) {
      res.status(500).send('Error deleting user');
    } else {
      res.status(204).send('User deleted successfully');
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
