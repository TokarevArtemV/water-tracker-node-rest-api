// import multer from "multer";
// import * as cloudinary from "cloudinary";

// import { CloudinaryStorage } from "multer-storage-cloudinary";

// import dotenv from "dotenv";
// dotenv.config();

// const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
//   process.env;

// cloudinary.config({
//   cloud_name: CLOUDINARY_CLOUD_NAME,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     folder: "avatars",
//     allowedFormats: ["jpeg", "png", "jpg"],
//   },

//   //id юзера ?

//   // params: async (req, file) => {
//   //   // Determine the folder based on file properties or request data
//   //   let folder;
//   //   if (file.fieldname === "avatar") {
//   //     folder = "avatars";
//   //   } else if (file.fieldname === "documents") {
//   //     folder = "documents";
//   //   } else {
//   //     folder = "misc";
//   //   }
//   //   return {
//   //     folder: folder,
//   //     allowed_formats: ["jpg", "png"], // Adjust the allowed formats as needed
//   //     public_id: file.originalname, // Use original filename as the public ID
//   //     transformation: [
//   //       { width: 350, height: 350 },
//   //       { width: 700, height: 700 },
//   //     ],
//   //   };
//   // },
// });

// const upload = multer({ storage });

// export default upload;

// //------------------
// // const storage = new CloudinaryStorage({
// //   cloudinary: cloudinary,
// //   params: async (req, file) => {
// //     const { _id } = req.user;
// //     let folder = "avatars"; //
// //     return {
// //       folder: folder,
// //       allowed_formats: ["jpg", "png", "webp"],
// //       public_id: _id,
// //       transformation: [
// //         { width: 350, height: 350 },
// //         { width: 700, height: 700 },
// //       ],
// //     };
// //   },
// // });

// // const destination = path.resolve("temp");

// // const storage = multer.diskStorage({
// //   destination,
// //   filename: (req, file, cb) => {
// //     const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
// //     const filename = `${uniquePrefix}_${file.originalname}`;
// //     cb(null, filename);
// //   },
// // });

// // const limits = {
// //   fileSize: 1024 * 1024 * 5,
// // };

// // const fileFilter = (req, file, cb) => {
// //   const extension = file.originalname.split(".").pop();
// //   if (extension === "exe") {
// //     return cb(HttpError(400, ".exe not valid extension format"));
// //   }
// //   cb(null, true);
// // };

// // const upload = multer({
// //   storage,
// //   limits,
// //   fileFilter,
// // });

// // export default upload;
