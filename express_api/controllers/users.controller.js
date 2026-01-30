const User = require('../models/user.model');
const bcrypt = require('bcrypt');


const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const createUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = await new User({ ...req.body, password: hashedPassword }).save();
        res.status(200).json({ data: newUser, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const authUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
            return res.status(400).json({ message: 'Invalid password' });
        const token = user.generateAuthToken();
        res.status(200).json({ data: token, message: 'User authenticated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ user });
    } catch (error) { res.status(500).json({ message: error.message }); }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    authUser
}