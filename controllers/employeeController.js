// controllers/employeeController.js
const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Admin only)
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('user', 'email');
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private (Admin only)
exports.createEmployee = async (req, res) => {
    const { name, age, salary, bonus, email, role, password, image } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        const user = await User.create({
            username: name,
            email,
            password,
            role: 'employee' // This role is fixed for all new employees
        });

        const employee = await Employee.create({
            name,
            age,
            salary,
            bonus,
            role,
            image,
            user: user._id
        });

        res.status(201).json(employee);
    } catch (error) {
        // Handle validation errors from the Employee and User models
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private (Admin only)
exports.updateEmployee = async (req, res) => {
    const { name, age, salary, bonus, email, role, image } = req.body;

    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update User email if it has changed
        if (employee.user && email !== employee.user.email) {
            const user = await User.findById(employee.user._id);
            if (user) {
                user.email = email;
                user.username = name;
                await user.save();
            }
        }

        employee.name = name || employee.name;
        employee.age = age || employee.age;
        employee.salary = salary || employee.salary;
        employee.bonus = bonus || employee.bonus;
        employee.role = role || employee.role;
        employee.image = image || employee.image;

        await employee.save();
        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin only)
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Deleting the employee profile. The associated user account is NOT affected.
        // This is the key change to align with your requirement.
        await Employee.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Employee profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }


};