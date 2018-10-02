let mongoose = require('mongoose');

let productSchema = mongoose.Schema({
    name: String,
    price: Number,
    reviews: [{ stars: Number, text: String }]
});

let Product = mongoose.model('Product', productSchema);

function newProduct(productToSave) {
    let product = new Product({
        name: productToSave.name,
        price: productToSave.price,
        reviews: productToSave.reviews
    })

    return product.save();
}

function findAll() {
    return Product.find({});
}

function sortProduct(whatToSort) {
    return Product.find({}).sort(whatToSort);
}


module.exports = {
    Product,
    newProduct,
    findAll,
    sortProduct
}
