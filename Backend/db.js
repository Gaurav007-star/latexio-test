const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI // Replace with your MongoDB 

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = connectToMongoDB;
