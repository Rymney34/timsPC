const mongoose = require("mongoose");
const { connectDB } = require("../config/dbConnect"); 

// model for services
const ServiceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  serviceTitle: { type: String, required: true},
  price: { type: String, required: true },
  urlImage: {type:String, required: true},
  serviceDescription: { type: String, required: true },
  
}, { 
  versionKey: false,
  collection: 'services' 
  
});

const Services =  mongoose.models.services || mongoose.model("services", ServiceSchema); 

module.exports = Services;