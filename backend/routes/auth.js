const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const store = require('../data/store');

const JWT_SECRET = process.env.JWT_SECRET || 'anganwadi_super_secret_key_2026';

// Demo Login or Email/Password Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = null;

    // Fast 1-click role switcher login
    if (role && (!email || !password)) {
      user = store.data.users.find(u => u.role === role);
    } else if (email) {
      user = store.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && password && user.password !== password) {
        return res.status(401).json({ message: 'Invalid password' });
      }
    }

    if (!user) {
      // Default to worker if nothing matched
      user = store.data.users[0];
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, centerId: user.centerId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        centerId: user.centerId,
        centerName: user.centerName,
        phone: user.phone,
        designation: user.designation || (user.role === 'supervisor' ? 'Supervisor (CDPO)' : 'Anganwadi Worker (AWW)')
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, centerId, phone } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existing = store.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const center = store.getCenterById(centerId);

    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      password: password || 'pass123',
      role: role || 'worker',
      centerId: centerId || 'aw-102',
      centerName: center ? `${center.name} (${center.code})` : 'Rampur Anganwadi',
      phone: phone || ''
    };

    store.data.users.push(newUser);
    store.saveToFile();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, centerId: newUser.centerId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: newUser
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Current user profile
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = store.data.users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports = router;
