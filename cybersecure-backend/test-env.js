require('dotenv').config();

console.log('🔍 Environment Variables Check:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
  console.log('❌ No MongoDB URI found in environment variables');
} else {
  console.log('✅ MongoDB URI found');
}