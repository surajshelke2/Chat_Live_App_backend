const  mongoose= require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MOGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB is connected with ${conn.connection.host}`);
  } catch (error) {
    console.log("Error :", error);
  }
};

module.exports = connectDB;
