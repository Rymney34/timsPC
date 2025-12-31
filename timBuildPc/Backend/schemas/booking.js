const mongoose = require("mongoose");
const { connectDB } = require("../config/dbConnect"); 

// model for services
const bookingSchema = new mongoose.Schema({
    user : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    serviceTitle:{type: String, required: true},
    firstName: { type: String, required: true},
    secondName: { type: String, required: true },
    address: {type:String, required: true},
    // email: { type: String, required: true, unique: true },
    postCode: {type:String, required: true},
    bookingNote: {type:String},
    date: {type: String,required: true},
    time:  {type: String, required: true},
    phoneNumber:{type:String, required: true},
  },
  {
  versionKey: false,
  collection: 'bookings' 
  });

  bookingSchema.index(
    {date:1, time:1},
    { unique: true }
  )
  // bookingSchema.index({ 
  //   serviceTitle: "text",
  //   secondName: "text",
  //   postCode: "text",
  //   address: "text", 
  // });

const Booking =
  mongoose.models.bookings ||
  mongoose.model("bookings", bookingSchema);

module.exports = Booking;