const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('travel_agency_db', 'root', '', {
    host: '127.0.0.1',
    port: 3307,
    dialect: 'mysql',
    logging: false
});

const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    surname: { type: DataTypes.STRING },
    patronymic: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    balance: { type: DataTypes.FLOAT, defaultValue: 0 }
});

const Tour = sequelize.define('Tour', {
    name: { type: DataTypes.STRING, allowNull: false },
    dateStart: { type: DataTypes.STRING, allowNull: false },
    dateEnd: { type: DataTypes.STRING, allowNull: false },
    origin: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    tour_type: { type: DataTypes.STRING, allowNull: false },
    isHot: { type: DataTypes.BOOLEAN, defaultValue: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    discountPrice: { type: DataTypes.FLOAT, allowNull: true }
});

const Order = sequelize.define('Order', {});

User.hasMany(Order);
Order.belongsTo(User);
Tour.hasMany(Order);
Order.belongsTo(Tour);

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'No token' });

    const [id, role] = token.split('-');
    const user = await User.findByPk(id);

    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user;
    next();
};

const checkRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

app.post('/register', async (req, res) => {
    try {
        const { email, password, name, surname, patronymic, phone } = req.body;
        const user = await User.create({
            email, password, name, surname, patronymic, phone, role: 'customer', balance: 0
        });
        res.json({ message: 'Registered successfully' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email, password } });

        if (!user) return res.status(400).json({ message: 'User not found' });

        const orders = await Order.findAll({ where: { UserId: user.id } });
        const purchasedTourIds = orders.map(o => o.TourId);

        res.json({
            token: `${user.id}-${user.role}`,
            roleName: user.role,
            purchasedTourIds
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.get('/tours', async (req, res) => {
    const tours = await Tour.findAll();
    res.json(tours);
});

app.post('/tours', authMiddleware, checkRole('agent'), async (req, res) => {
    try {
        const tour = await Tour.create(req.body);
        res.json(tour);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.put('/tours/:id', authMiddleware, checkRole('agent'), async (req, res) => {
    try {
        await Tour.update(req.body, { where: { id: req.params.id } });
        res.json({ message: 'Updated' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.delete('/tours/:id', authMiddleware, checkRole('agent'), async (req, res) => {
    try {
        await Tour.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/balance', authMiddleware, checkRole('agent'), async (req, res) => {
    try {
        const { userId, amount } = req.body;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.balance += Number(amount);
        await user.save();
        res.json({ message: 'Balance updated', balance: user.balance });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.get('/orders', authMiddleware, checkRole('agent'), async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [User, Tour]
        });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/buy', authMiddleware, checkRole('customer'), async (req, res) => {
    try {
        const { tourId } = req.body;
        const tour = await Tour.findByPk(tourId);

        if (!tour) return res.status(404).json({ message: 'Tour not found' });

        const priceToPay = tour.discountPrice || tour.price;

        if (req.user.balance < priceToPay) {
            return res.status(400).json({ message: 'Недостаточно средств на счете' });
        }

        req.user.balance -= priceToPay;
        await req.user.save();

        await Order.create({ UserId: req.user.id, TourId: tour.id });

        res.json({ message: 'Tour purchased', tourId: tour.id });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });

        await User.create({
            email: 'agent@mail.com',
            password: 'admin',
            role: 'agent',
            name: 'Дмитрий',
            surname: 'Петров',
            balance: 0
        });

        await User.create({
            email: 'user@mail.com',
            password: '123',
            role: 'customer',
            name: 'Иван',
            surname: 'Иванов',
            balance: 50000
        });

        await Tour.bulkCreate([
            {
                name: 'Египет Все Включено',
                dateStart: '2026-03-01',
                dateEnd: '2026-03-10',
                origin: 'Минск',
                destination: 'Хургада',
                tour_type: 'Отдых',
                isHot: true,
                price: 45000,
                discountPrice: 39000
            },
            {
                name: 'Шоппинг в Милане',
                dateStart: '2026-04-10',
                dateEnd: '2026-04-15',
                origin: 'Минск',
                destination: 'Милан',
                tour_type: 'Шоппинг',
                isHot: false,
                price: 80000,
                discountPrice: null
            },
            {
                name: 'Экскурсия по Парижу',
                dateStart: '2026-05-01',
                dateEnd: '2026-05-07',
                origin: 'Минск',
                destination: 'Париж',
                tour_type: 'Экскурсия',
                isHot: false,
                price: 120000,
                discountPrice: 100000
            },
            {
                name: 'Турция Анталья',
                dateStart: '2026-06-15',
                dateEnd: '2026-06-25',
                origin: 'Минск',
                destination: 'Анталья',
                tour_type: 'Отдых',
                isHot: true,
                price: 60000,
                discountPrice: 55000
            }
        ]);

        app.listen(3000, () => console.log('Server started on port 3000'));
    } catch (e) {
        console.log(e);
    }
};

start();
