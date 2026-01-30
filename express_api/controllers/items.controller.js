const Item = require('../models/item.model');

const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json({ items });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getItemById = async (req, res) => {
    try {
        const { sku } = req.params;
        const item = await Item.findById(sku);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createItem = async (req, res) => {
    try {
        const item = await Item.findOne({ name: req.body.name });
        if (item)
            return res.status(400).json({ message: 'Item already exists' });
        const newItem = await new Item({ ...req.body }).save();
        res.status(200).json({ data: newItem, message: 'Item created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateItem = async (req, res) => {
    try {
        const { sku } = req.params;
        const updatedItem = await Item.findByIdAndUpdate(sku, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ data: updatedItem, message: 'Item updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteItem = async (req, res) => {
    try {
        const { sku } = req.params;
        const deletedItem = await Item.findByIdAndDelete(sku);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.status(200).json({ data: deletedItem, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
}