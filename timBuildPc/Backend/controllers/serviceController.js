import multer from "multer";
import { S3Client, PutObjectCommand, LocationType } from "@aws-sdk/client-s3";
import Services from "../schemas/services.js";


class ServiceController {
  // connections 
  s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  // fucntion that acctually upload to s3 AWS
  putObject = async (file, fileName) => {
    try {
      const params = {
        Bucket: "service-picture-upload",
        Key: `${fileName}`,
        Body: file.buffer,
        ContentType: "image/jpg,jpeg,png",
      };

      const command = new PutObjectCommand(params);
      const data = await this.s3.send(command); // Use 'this.s3' instead of 's3'

      if (data.$metadata.httpStatusCode !== 200) {
        return;
      }
      let url = `https://service-picture-upload.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${params.Key}`;
      console.log(url);
      return { url, key: params.Key };
    } catch (err) {
      console.error(err);
    }
  };

  // actull controller an important function for uploaing images to AWS
  setServicePic = async (req, res) => {
    try {
      const file = req.file;
      const filename = `image-${Date.now()}-${file.originalname}`;
      const { url, key } = await this.putObject(file, filename); // Call as method

      if (!url || !key) {
        return res.status(400).json({
          status: "error",
          data: "Image is not uploaded",
        });
      }
      res.json({ success: true, url, key });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  createService = async (req, res) => {
    try {
      const { serviceTitle, price, urlImage, serviceDescription } = req.body;

      if (!serviceTitle || !price || !urlImage || !serviceDescription) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newService = new Services({
        serviceTitle,
        price,
        urlImage,
        serviceDescription,
      });

      await newService.save();

      res.status(201).json({
        _id: newService._id,
        serviceTitle: newService.serviceTitle,
        price: newService.price,
        urlImage: newService.urlImage,
        serviceDescription: newService.serviceDescription,
      });
    } catch (error) {
      console.error("Error :", error);
      res.status(500).json({ error: "Service is not created successfully" });
    }
  };

  // getting all services from db
  getServiceCard = async (req, res) => {
    try {
      const serviceDetails = [
        { $match: {} } // get all documents
      ];

      const data = await Services.aggregate(serviceDetails); // aggregate services(find mathed and return(return all))

      console.log("Backend console - data:", data);

      res.json(data); // send data back to frontend
    } catch (error) {
      console.error("Error in getServiceCard:", error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  };
}

// middle ware  stoing dat in the ram
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage }).single("serviceImage");

const serviceController = new ServiceController();


export const putObject = serviceController.putObject;
export const setServicePic = serviceController.setServicePic;
export const createService = serviceController.createService;
export const getServiceCard = serviceController.getServiceCard;
export { uploadMiddleware };