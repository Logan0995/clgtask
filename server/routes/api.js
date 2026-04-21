const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Book = require('../models/Book');
const Request = require('../models/Request');
const History = require('../models/History');
const Recommendation = require('../models/Recommendation');

// --- Seed Data Endpoint (Optional utility) ---
router.post('/seed', async (req, res) => {
    try {
        const bookCount = await Book.countDocuments();
        if (bookCount === 0) {
            const defaultBooks = [
                { id: 'B002', title: 'Calculus: Early Transcendentals', author: 'James Stewart', category: 'Mathematics', status: 'Issued', issuedTo: 'S001', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), coverUrl: 'books/cc.jpg' },
                { id: 'B003', title: 'University Physics', author: 'Young and Freedman', category: 'Physics', status: 'Available', issuedTo: null, dueDate: null, coverUrl: 'books/phy.jpg' },
                { id: 'B012', title: 'Wings of Fire', author: 'Abdul Kalam', category: 'Biography', status: 'Available', issuedTo: null, dueDate: null, coverUrl: 'books/apj.jpg' },
                { id: 'B005', title: 'Why I am an Athiest', author: 'Bhagat Singh', category: 'Philosophy', status: 'Available', issuedTo: null, dueDate: null, coverUrl: 'books/why i am an athiest.jpg' },
                { id: 'B007', title: 'The Invisible Man', author: 'H.G.Wells', category: 'Science Fiction', status: 'Available', issuedTo: null, dueDate: null, coverUrl: 'books/im.jpg' },
                { id: 'B008', title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Fiction', status: 'Available', issuedTo: null, dueDate: null, coverUrl: 'books/pp.jpg' },
                { id: 'B001', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Software Engineering', status: 'Available', issuedTo: null, dueDate: null, coverUrl: 'https://m.media-amazon.com/images/I/51W1sBPO7tL._AC_UY327_FMwebp_QL65_.jpg' },
                { id: 'B006', title: 'Moon Walk', author: 'Michael Jackson', category: 'Biography', status: 'Available', issuedTo: null, dueDate: null, coverUrl: 'books/mj.jpg' },
                { id: 'B009', title: 'The Dairy of a young girl', author: 'Anne Frank', category: 'History', status: 'Available', issuedTo: null, dueDate: null, coverUrl: 'books/af.jpg' },
                { id: 'B0010', title: '20000 Leagues under the Sea', author: 'Jules Verne', category: 'Science Fiction', status: 'Available', issuedTo: null, dueDate: null, coverUrl: 'books/20kl.jpg' }
            ];
            await Book.insertMany(defaultBooks);
        }

        const memberCount = await User.countDocuments();
        if (memberCount === 0) {
            const defaultMembers = [
                { name: 'Ananya Sharma', id: 'S001', role: 'Student', password: 'password123' },
                { name: 'Dr. R. Mehta', id: 'F001', role: 'Faculty', password: 'password123' },
                { name: 'Admin', id: 'admin', role: 'admin', password: 'admin' },
                { name: 'Librarian', id: 'librarian', role: 'librarian', password: 'librarian' }
            ];
            await User.insertMany(defaultMembers);
        }
        res.json({ message: 'Database seeded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Auth Routes ---
router.post('/login', async (req, res) => {
    try {
        const { id, password, role } = req.body;
        const user = await User.findOne({ id });
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.password !== password) return res.status(401).json({ error: 'Invalid password' });
        if (role && role !== 'Select Role' && user.role.toLowerCase() !== role.toLowerCase()) {
             return res.status(403).json({ error: 'Invalid role' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- Books Routes ---
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/books', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/books/:id', async (req, res) => {
    try {
        await Book.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Members/Users Routes ---
router.get('/members', async (req, res) => {
    try {
        const members = await User.find({ role: { $in: ['Student', 'Faculty'] } });
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/members', async (req, res) => {
    try {
        const member = new User(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/members/:id', async (req, res) => {
    try {
        await User.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Member deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Requests Routes ---
router.get('/requests', async (req, res) => {
    try {
        const requests = await Request.find();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/requests', async (req, res) => {
    try {
        const request = new Request(req.body);
        await request.save();
        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/requests/:id', async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(request);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/requests/:id', async (req, res) => {
    try {
        await Request.findByIdAndDelete(req.params.id);
        res.json({ message: 'Request deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- History Routes ---
router.get('/history', async (req, res) => {
    try {
        const history = await History.find();
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/history', async (req, res) => {
    try {
        const history = new History(req.body);
        await history.save();
        res.status(201).json(history);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- Recommendations Routes ---
router.get('/recommendations', async (req, res) => {
    try {
        const recommendations = await Recommendation.find();
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/recommendations', async (req, res) => {
    try {
        const rec = new Recommendation(req.body);
        await rec.save();
        res.status(201).json(rec);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
