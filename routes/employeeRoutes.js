// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getEmployees, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee 
} = require('../controllers/employeeController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, isAdmin, getEmployees)
    .post(protect, isAdmin, createEmployee);

router.route('/:id')
    .put(protect, isAdmin, updateEmployee)
    .delete(protect, isAdmin, deleteEmployee);

module.exports = router;