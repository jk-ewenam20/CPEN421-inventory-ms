const express = require('express');
const router = express.Router();
const { getItems, getItemById, createItem, updateItem, deleteItem } = require('../controllers/items.controller');

router.get('/', getItems);

router.get('/:sku', getItemById);

router.post('/create_item', createItem);

router.put('/update_item/:sku', updateItem);

router.delete('/delete_item/:sku', deleteItem);

module.exports = router;