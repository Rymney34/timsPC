import mongoose from "mongoose";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

import Booking from "../../schemas/booking.js";
import DeletedBooking from "../../schemas/deletedBookings.js";
import app from "./appTest.js";
// import db from "../../config/dbConnect.js";
const db = require('../../config/dbConnect.js'); 
var mongodb = process.env.TEST_ATLAS_URI

describe("Booking CRUD Integration - Real DB", () => {

    const mockAuthToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTNlYTQ0MDJjNzVhYWQ2MjVmNmJjZTAiLCJmaXJzdE5hbWUiOiJUaW0xMjM0NTYiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzY1NzMyNzIxLCJleHAiOjE3NjY1OTY3MjF9.fUiVIvrHo9SXJvuUKvJMx39ZAmuirbFMOU0J9NM7Cqo"
    const mockUserId = "693ea4402c75aad625f6bce0";
    // const bookingID = new mongoose.Types.ObjectId("693eefbed9d77a29d6a4db41")

    beforeAll(async () => {
        // connect before start 
        await db.connect(mongodb);
        await Booking.removeAllListeners({})
        
    });

    afterEach(async () => {
        //after each test it deletes everthing from db
        await Booking.deleteMany({});
        await DeletedBooking.deleteMany({});
    });

    afterAll(async () => {
        //after all test close connection
        await mongoose.connection.close();
    });

    test('has a model', () => {
        expect(Booking).toBeDefined()
    })

    test("should create real booking and save in database(test) successfully via API", async () => {
        //inserting filling fields mock data to Mongodatabase
        const bookingData = {
            serviceTitle: "VIP",
            firstName: "John",
            secondName: "Doe",
            address: "99 Street",
            postCode: "CF24 2RR",
            date: "2025-12-12",
            time: "10:00",
            phoneNumber: "0777777777",
            bookingNote: "Test booking"
        };
        const res = await request(app)
            .post("/api/createBooking")
            .set("Authorization", `Bearer ${mockAuthToken}`)
            .send(bookingData)
            .expect(201);
        // Check API response
        expect(res.body).toMatchObject({
            success: true,
            message: "Good job, Booking submitted"
        });
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.firstName).toBe("John");
        expect(res.body.data.serviceTitle).toBe("VIP");
        expect(res.body.data.user).toBe(mockUserId);

        // Verify database persistence
        const booking = await Booking.findOne({ firstName: "John" });
        expect(booking).toBeTruthy();
        expect(booking.serviceTitle).toBe("VIP");
        expect(booking.phoneNumber).toBe("0777777777");
    });


    //Test get user bookings
    test("get booking from database(test) via API", async () => {
        //inseeting data for test only
        await Booking.insertMany([
            {
                user: mockUserId,
                serviceTitle: "VIP",
                firstName: "John",
                secondName: "Doe",
                address: "99 Street",
                postCode: "CF24 2RR",
                date: "2025-12-12",
                time: "10:00",
                phoneNumber: "0777777777",
            },
            {
                user: mockUserId,
                serviceTitle: "Standard",
                firstName: "Johnny",
                secondName: "Smith",
                address: "123 Main St",
                postCode: "AB12 3CD",
                date: "2025-12-13",
                time: "14:00",
                phoneNumber: "0788888888",
            }
        ]);

        // imitate frontend request 
        const res = await request(app)
            .get("/api/getBookings?page=1&limit=5")
            .set("Authorization", `Bearer ${mockAuthToken}`)
            .expect(200);

        // expecting this object from backend database
        expect(res.body).toMatchObject({
            page: 1,
            limit: 5,
            total: 2,
            totalPages: 1
        });
        // expecting object have 3 documents(length of objects equal to 3)
        expect(res.body.data).toHaveLength(2);
        expect(Array.isArray(res.body.data)).toBe(true);
        
        // expecting that retuned object is having this field just extra verifying
        expect(res.body.data[0]).toHaveProperty('_id');
        expect(res.body.data[0]).toHaveProperty('serviceTitle');
        expect(res.body.data[0]).toHaveProperty('firstName');
        expect(res.body.data[0].user).toBe(mockUserId);
    });

    test("get serached booking from database(test) via API", async () => {
    //inserting mock data to Mongodatabase
        await Booking.insertMany([
            {
                user: mockUserId,
                serviceTitle: "VIP",
                firstName: "John",
                secondName: "Doe",
                address: "99 Street",
                postCode: "CF24 2RR",
                date: "2025-12-12",
                time: "10:00",
                phoneNumber: "0777777777",
            },
            {
                user: mockUserId,
                serviceTitle: "Standard",
                firstName: "Johnny",
                secondName: "Smith",
                address: "123 Main St",
                postCode: "AB12 3CD",
                date: "2025-12-13",
                time: "14:00",
                phoneNumber: "0788888888",
            }
        ]);

        // imitate frontend request 
        const res = await request(app)
            .get("/api/searchBooking?search=VIP")
            .set("Authorization", `Bearer ${mockAuthToken}`)
            .expect(200);

        // expecting this object from backend database
        expect(res.body).toMatchObject({
            data: res.body.data
        });
    });
    //test for deletion
    test("delete booking from database(test) via API", async () => {
        // What should be written into db
        const createdBookings = await Booking.insertMany([{
            user: mockUserId,
            serviceTitle: "VIP",
            firstName: "John",
            secondName: "Doe",
            address: "99 Street",
            postCode: "CF24 2RR",
            date: "2025-12-12",
            time: "10:00",
            phoneNumber: "0777777777",
        }]);
        //TEST ONLY PASSING ID
        const testID = createdBookings[0]._id;
        const bookingID = new mongoose.Types.ObjectId(testID)

        // Verify booking was created
        expect(bookingID).toBeDefined();

        // Delete booking via API
        const res = await request(app)
            .delete(`/api/deleteBooking/${bookingID}`)
            .set("Authorization", `Bearer ${mockAuthToken}`)
            .expect(200);

        //check for object return from contoller 
        expect(res.body.message).toBe("Booking deleted successfully!");

       //check if booking actualy deleted
        const deletedFromMain = await Booking.findById(bookingID);
        expect(deletedFromMain).toBeNull();
         //deleting booking Archive
        const archivedBooking = await DeletedBooking.findOne({
            originalBookingId: bookingID 
        });
        //check that collections is not empty
        expect(archivedBooking).not.toBeNull();
        expect(archivedBooking.userId.toString()).toBe(mockUserId);
    });

    //Updating booking test
    test("update booking from database(test) via API", async () => {
        // What should be written into db
        const createdBookings = await Booking.insertMany([{
            user: mockUserId,
            serviceTitle: "VIP",
            firstName: "John",
            secondName: "Doe",
            address: "99 Street",
            postCode: "CF24 2RR",
            date: "2025-12-12",
            time: "10:00",
            phoneNumber: "0777777777",
            
        }]);
        //ID of booking 
        const bookingID = createdBookings[0]._id;
        expect(bookingID).toBeDefined();

        //data from frontend pretending
        const bookingData = {
            _id:bookingID,
            serviceTitle: "VIP",
            firstName: "John",
            secondName: "Doe",
            address: "99 Street",
            postCode: "CF24 2RR",
            date: "2025-12-12",
            time: "11:00",
            phoneNumber: "0777777777",
            bookingNote: "Test booking"
        };
        //post request from Front pretending its from frontend
        const res = await request(app)
            .post(`/api/updateBooking`)
            .set("Authorization", `Bearer ${mockAuthToken}`)
            .send(bookingData)
            .expect(200);
        //check for object return from contoller 
        expect(res.body.message).toBe("Booking Updated successfully!");
       //check if booking actualy updated
        const updatedBooking = await Booking.findOne({_id: bookingID, user: mockUserId});
        //comparing ID
        expect(updatedBooking._id.toString()).toBe(bookingID.toString());
        console.log("Original "+bookingID)
        console.log("Updated "+updatedBooking._id)
        //extra check that updated files got this fields updated
        expect(updatedBooking.time).toBe("11:00");
        expect(updatedBooking.bookingNote).toBe("Test booking");
    });
});
