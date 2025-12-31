// Unit testing 
import {getAvailableTime, searchBooking, createBooking, getBooking, deleteBooking,updateBooking} from '../../controllers/bookingController.js' 
import {describe, test, vi, it, expect, beforeEach} from "vitest"
import Booking from "../../schemas/booking.js";
import DeletedBooking from "../../schemas/deletedBookings.js"
//mock model initialisation
vi.mock("../../schemas/booking.js");
//mock model initialisation
vi.mock("../../schemas/deletedBookings.js");

//For res imitation what Express returns (method chining) - template in simple words
function mockResponse() {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis()
    }
}

//test related to Booking creation 
describe("CRUD Bookings - Unit Test", () => {

    //clears tests 
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should return 400 if required fields are missing", async () => {
            //req tha should come from frontend just imitation
        const req = {
            body: { firstName: "John" },
        };
         //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse();
           //calling function from controller 
        await createBooking(req, res);
         //acctual test expections and waht acctualy received
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
    });

    test("should create booking successfuly", async () => {
        //req tha should come from frontend just imitation
        const req = {
            user: { sub: "6938b350de5d0c0e10c7d531" },
            body: {
                serviceTitle: "VIP",
                firstName: "John",
                secondName: "Doe",
                address: "123 Street",
                postCode: "CF22",
                bookingNote: "Be careful",
                date: "2025-12-20",
                time: "10:00",
                phoneNumber: "123456789",
            },
        };
        //res what acctulyu returned in the method by Express(method chining)
        const res = mockResponse()
           //calling function from controller 
        
        await createBooking(req, res)
        
        const instance = Booking.mock.results[0].value
         //acctual test expections and waht acctualy received
        expect(instance.save).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(201)
    });

    test("should delete booking successfuly", async () => {
         //req tha should come from front just immitation

        const req = {
            user: { sub: "6938b350de5d0c0e10c7d531" },
            params: { id: "6938b350de5d0c0e10c7d532" }
        }
        //res what acctulyu returned in the method by Express(method chining)
        const res = mockResponse()

        //imitation of the database or what be returned from database 
        const mockBooking = {
            _id: req.params.id,
            user: req.user.sub,
            serviceTitle: "VIP",
            firstName: "John",
            secondName: "Doe",
            address: "123 Street",
            postCode: "CF22",
            bookingNote: "Note",
            date: "2025-12-20",
            time: "10:00",
            phoneNumber: "123456789",
            toObject: function () { return this }
        }

        Booking.findOne.mockResolvedValue(mockBooking)
        DeletedBooking.create.mockResolvedValue({})
        Booking.deleteOne.mockResolvedValue({})
        //calling function from controller 
        await deleteBooking(req, res)
         //acctual test expections and waht acctualy received
        expect(Booking.findOne).toHaveBeenCalled()
        expect(DeletedBooking.create).toHaveBeenCalled()
        expect(Booking.deleteOne).toHaveBeenCalledWith({ _id: expect.anything() })
        expect(res.json).toHaveBeenCalledWith({
            message: "Booking deleted successfully!"
        })
    });

    test("404 should be returned when booking does not exist", async () => {
         //req tha should come from front just imitation
        const req = {
            user: { sub: "6938b350de5d0c0e10c7d531" },
            params: { id: "6938b350de5d0c0e10c7d531" }
        };
        //res what acctulyu returned in the method by Express(method chining)
        const res = mockResponse();

        Booking.findOne.mockResolvedValue(null);
        //calling function from controller 
        await deleteBooking(req, res);
         //acctual test expections and what acctualy received
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Booking not found" });
        expect(DeletedBooking.create).not.toHaveBeenCalled();
        expect(Booking.deleteOne).not.toHaveBeenCalled();
    });

