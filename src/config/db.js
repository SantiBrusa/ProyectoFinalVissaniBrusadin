import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB);
    console.log("Conectado");
  } catch (error) {
    console.log("Error al conectar");
  }
};

export default connectMongoDb;
