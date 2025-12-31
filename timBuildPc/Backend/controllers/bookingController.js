import jwtTokenProvider from "../security/auth/jwtTokenProvider.js";
import Booking from "../schemas/booking.js";
import DeletedBooking from "../schemas/deletedBookings.js";
import { SearchBookingFacade } from "../facades/searchBookingFacade.js";
import mongoose from "mongoose";
import lock from "../config/lock.js";

class BookingController {
  // creating booking method
  createBooking = async (req, res) => {
    const lockKey = 'allBookingCreation'; // unique for reference 
    try {
      // getting user from frontend 
      const {
        serviceTitle,
        firstName,
        secondName,
        address,
        postCode,
        bookingNote,
        date,
        time,
        phoneNumber,
      } = req.body;
      // check that all not null or undefined that there is value
      if (!serviceTitle || !firstName || !secondName || !address || !postCode || !date || !time || !phoneNumber) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      // lock booking or allows to have queue of booking creating on the user side 
      const newBooking = await lock.acquire(lockKey, async () => {
        // creating actual booking
        const booking = new Booking({
          user: req.user.sub,
          serviceTitle,
          firstName,
          secondName,
          address,
          postCode,
          bookingNote,
          date,
          time,
          phoneNumber,
        });
        // saving booking into db
        await booking.save(); // throws an error if document was update by another process
        return booking;
      });

      // returning success and 201
      res.status(201).json({
        success: true,
        data: newBooking,
        message: "Good job, Booking submitted"
      });

      // catching error special and unique code to check if this booking with this time already exists 
    } catch (error) {
      if (error.code === 11000) {
        // throws 409 to front with certain json data
        return res.status(409).json({
          success: false,
          message: "Unfortunately time is already booked for this date"
        });
      }
      console.error("Error :", error);
      res.status(400).json({ error: error.message });
    }
  }

