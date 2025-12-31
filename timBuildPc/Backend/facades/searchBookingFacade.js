import Booking from "../schemas/booking.js";
import mongoose from "mongoose";

//pattern that conrtains pipline that send to db, it help to separate controller logic 
//more piplines features for more advanced search can be added
export class SearchBookingFacade {
    static async search(userId, search) {
        const pipeline = [
            {
                $match: {
                    user: userId,
                    $or: [
                        { serviceTitle: { $regex: search, $options: "i" } },
                        { secondName:   { $regex: search, $options: "i" } },
                        { address:      { $regex: search, $options: "i" } },
                        { postCode:     { $regex: search, $options: "i" } },
                    ]
                }
            }
        ];

    return await Booking.aggregate(pipeline);
  }
}