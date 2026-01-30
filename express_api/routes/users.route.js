const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, updateUser, deleteUser, authUser } = require('../controllers/users.controller');

router.get('/', getUsers);

router.get('/:id', getUserById);

// Create a new user
router.post('/', createUser);

// Authenticate user
router.post('/auth', authUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;