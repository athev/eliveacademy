require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Fallback logic for clean URLs (optional, but good if we remove .html extensions later)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// API Endpoint to handle 'Contact / Capability Test' form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, phone, email, position, course, note } = req.body;
        
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required' });
        }

        const lead = await prisma.lead.create({
            data: {
                name,
                phone,
                email,
                position,
                course,
                note,
                type: 'contact'
            }
        });

        res.status(200).json({ success: true, message: 'Register capability test success', data: lead });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// API Endpoint to handle 'Course Registration' form
app.post('/api/register', async (req, res) => {
    try {
        const { name, phone, email, course, note } = req.body;
        
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: 'Name and phone are required' });
        }

        const lead = await prisma.lead.create({
            data: {
                name,
                phone,
                email,
                course,
                note,
                type: 'register'
            }
        });

        res.status(200).json({ success: true, message: 'Course registration success', data: lead });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
