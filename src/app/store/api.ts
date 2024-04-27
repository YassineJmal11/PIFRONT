

const URL = "http://localhost:8080";
const products = URL + '/api/store/products';
const products_reviews = URL + '/api/store/product-reviews';
const product_marks = URL + '/api/store/product-mark'
const shopping_cart = URL + '/api/store/shopping-cart'
const physical_stores = URL + '/api/store/physical-stores'

const API = 
{
    // other
    defaultGoogleMapLocation : `https://maps.google.com/maps?q=Tunisia&t=&z=13&ie=UTF8&iwloc=&output=embed`,

    //crud
    createProduct: products + "/createProduct",
    getProductById: products + "/getProductById",
    updateProduct: products + '/updateProduct',
    deleteProduct: products + '/deleteProduct',
    //misc
    getAllProducts: products + "/getAllProducts",
    searchProducts: products + "/searchProducts",
    updateProductImages: products + "/updateProductImages",

    //crud
    getProductReviewById: products_reviews + "/getProductReviewById",
    createProductReview: products_reviews + "/createProductReview",
    updateProductReview: products_reviews + '/updateProductReview',
    deleteProductReview: products_reviews + '/deleteProductReview',
    //misc
    getAllProductReviews: products_reviews + "/getAllProductReviews",
    getReviewsOfProduct: products_reviews + "/getReviewsOfProduct",

    //crud
    createProductMark: product_marks + "/createProductMark",
    getProductMarkById: product_marks + "/getProductMarkById",
    updateProductMark: product_marks + '/updateProductMark',
    deleteProductMark: product_marks + '/deleteProductMark',
    //misc
    getAllProductMarks: product_marks + "/getAllProductMarks",
    
    //crud
    createPhysicalStore: physical_stores + "/createPhysicalStore",
    getPhysicalStoreById: physical_stores + "/getPhysicalStoreById",
    updatePhysicalStore: physical_stores + '/updatePhysicalStore',
    deletePhysicalStore: physical_stores + '/deletePhysicalStore',
    //misc
    getAllPhysicalStores: physical_stores + '/getAllPhysicalStores',

    getShoppingCartById : shopping_cart + '/getShoppingCartById',
    getShoppingCartByUserId : shopping_cart + '/getShoppingCartByUserId',
    addProductToCart : shopping_cart + '/addProductToCart',


    getAllUsers: URL + '/api/users'
};

export default API;