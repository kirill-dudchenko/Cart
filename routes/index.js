const express = require('express');
const Ajv = require('ajv');
const router = express.Router();

const ajv = new Ajv();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/product/list', (req, res) => {

  const items = [
    {id: 'ag3', name: 'Троянды', price: 500 },
    {id: 'd23', name: 'Гладиолусы', price: 600 },
    {id: 'fc5', name: 'Пестики', price: 700 },
    {id: 'h17', name: 'Мак', price: 120 }
  ];

  res.json(items);

});

module.exports = router;
