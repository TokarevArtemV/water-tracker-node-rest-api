const customCors = (_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  //   const allowedOrigins = [
  //     "http://localhost:5173",
  //     "https://water-tracker-pi.vercel.app",
  //     "https://water-tracker-node-rest-api.onrender.com",
  //   ];
  //   const origin = req.headers.origin;
  //   if (allowedOrigins.includes(origin)) {
  //     res.setHeader("Access-Control-Allow-Origin", origin);
  //   }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
};

export default customCors;
