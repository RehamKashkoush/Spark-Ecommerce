import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { Product, User } from '../src/models.js'

await mongoose.connect(process.env.MONGODB_URI)

const password = await bcrypt.hash('Admin123!', 12)
const admin = await User.findOneAndUpdate(
  { email: 'admin@spark.test' },
  { name: 'Platform Admin', email: 'admin@spark.test', password, role: 'admin', verified: true, isDeleted: false, accountStatus: 'active', sellerStatus: 'approved' },
  { upsert: true, new: true }
)

const sellerPassword = await bcrypt.hash('Seller123!', 12)
const seller = await User.findOneAndUpdate(
  { email: 'seller@spark.test' },
  { name: 'Atelier Milano', email: 'seller@spark.test', password: sellerPassword, role: 'seller', verified: true, isDeleted: false, accountStatus: 'active', sellerStatus: 'approved' },
  { upsert: true, new: true }
)

const customerPassword = await bcrypt.hash('Customer123!', 12)
await User.findOneAndUpdate(
  { email: 'customer@spark.test' },
  { name: 'Reham Ali', email: 'customer@spark.test', password: customerPassword, role: 'customer', verified: true, isDeleted: false, accountStatus: 'active', sellerStatus: 'approved' },
  { upsert: true, new: true }
)

const dummy = await fetch('https://dummyjson.com/products?limit=0').then((response) => response.json())
await Product.deleteMany({})
const products = dummy.products.map((product) => ({
  externalId: product.id,
  seller: seller._id,
  title: product.title,
  description: product.description,
  category: product.category,
  price: product.price,
  discountPercentage: product.discountPercentage,
  rating: product.rating,
  stock: product.stock,
  brand: product.brand,
  thumbnail: product.thumbnail,
  images: product.images,
  reviews: product.reviews || [],
  reviewCount: (product.reviews || []).length,
  isActive: true
}))
await Product.insertMany(products)

console.log(`Seeded ${products.length} products and demo users. Admin: ${admin.email}, Seller: ${seller.email}`)
await mongoose.disconnect()
