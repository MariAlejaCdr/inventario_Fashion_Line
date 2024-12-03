const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/inventario');
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Conexion exitosa...');
});
connection.on('error', (err) => {
    console.log('Error al conectarse a la BD...', err);
});

// Modelo para la base de datos
const Producto = mongoose.model('Producto', {
    codigo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true },
    cantidad: { type: Number, required: true},
    talla: { type: String, required: true },
    proveedor: { type: String, required: true },
    umbral_stock: { type: Number, required: true }
});

app.post('/registrar', (req, res) => {
    const producto = new Producto({
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        precio: req.body.precio,
        categoria: req.body.categoria,
        cantidad: req.body.cantidad,
        talla: req.body.talla,
        proveedor: req.body.proveedor,
        umbral_stock: req.body.umbral_stock
    });
    producto.save().then(doc => {
        console.log('Producto ingresado con exito...', doc);
    })
    .catch(err => {
        console.log('Error al ingresar el producto...', err.message);
    });
});

// Ruta para buscar productos
app.get('/buscar', (req, res) => {
    const query = req.query.query;
    Producto.find({ 
        $or: [
            { nombre: new RegExp(query, 'i') },
            { categoria: new RegExp(query, 'i') }
        ]
    }).then(productos => {
        res.json(productos);
    }).catch(err => {
        res.status(500).json({ message: 'Error al buscar productos', error: err });
    });
});

// Ruta para obtener un producto por código
app.get('/producto/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    Producto.findOne({ codigo: codigo })
        .then(producto => {
            if (producto) {
                res.json(producto);
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error al buscar el producto', error: err });
        });
});

// Ruta para actualizar un producto
app.put('/producto/nombre/:nombre', (req, res) => {
    const nombre = req.params.nombre;
    const { precio, categoria, cantidad, talla, proveedor, umbral_stock } = req.body;

    Producto.findOneAndUpdate(
        { nombre: nombre },
        { precio, categoria, cantidad, talla, proveedor, umbral_stock },
        { new: true, runValidators: true }
    )
    .then(producto => {
        if (producto) {
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    })
    .catch(err => {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ message: 'Error al actualizar el producto', error: err.message });
    });
});

// Ruta para eliminar un producto por código
app.delete('/producto/:codigo', (req, res) => {
    const codigo = req.params.codigo;

    Producto.findOneAndDelete({ codigo: codigo })
        .then(producto => {
            if (producto) {
                res.json({ message: 'Producto eliminado con éxito' });
            } else {
                res.status(404).json({ message: 'Producto no encontrado' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error al eliminar el producto', error: err });
    });
});

// Ruta para obtener todos los productos
app.get('/productos', (req, res) => {
    Producto.find({})
        .then(productos => {
            res.json(productos);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error al obtener los productos', error: err });
        });
});

app.listen(3000, () => {
    console.log('Servidor conectado en el puerto 3000');
});