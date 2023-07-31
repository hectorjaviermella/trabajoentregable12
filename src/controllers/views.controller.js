import  CartsService from "../services/carts.service.js";
import  TicketService from "../services/tickets.service.js";
import UserDTO from "../daos/dtos/user.dto.js";
import TicketDTO from "../daos/dtos/ticket.dto.js";
import { createHash, isValidPassword, transport } from "../utils.js";
import { userModel } from "../daos/mongo/model/user.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";


import { productRepository } from "../repositories/index.js";
const cartsService = new CartsService();
const ticketService = new TicketService();



//////////////////////////////////////////////////////////////////////////////////////////////

export function login(req, res) {

  res.render("login");
};

//////////////////////////////////////////////////////////////////////////////////////////////
export function register(req, res) {
  res.render("register");
};
//////////////////////////////////////////////////////////////////////////////////////////////
/*export function current(req, res) {
  console.log("entro al current de view.controller " , req.session.user );
  
  const userToSave = new UserDTO(req.session.user);
  console.log("user ", userToSave);
  res.render("profile", { user: userToSave });
};
*/

export function current(req, res) {
  
  
  const userToSave = new UserDTO(req.session.user);
 // console.log("user ", userToSave);
  res.render("profile", { user: userToSave });
};

//////////////////////////////////////////////////////////////////////////////////////////////
export function inicio(req, res) {
  res.render("login");
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//muestra todo los productos 
export async function getProducts(req, res) {
   
   req.logger.debug('Entro al getProducts');

   let {limit =3 , page =  1, pCategory, pStatus, sort} = req.query; 
   
  let query ={
    pCategory: pCategory || { $exists: true },
    pStatus: pStatus || { $exists: true },
  }; 
    
  if (sort===1)
  sort={ pPrice:-1};
else
  sort={ pPrice:-1};  
 

 const { docs: productos,  hasPrevPage,  hasNextPage,  nextPage,  prevPage,  totalPages,
} =  await productRepository.getProducts(query,limit,page,pCategory,pStatus,sort); 


return res.render("products", { user:req.session.user , productos,  page,  hasPrevPage,  hasNextPage,  prevPage,  nextPage,  totalPages,});
};

///////////////////////////////////////////////////////////////////////////////////
//muestra un producto
export async function getProductsById(req, res) {
  req.logger.debug('Entro al getProductsById');
 
  if(req.user.cart===undefined)
       res.render("login");

  const pId = req.params.pId; 
  const cId = req.user.cart; 
    const prod =   await productRepository.getProductsById(pId);
   
    res.render("product", { prod, cId });
};


/////////////////////////////////////////////////////////////////////////////////////
export async function getCartsById(req, res) {
  req.logger.debug('Entro al getCartsById');
  const { cId } = req.params;
 
    const cart =  await cartsService.getCartsById(cId);
  res.render("cart", { cart: cart});
};


//////////////////////////////////////////////////////////////////////////////////////////////

export async function ticket(req,res){
  req.logger.debug('Entro al ticket');
  const { cId } = req.params; 

const ticket= await ticketService.createTicket(cId);
   req.logger.debug('Entro al createTicket' ,ticket);
 
  const ticketToSave = new TicketDTO(ticket);
  res.render("ticket",  { ticket: ticketToSave});
 

}
//////////////////////////////////////////////////////////////////////////////////////////////
export function restore(req, res) {
 

  res.render("restore");
};

//////////////////////////////////////////////////////////////////////////////////////////////////////

export async function restablecer(req, res) {

  const  token  = req.params.cId;

  req.session.token=token;
 
  res.render("restablecer");

 
};
//////////////////////////////////////////////////////////////////////////////////////////////////////
export async function recuperacion(req, res) {
  try {
    // console.log("recuperacion en el view.controller");   
     
     const { email } = req.body;

     // Buscar al usuario por correo electrónico
       const user = await userModel.findOne({ email }).lean();

       if (!user) {
        // Usuario no encontrado, manejo del error
        // return res.redirect('/');
        return res.send({ status: "error", result: "User no encontrado" });
      }      
      
     // Generar el token con tiempo de expiración (1 hora)
      const token = jwt.sign({ email }, config.sessionSecret, { expiresIn: '1h' });

       // Actualizar los campos de resetToken y resetTokenExpiration en el documento del usuario
      user.resetToken = token;
     user.resetTokenExpiration = Date.now() + 36000; //  en milisegundos
     
   
     const userac = await userModel.updateOne(user);    

  // Envío de correo 
    const resetUrl = `http://localhost:8080/restablecer/${token}`; 
  
 
        let result = await transport.sendMail({
         from: "hectorjaviermella@gmail.com",      
         to: email,      
         subject: "Mail de recuperacion de contrasena",
         html: `
         <a href="${resetUrl}">
         <button>Recuperacion</button>
       </a>  `,
    
          });

  
   return res.send({ status: "success", result: "mail sent" });
  
  } catch (error) {
    console.log(error);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////
 

  export async function reset(req, res) {

    try {
           
  
    const {  password  } = req.body; 
    const newPassword = password;
    const  token  =   req.session.token;     
    // Verificar el token y obtener el correo electrónico del payload
    const decodedToken = jwt.verify(token,  config.sessionSecret);
    const { email } = decodedToken;
  
     // Buscar al usuario por correo electrónico y verificar si el token es válido y no ha expirado
     const user = await userModel.findOne({ email }).lean();
    
  
     if (!user || user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
       // Token inválido o expirado, manejo del error
       
       //return res.redirect('/');
       return res.send({ status: "novalidolink", result: "expiro el link" });
     }


     //if (user.password != newPassword){

      if (!isValidPassword(user, newPassword)) {
     
  
      // Actualizar la contraseña del usuario y borrar el token y la fecha de expiración
      user.password = createHash(newPassword) ;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      
      const userac = await userModel.updateOne(user);

   
      // Redirigir a la página de inicio de sesión o mostrar un mensaje de éxito
    //  res.redirect('/login');
      
      return res.send({ status: "success", result: "password reset ok" });

     }
     else{
       //console.log("no puede guardar la misma password ");
       return res.send({ status: "mismapass", result: "no puede guardar la misma password " });

     }

    } catch (error) {
      console.log(error);
    }
  
  
  };


//////////////////////////////////////////////////////////////////////////////////////////////////////


//muestra un producto
export async function newproduct(req, res) {
  req.logger.debug('Entro a newproducto');
 
  if(!req.user)
       res.render("login");
       
  ///const pId = req.params.pId; 
 // const cId = req.user.cart; 
  //  const prod =   await productRepository.getProductsById(pId);
   
   // res.render("product", { prod, cId });
  
   res.render("newproduct");
};


///////////////////////////////////////////////////////////////////////////////////