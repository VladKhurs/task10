const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('task_10_db', 'root', '', {
    host: '127.0.0.1',
    port: 3307,
    dialect: 'mysql',
    logging: false
});

const User = sequelize.define('User', {
    login: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false }
});

const Flight = sequelize.define('Flight', {
    flightNumber: { type: DataTypes.STRING, allowNull: false },
    departurePlace: { type: DataTypes.STRING, allowNull: false },
    arrivalPlace: { type: DataTypes.STRING, allowNull: false },
    departureTime: { type: DataTypes.DATE, allowNull: false },
    arrivalTime: { type: DataTypes.DATE, allowNull: false }
});

const CrewMember = sequelize.define('CrewMember', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    middleName: { type: DataTypes.STRING, allowNull: true },
    profession: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true }
});

Flight.hasMany(CrewMember);
CrewMember.belongsTo(Flight);

const auth = (requiredRole) => async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'No token' });

    const user = await User.findByPk(token);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied' });
    }
    
    req.user = user;
    next();
};

app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const user = await User.findOne({ where: { login, password } });
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    res.json({ token: user.id, roleName: user.role });
});

app.get('/flights', async (req, res) => {
    const flights = await Flight.findAll({ include: CrewMember });
    res.json(flights);
});

app.post('/flights', auth('admin'), async (req, res) => {
    try {
        const flight = await Flight.create(req.body);
        res.json(flight);
    } catch (e) {
        res.status(500).json(e);
    }
});

app.put('/flights/:id', auth('admin'), async (req, res) => {
    try {
        await Flight.update(req.body, { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json(e);
    }
});

app.delete('/flights/:id', auth('admin'), async (req, res) => {
    try {
        await Flight.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json(e);
    }
});

app.post('/crew', auth('dispatcher'), async (req, res) => {
    try {
        const { flightId, ...data } = req.body;
        const member = await CrewMember.create({ ...data, FlightId: flightId });
        res.json(member);
    } catch (e) {
        res.status(500).json(e);
    }
});

app.put('/crew/:id', auth('dispatcher'), async (req, res) => {
    try {
        await CrewMember.update(req.body, { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json(e);
    }
});

app.delete('/crew/:id', auth('dispatcher'), async (req, res) => {
    try {
        await CrewMember.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json(e);
    }
});

const start = async () => {
    try {
        await sequelize.sync({ force: true });
        
        await User.bulkCreate([
            { login: 'admin', password: '123', role: 'admin' },
            { login: 'disp', password: '123', role: 'dispatcher' }
        ]);

        const flight1 = await Flight.create({
            flightNumber: 'SU-100',
            departurePlace: 'Moscow',
            arrivalPlace: 'Sochi',
            departureTime: new Date(),
            arrivalTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000)
        });

        await CrewMember.bulkCreate([
            { firstName: 'Ivan', lastName: 'Ivanov', profession: 'Pilot', FlightId: flight1.id },
            { firstName: 'Maria', lastName: 'Petrova', profession: 'Stewardess', FlightId: flight1.id }
        ]);

        app.listen(3000, () => console.log('Server started on port 3000'));
    } catch (e) {
        console.log(e);
    }
};

start();