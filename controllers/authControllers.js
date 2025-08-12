const User = require('../models/User'); // Mongoose User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword, 
            role: role || 'user' // Default to 'user' if not specified
        });
        await newUser.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc Authenticate user and get token
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        // We must explicitly select the password field for comparison
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 2. Compare the provided password with the stored hash
        // The error was here because user.password was undefined
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // 3. Create a JWT payload and sign the token
        const payload = { 
            id: user._id, 
            role: user.role 
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // 4. Exclude the password before sending the user object in the response
        const userWithoutPassword = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        // 5. Send the token and the user object
        res.json({ token, user: userWithoutPassword });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc Get the currently authenticated user's profile
 * @route GET /api/auth/me
 * @access Private
 */
exports.getProfile = async (req, res) => {
    try {
        // The `protect` middleware attaches the decoded user payload to `req.user`
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc Get all users (admin only)
 * @route GET /api/auth/users
 * @access Private/Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc Delete a user (admin only)
 * @route DELETE /api/auth/user/:id
 * @access Private/Admin
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * @desc Update a user (admin only)
 * @route PUT /api/auth/users/:id
 * @access Private/Admin
 */
exports.updateUser = async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, role },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};


exports.getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        console.error(error);
        return null; // Return null if the user is not found or an error occurs
    }
};
