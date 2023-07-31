import multer from "multer";
/*import { fileURLToPath } from "url";
import { dirname } from "path";*/
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker/locale/es";
import configMailSms from "./configmailsms.js";
import nodemailer from "nodemailer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/images`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


///encriptacion
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

/*
export const uploader = multer({ storage });
export default __dirname;
*/
//////////////////////////////////////////////////////////////////
//genera productos con fackers.js

export const generateProducts = () => {
  let numOfProducts = faker.number.int({ min: 0, max: 20 });

  let products = [];

  for (let i = 0; i < numOfProducts; i++) {
    products.push(generateProduct());
  }
  return products;
};

export const generateProduct = () => {
  return {
        
    id: faker.database.mongodbObjectId(),
    pTitle : faker.commerce.product(),
    pDescription : faker.commerce.productDescription(),
    pCode : faker.string.alphanumeric(5) ,  
    pPrice : faker.commerce.price(),
    pStatus : faker.datatype.boolean(),
    pStock : faker.number.int({ min: 0, max: 100 }),
    pCategory : faker.commerce.product(),     
    pThumbnail: faker.image.url(),

  };
};

//////////////////////////////////////////////////////////////////
//envio de email
const {
  nodemailerConfig: { service, port, user, password,mail_receptor},
} = configMailSms;

export const transport = nodemailer.createTransport({
  service: service,
  port: port,
  auth: {
      user: user,
      pass: password
  },
  tls: {
      rejectUnauthorized: false
  }
});

export default transport;
//////////////////////////////////////////////////////////////////////////

