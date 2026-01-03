const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dayflow_hrms');
        console.log('MongoDB Connected');

        const adminEmail = 'admin@gmail.com';
        const adminPassword = 'admin'; // Will be hashed by pre-save hook

        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const user = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: adminPassword,
            role: 'ADMIN',
        });

        console.log(`Admin user created: ${user.email}`);
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
