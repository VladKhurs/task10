const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes, Op } = require('sequelize');

const app = express();

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize('test_task_db', 'root', '', {
    host: 'localhost',
    host: '127.0.0.1',
    port: 3307,
    dialect: 'mysql',
});
