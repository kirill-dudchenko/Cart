const express = require('express')
var path = require('path');

const server = express()

const indexRouter = require('./routes/index');
const orderRouter = require('./routes/order')

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');

server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, 'public')));

server.use('/', indexRouter);
server.use('/order', orderRouter)

server.listen(3000)
