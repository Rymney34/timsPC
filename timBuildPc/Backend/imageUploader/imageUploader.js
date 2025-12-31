// const { v2: cloudinary } = require("cloudinary");

// const uploadImage = async () => {

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: 'dklgdayle', 
//         api_key: '341672431466434', 
//         api_secret: process.env.CLOUDINARY_API 
//     });

//     const url = cloudinary.url('main-sample')

//     console.log(url)

    
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// };

// module.exports = uploadImage;