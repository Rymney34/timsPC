import mongoose from "mongoose";
import request from "supertest";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";

import Services from "../../schemas/services.js";
import app from "./appTest.js";

const db = require('../../config/dbConnect.js'); 
var mongodb = process.env.TEST_ATLAS_URI

describe("Service CRUD Inergration testing", () => {
    beforeAll(async () => {
        // connect before start 
        await db.connect(mongodb);
        await Services.removeAllListeners({})
        
    });

    afterEach(async () => {
        //after each test it deletes everthing from db
       await Services.deleteMany({});
    });

    afterAll(async () => {
        //after all test close connection
        await mongoose.connection.close();
    });

    //testing creation of service
    test("should create service and save to DB successfully via API", async () => {
    //input from pretending frontend
        const newService = {
            serviceTitle:"VIP", 
            price: "12",
            urlImage:"urlImage",
            serviceDescription: "description long" 
        }
        //input from pretending frontend
        const res = await request (app)
            .post("/api/craeteService")
            .send(newService)
            .expect(201)

        expect(res.body).toMatchObject({
            serviceTitle:"VIP", 
            price: "12",
            urlImage:"urlImage",
            serviceDescription: "description long" 
        });

    })

    test("should get service from DB successfully via API", async () => {

        await Services.insertMany([
            {
                serviceTitle:"VIP", 
                price: "11",
                urlImage:"urlImage",
                serviceDescription: "description long" 
            },
            {
                serviceTitle:"Basic", 
                price: "13",
                urlImage:"urlImage",
                serviceDescription: "description long" 
            }
        ]);

        const res = await request(app)
            .post("/api/findDoc")
            .expect(200);
        //check that it got 2 inserted previsouly documents and they are returned

        console.log(res.body)
        expect(res.body).toHaveLength(2);
        expect(Array.isArray(res.body)).toBe(true);

    })
})

