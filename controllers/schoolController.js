const db = require('../db');
const haversineDistance = require('../utils/haversineDistance');

exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Input validation
    if (!name || !address || typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    });
};

exports.listSchools = (req, res) => {
    const { latitude, longitude } = req.query;

    if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
        return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) throw err;

        // Sort schools by distance to the user's location
        const sortedSchools = results.map(school => {
            const distance = haversineDistance(userLat, userLon, school.latitude, school.longitude);
            return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    });
};