//test if database is not responding 
    test("500 should be returned when findOne fails", async () => {
         //req tha should come from front just imitation
        const req = {
            user: { sub: "6938b350de5d0c0e10c7d531" },
            params: { id: "6938b350de5d0c0e10c7d531" }
        };
        //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse();

        Booking.findOne.mockRejectedValue(new Error("Database connection failed"));

        await deleteBooking(req, res);
         //acctual test expections and waht acctualy received
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });

     test("should return 500 when archiving deleted booking fails", async () => {
         //req tha should come from front just imitation
        const req = {
            user: { sub: "6938b350de5d0c0e10c7d531" },
            params: { id: "6938b350de5d0c0e10c7d532" }
        };
        //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse();

        const mockBooking = {
            _id: req.params.id,
            user: req.user.sub,
            serviceTitle: "VIP",
            firstName: "John",
            secondName: "Doe",
            address: "123 Street",
            postCode: "CF22",
            bookingNote: "Note",
            date: "2025-12-20",
            time: "10:00",
            phoneNumber: "123456789",
            toObject: function () { return this; }
        };

        Booking.findOne.mockResolvedValue(mockBooking);
        DeletedBooking.create.mockRejectedValue(new Error("Failed to archive"));

        await deleteBooking(req, res);
         //acctual test expections and waht acctualy received
        expect(res.status).toHaveBeenCalledWith(500);
        expect(Booking.deleteOne).not.toHaveBeenCalled();
    });

    test("should return 500 when deleteOne throws an error", async () => {
         //req tha should come from front jsut immitation
        const req = {
            user: { sub: "6938b350de5d0c0e10c7d531" },
            params: { id: "6938b350de5d0c0e10c7d532" }
        };
        //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse();

        const mockBooking = {
            _id: req.params.id,
            user: req.user.sub,
            serviceTitle: "VIP",
            firstName: "John",
            secondName: "Doe",
            address: "123 Street",
            postCode: "CF22",
            bookingNote: "Note",
            date: "2025-12-20",
            time: "10:00",
            phoneNumber: "123456789",
            toObject: function () { return this; }
        };
        
        Booking.findOne.mockResolvedValue(mockBooking);
        DeletedBooking.create.mockResolvedValue({});
        Booking.deleteOne.mockRejectedValue(new Error("Delete failed"));

        await deleteBooking(req, res);
 //acctual test expections and waht acctualy received
        expect(res.status).toHaveBeenCalledWith(500);
    });

    test("should archive booking with correct data before acctual deletion", async () => {
         //req tha should come from frontend jsut immitation
        const req = {
            user: { sub: "6938b350de5d0c0e10c7d531" },
            params: { id: "6938b350de5d0c0e10c7d532" }
        };
        //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse();
        //what be returned from database 
        const mockBooking = {
            _id: req.params.id,
            user: req.user.sub,
            serviceTitle: "VIP",
            firstName: "John",
            secondName: "Doe",
            address: "123 Street",
            postCode: "CF22",
            bookingNote: "Special note",
            date: "2025-12-20",
            time: "10:00",
            phoneNumber: "123456789",
            toObject: function () { return this; }
        };

        Booking.findOne.mockResolvedValue(mockBooking);
        DeletedBooking.create.mockResolvedValue({});
        Booking.deleteOne.mockResolvedValue({});

        await deleteBooking(req, res);
         //acctual test expections and waht acctualy received
        expect(DeletedBooking.create).toHaveBeenCalledWith(
            expect.objectContaining({
                originalBookingId: req.params.id,
                userId: req.user.sub,
                serviceTitle: "VIP",
                firstName: "John",
                secondName: "Doe",
                address: "123 Street",
                postCode: "CF22",
                bookingNote: "Special note",
                date: "2025-12-20",
                time: "10:00",
                phoneNumber: "123456789"
            })
        );
    });


    //Reading own bookings
    test("should read (get) bookings successfuly", async () => {
         //req tha should come from frontend just immitation
        const req = {
            query: {page: 1, limit: 5},
            user: { sub: "6938b350de5d0c0e10c7d531" }
        }
        //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse()
        //imitation of the database or  what be returned from database 
        const mockBookings = [
            {
                _id: "booking1",
                user: req.user.sub,
                serviceTitle: "VIP",
                firstName: "John",
                secondName: "Doe",
                address: "123 Street",
                postCode: "CF22",
                date: "2025-12-20",
                time: "10:00",
                phoneNumber: "123456789"
            },{
                _id: "booking2",
                user: req.user.sub,
                serviceTitle: "Standard",
                firstName: "Jane",
                secondName: "Doe",
                address: "456 Avenue",
                postCode: "CF23",
                date: "2025-12-21",
                time: "14:00",
                phoneNumber: "987654321"
            },{
                _id: "booking3",
                user: req.user.sub,
                serviceTitle: "VI2",
                firstName: "John",
                secondName: "Doe",
                address: "123 Street",
                postCode: "CF22",
                date: "2025-12-20",
                time: "10:00",
                phoneNumber: "123456789"
            },{
                _id: "booking4",
                user: req.user.sub,
                serviceTitle: "Standard2",
                firstName: "Jane",
                secondName: "Doe",
                address: "456 Avenue",
                postCode: "CF23",
                date: "2025-12-21",
                time: "14:00",
                phoneNumber: "987654321"
            }
        ];
        //finding bookings
        Booking.find.mockReturnValue({
            skip: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue(mockBookings)
            })
        });
         //counting bookings 
        Booking.countDocuments.mockResolvedValue(4);
        //calling function 
        await getBooking(req, res)
         //acctual test expections and waht acctualy received
        expect(Booking.find).toHaveBeenCalledWith({ user: req.user.sub });
        expect(Booking.countDocuments).toHaveBeenCalledWith({ user: req.user.sub });
        expect(res.json).toHaveBeenCalledWith({
            page: 1,
            limit: 5,
            total: 4,
            totalPages: 1,
            data: mockBookings
        })
    });


    //getting error 
    test("should return 500 when problem on database side", async () => {
         //req tha should come from frontend just immitation

        const req = {
            query: {page: 1, limit: 5},
            user: { sub: "6938b350de5d0c0e10c7d531" }
        }
        //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse()

        //finding bookings
        Booking.find.mockReturnValue({
            skip: vi.fn().mockReturnValue({
                limit: vi.fn().mockRejectedValue(new Error("Database error"))
            })
        });
        //calling function 
        await getBooking(req, res);
         //acctual test expections and waht acctualy received
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Something went wrong"});
    });

    //Updating 1 own booking
    test("should update bookings successfuly", async () => {
         //req tha should come from frontend just immitation

        const req = {
            
            user: { sub: "6938b350de5d0c0e10c7d531" },
            body: {
                _id:"6938b350de5d0c0e10c7d532",
                serviceTitle: "VIP",
                firstName: "John",
                secondName: "Doe",
                address: "123 Street",
                postCode: "CF22",
                bookingNote: "Note",
                date: "2025-12-20",
                time: "10:00",
                phoneNumber: "123456789"
            }
        }
        //res what acctuly returned in the method by Express(method chining)
        const res = mockResponse()

        //finding bookings
        Booking.replaceOne.mockResolvedValue({
                acknowledged: true,
                modifiedCount: 1
            });
        //calling function 
        await updateBooking(req, res)
         //acctual test expections and waht acctualy received
        expect(Booking.replaceOne).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            close: true,
            message: "Booking Updated successfully!"
        })
    });

    test("should return 400 if required fields missing", async () => {
        //req tha should come from frontend just immitation
        const req = {
            user: { sub: "6938b350de5d0c0e10c7d531" },
            body: {
                _id: "booking1",
                firstName: "John"
            }
        };
        const res = mockResponse();
        //calling function from controller 
        await updateBooking(req, res);

        //acctual test expections and waht acctualy received
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
        expect(Booking.replaceOne).not.toHaveBeenCalled();
    });

    // if error occurs with database
    test("should return 500 when database error occurs", async () => {
         //req tha should come from frontend just immitation
        const req = {
            user: { sub: "6938b350de5d0c0e10c7d531" },
            body: {
                _id: "booking1",
                serviceTitle: "VIP",
                firstName: "John",
                secondName: "Doe",
                address: "123 Street",
                postCode: "CF22",
                date: "2025-12-20",
                time: "10:00",
                phoneNumber: "123456789"
            }
        };
        const res = mockResponse();

        Booking.replaceOne.mockRejectedValue(new Error("Database error"));
        //calling function from controller 
        await updateBooking(req, res);
        //acctual test expections and waht acctualy received
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });


})

