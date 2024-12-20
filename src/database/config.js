import mongoose from 'mongoose';

export const dbConnection = async () =>{
    try {
       await mongoose.connect("mongodb+srv://Adrian_Vargas:Adrian97@cluster0.5kayh.mongodb.net/ecommerce");
       console.log("Base de datos MongoDb online!")
    } catch (error) {
        console.log(`Error al levantar la base de datos ${error}`);
        process.exit(1);
    }
}