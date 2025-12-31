const mongoose = require('mongoose');

const deletedBookingsSchema = new mongoose.Schema({
    originalBookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'bookings', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
    deletedAt: { type: Date, default: Date.now }
},
{
    timestamps: true,
    collection: 'deletedBookings'
},

);

module.exports =
  mongoose.models.deletedBookings ||
  mongoose.model("deletedBookings", deletedBookingsSchema);