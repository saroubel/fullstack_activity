const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true, })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


// Schéma du produit
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, required: true }
});

const Product = mongoose.model('Product', productSchema);

// Routes

// GET: /api/products
app.get('/api/products', (req, res) => {
  Product.find()
    .then(products => res.status(200).json({ products }))
    .catch(error => res.status(400).json({ error }));
});

// GET: /api/products/:id
app.get('/api/products/:id', (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then(product => res.status(200).json({ product }))
    .catch(error => res.status(404).json({ error }));
});

// POST: /api/products
app.post('/api/products', (req, res) => {
  delete req.body._id;
  const product = new Product({
    ...req.body
  });
  product.save()
    .then(product => res.status(201).json({ product }))
    .catch(error => res.status(400).json({ error }));
});

// PUT: /api/products/:id
app.put('/api/products/:id', (req, res) => {
  Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modified!' }))
    .catch(error => res.status(400).json({ error }));
});

// DELETE: /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Deleted!' }))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;