  // getting booking
  getBooking = async (req, res) => {
    // variables for rendering and requesting right amount of data 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const userId = req.user.sub;

    try {
      const bookingDetails = { user: userId };

      const data = await Booking.find(bookingDetails)
        .skip(skip)
        .limit(limit);

      const total = await Booking.countDocuments(bookingDetails);
      console.log("Backend console - data:", data);
      // console.log(await Booking.listIndexes());

      res.json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        data
      }); // send data back to frontend
    } catch (error) {
      console.error("Error in getBookingDetails", error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  // get date through url from frontend then find time within these dates and return allTimes but with no 
  getAvailableTime = async (req, res) => {
    const allTimes = [
      "10:00",
      "13:30",
      "16:30",
      "18:30",
      "20:30",
    ];

    const { date, update, bookedTime } = req.query; 
    try {
      //date & time variables 
      const booked = await Booking.find({ date });
      const bookedTimes = booked.map(b => b.time);
      const available = allTimes.filter(t => !bookedTimes.includes(t));
      //dates variables 
      let now = new Date();
      let day = String(now.getDate()).padStart(2, "0");
      let month = now.getMonth() + 1;
      let year = now.getFullYear();
      let currentDate = `${year}-${month}-${day}`;
      //time variables 
      let hours = now.getHours();
      let minutes = now.getMinutes();
      let seconds = now.getSeconds();
      let timeNow = `${hours}:${minutes}`;

      //cheking time available times 
      if (update === "true") {
        let availableTimes = allTimes.filter(time => {
          if (bookedTimes.includes(time) && time !== bookedTime) {
            return false;
          }
          //checks if time of the curent date is passed or not if no then return true if not false 
          if (date === currentDate && time < timeNow) {
            return false;
          }

          return true;
        });
        // return time 
        return res.json(availableTimes);
      }

      // remove time for TODAY if time already is gone 
      if (date === currentDate) {
        const newAvailable = available.filter(t => t > timeNow);

        return res.json(newAvailable);
      }
       // return time 
      res.json(available);

    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Something went wrong" }); 
    }
  }

  searchBooking = async (req, res) => {
    //getting value and id from the link from router
    const userId = new mongoose.Types.ObjectId(req.user.sub);
    const search = req.query.search;

    try {
      //serach on the backend using mongo db for the value only over users bookigns 
      const data = await SearchBookingFacade.search(userId, search);
      // return booking
      res.json({ data });
    } catch (err) {
      res.status(500).json({ error: "Search failed" });
    }
  }
  //delete booking 
  deleteBooking = async (req, res) => {
    //getting useri and booking id 
    const userId = new mongoose.Types.ObjectId(req.user.sub);
    const bookingId = new mongoose.Types.ObjectId(req.params.id);
    console.log("Booking Id " + bookingId);
    console.log(userId);

    try {
      // search for booking with exact used id and boking id as it is unique 
      const toDeleteBooking = await Booking.findOne({ _id: bookingId, user: userId });
      // console.log(await Booking.listIndexes());

      console.log(toDeleteBooking);
            // err if not found 
      if (!toDeleteBooking) {
        console.log("Already Deleted or not Found"); 
        return res.status(404).json({ error: "Booking not found" });
      }
      // coinvert to object and variable 
      const booking = toDeleteBooking.toObject();

      console.log(booking._id);

       // add exact deleted booking to deletedBookings collection in the datatbase
      await DeletedBooking.create({
        originalBookingId: booking._id,
        userId: booking.user,
        serviceTitle: booking.serviceTitle,
        firstName: booking.firstName,
        secondName: booking.secondName,
        address: booking.address,
        postCode: booking.postCode,
        bookingNote: booking.bookingNote,
        date: booking.date,
        time: booking.time,
        phoneNumber: booking.phoneNumber,
      });
      //actually delete booking
      await Booking.deleteOne({ _id: bookingId });

      //successful message 
      res.json({
        message: "Booking deleted successfully!"
      });

    } catch (error) {
      console.error("Error in deleted booking", error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  updateBooking = async (req, res) => {
    try {
      //getting id from token 
      const userId = new mongoose.Types.ObjectId(req.user.sub);
      // const bookingId = new mongoose.Types.ObjectId(req.params._id);
      // console.log("Booking Id " + bookingId)
      console.log(userId);
      //getting via post body of the data that should be updated 
      const {
        _id,
        serviceTitle,
        firstName,
        secondName,
        address,
        postCode,
        bookingNote,
        date,
        time,
        phoneNumber,
      } = req.body;
   // check that all not null or undefined that there is value
      if (!serviceTitle || !firstName || !secondName || !address || !postCode || !date || !time || !phoneNumber) {
        return res.status(400).json({ error: "Missing required fields" });
      }
     // acctually update of the booking in database 
      const updatingBooking = await Booking.replaceOne({ _id: _id, user: userId }, {
        // _id: _id,
        user: userId,
        serviceTitle: serviceTitle,
        firstName: firstName,
        secondName: secondName,
        address: address,
        postCode: postCode,
        bookingNote: bookingNote,
        date: date,
        time: time,
        phoneNumber: phoneNumber,
      },
        {
          $inc: { balance: 1 }
        });
        //if couldnt find bookign err 400
      if (!updatingBooking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      //return succesfull message 
      res.json({
        close: true,
        message: "Booking Updated successfully!"
      });

    } catch (error) {
      console.error("Error in update booking", error.message); 
      res.status(500).json({ error: "Something went wrong" });
    }
  }

  // getting all bookings from db (ALL from all users)
  getAllBookings = async (req, res) => {
    try {
      // limits
      const { page = 1, limit = 20 } = req.body;
      const skip = (page - 1) * limit;

      // actual request to db
      const data = await Booking.find({})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      // returning to front
      res.json({ data });
    } catch (error) {
      console.error("Error in getAllBookings", error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
}

const bookingController = new BookingController();

export const createBooking = bookingController.createBooking;
export const getBooking = bookingController.getBooking;
export const getAvailableTime = bookingController.getAvailableTime;
export const searchBooking = bookingController.searchBooking;
export const deleteBooking = bookingController.deleteBooking;
export const updateBooking = bookingController.updateBooking;
export const getAllBookings = bookingController.getAllBookings;