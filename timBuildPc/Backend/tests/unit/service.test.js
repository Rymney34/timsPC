// Unit testing 
import { uploadMiddleware, setServicePic, createService,getServiceCard } from "../../controllers/serviceController.js";
import {describe, test, vi, it, expect, beforeEach} from "vitest"
import Services from "../../schemas/services.js";

//mock model initialisation
vi.mock("../../schemas/services.js");


//For res imitation what Express returns (method chining) - template in simple words
function mockResponse() {
    return {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis()
    }
}

// CRUD test for the services
describe("CRUD services - Unit Test", () => {

    //clears tests 
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("should return 400 if required fields are missing", async () => {
                //req should come from frontend just imitation
            const req = {
                body: { price: "12", serviceTitle: 'fdsf', urlImage: "fsdfsdf"},
            };
             //res what acctualy returned in the method by Express(method chining)
            const res = mockResponse();
               //calling function from controller 
            await createService(req, res);
             //acctual test expections and waht acctualy received
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
    });

     test("should return 500 becuase server or database is failed", async () => {
                //req should come from frontend just imitation
            const req = {
                body: { 
                    price: "12", 
                    serviceTitle: 'fdsf',
                    urlImage: "fsdfsdf",
                    serviceDescription: "desc"
                },
            };
             //res what acctualy returned in the method by Express(method chining)
            const res = mockResponse();
               //calling function from controller 
            const mockSave = vi.fn().mockRejectedValue(new Error("Database error"))
            //what should be saved to database pottentially Mock object pretneds what mongoose would create
            const mockServiceInstance = {
                _id: "service123",
                serviceTitle: req.body.serviceTitle,
                price: req.body.price,
                urlImage: req.body.urlImage,
                serviceDescription: req.body.serviceDescription,
                save: mockSave
            };
            //Mocking service constructor
            Services.mockImplementation(() => mockServiceInstance);
               //calling function from controller (calling constructor)
            await createService(req, res)
        

            expect(mockSave).toHaveBeenCalled();
           
             //acctual test expections and waht acctualy received
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Service is not created successfully" });
    });
    //test in service creation, filling all the details to create service
    test("should create service successfuly", async () => {
            //req tha should come from frontend just imitation
            const req = {
                body: {
                    price: "12",
                    serviceTitle: 'STANDARD',
                    urlImage: "urlThatComesFromAWS",
                    serviceDescription: "desc"
                },
            };
            //res what acctuly returned in the method by Express(method chining)
            const res = mockResponse()
            //fake saving function that returns promise and success
            const mockSave = vi.fn().mockResolvedValue();
            //what should be saved to database pottentially Mock object pretneds what mongoose would create
            const mockServiceInstance = {
                _id: "service123",
                serviceTitle: req.body.serviceTitle,
                price: req.body.price,
                urlImage: req.body.urlImage,
                serviceDescription: req.body.serviceDescription,
                save: mockSave
            };
            //Mocking service constructor
            Services.mockImplementation(() => mockServiceInstance);
               //calling function from controller (calling constructor)
            await createService(req, res)
            //check if save is called, then that respsonse is 201(succes) 
            // and actualy returning json object of from controller that is succesfuly created
            expect(mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                _id: "service123",
                serviceTitle: "STANDARD",
                price: "12",
                urlImage: "urlThatComesFromAWS",
                serviceDescription: "desc"
        });
    });
        //getting service details to be display at front end
    test("should read and get all services successfuly", async () => {
            //res what acctuly returned in the method by Express(method chining)
            const res = mockResponse()
            const req = {}
 
            //what should be saved to database pottentially Mock object pretneds what mongoose would create
            const mockServices = [
                {
                    _id: "service123",
                    serviceTitle: "STANDARD",
                    price: "12",
                    urlImage: "urlThatComesFromAWS",
                    serviceDescription: "desc",
                }, 
                {
                    _id: "service1235",
                    serviceTitle: "VIP",
                    price: "100",
                    urlImage: "urlThatComesFromAWS",
                    serviceDescription: "desc",
                },
                {
                    _id: "service12345",
                    serviceTitle: "BASIC",
                    price: "10",
                    urlImage: "urlThatComesFromAWS",
                    serviceDescription: "desc",
                }
            ];
                  //calling aggragete fucn from controoctor from controller 
            //Mocking service constructor
            Services.aggregate.mockResolvedValue(mockServices);
               //calling function from controller (calling constructor)
            await getServiceCard(req, res)
            //acctual test waht it expected and what is test 
            expect(res.json).toHaveBeenCalledWith(mockServices);
    });

    test("should return empty array when no services exist", async () => {
        
        const req = {};
          //res what acctulyu returned in the method by Express(method chining)
        const res = mockResponse();
        //calling aggragete fucn from controoctor from controller 
        Services.aggregate.mockResolvedValue([]);
        //calling function from controller (calling constructor)
        await getServiceCard(req, res);
        //acctual test waht it expected and what is test 
        expect(res.json).toHaveBeenCalledWith([]);
    });
    // test if problem at the backedn end occurs essocialy at db and server
    test("should return 500 when server or database error occurs", async () => {
        const req = {};
          //res what acctulyu returned in the method by Express(method chining)
        const res = mockResponse();

        //calling aggragete fucn from controoctor from controller 
        Services.aggregate.mockRejectedValue(new Error("Database error"));
        //calling function from controller (calling constructor)
        await getServiceCard(req, res);
        //acctual test waht it expected and what is test 
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Something went wrong" });
    });




})