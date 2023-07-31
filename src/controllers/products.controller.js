
import  ProductsService  from "../services/products.service.js";
import { generateProducts } from "../utils.js";

import CustomError from "../services/errors/CustomError.js";
import ErrorCode from "../services/errors/enum.js";
import { addProductErrorInfo,CartErrorInfo } from "../services/errors/info.js";


const productsService = new ProductsService();


//////////////////////////////////////////////////////////////////////////////////////////////
export  async function getProducts(req, res) {
  try {
     req.logger.debug("entro a getProducts"); 
 
      const limit = parseInt(req.query.limit) || 10;  
        const page = parseInt(req.query.page) || 1;    
      const  pCategory = req.query.pCategory;
      const  pStatus  = req.query.pStatus;
      let sort =  req.query.sort;
      if (sort==1)
          sort ={ pPrice :-1};
      else
          sort ={ pPrice :-1};
    
      let query ={
        pCategory: pCategory || { $exists: true },
        pStatus: pStatus || { $exists: true },
      };     
      const products =  await productsService.getProducts(query,limit,page,pCategory,pStatus,sort); 
    
        return res.send({ status: "success", payload: products });
    } catch (error) {
     // req.logger.debug(error.message); 
      console.log(error);
    }
 
};
////////////////////////////////////////////////////////////////////////////////////////////////
/** Ejercicio usando req.params
  * Este endpoint nos permite retornar un producto con un id especifico
 */
export async function getProductsById(req, res) {
  try {

     const pId = req.params.pId;   
     const products =  await productsService.getProductsById(pId);
     if (!products) {
            return res.status(404).send({ status: "error", error: "No se encontro el producto" });
       }else{
         return res.send({ status: "success", payload: products });
       }

      } catch (error) {
       // req.logger.debug(error.message); 
          console.log(error);
      }
   
 };

//////////////////////////////////////////////////////////////////////////////////////////////
export  async function addProduct(req, res) {
  try {
   
        

    let { pTitle, pDescription, pCode, pPrice, pStatus, pStock, pCategory , pOwner} = req.body; 
    
  
  
      
    if (!pOwner){
     // coloca por defecto usuario admin
       pOwner="admin";
       
    }


    if (!pTitle || !pDescription || !pCode || !pPrice || !pStatus || !pStock || !pCategory || !pOwner) {
      // return res.status(400).send({ status: "Error", error: "Incomplete campos" });


            const error = CustomError.createError({
              name: "Add product error",
              cause: addProductErrorInfo({
                pTitle : pTitle,
                    pDescription: pDescription,
                    pCode : pCode ,
                    pPrice : pPrice,
                    pStatus : pStatus,
                    pStock : pStock,
                    pCategory: pCategory,
                    pOwner: pOwner,
              }),
            
              message: "Error trying to create new product"+" "+"because"+" "+addProductErrorInfo({
                pTitle : pTitle,
                pDescription: pDescription,
                pCode : pCode ,
                pPrice : pPrice,
                pStatus : pStatus,
                pStock : pStock,
                pCategory: pCategory,
                pOwner: pOwner, 
              }),
              code: ErrorCode.MISSING_DATA_ERROR,
    
            });
            // console.log(error.message);
           // req.logger.debug(error.message); 
            return res.status(400).send({ status: "Error", error: error.message });
      };


      const newproduct = {
        pTitle,
        pDescription,
        pCode,
        pPrice,
        pStatus,
        pStock,
        pCategory,
        pOwner,
    
      };

    const files = req.files;

    //console.log("files" , files);
 

    newproduct.pThumbnail=[];

    if (files.pThumbnail){
      console.log("entro a cargar imat");
        files.pThumbnail.forEach( files =>{
          const imgUrl=`http://localhost:8080/images/products/${files.filename}`
          newproduct.pThumbnail.push(imgUrl);
        });   
     } 
  
     //console.log("imaggexx  " , newproduct );


  const createdProduct =  await productsService.addProduct(newproduct);
  if (!createdProduct) {
    return res
      .status(400)
      .send({ status: "error", error: "No se pudo crear el producto" });
  }

  return res.send({ status: "success", payload: createdProduct });


} catch (error) {
  //req.logger.debug(error.message); 
  console.log(error);
}
};
//////////////////////////////////////////////////////////////////////////////////////

export  async function updateProducto(req, res) {
   
    try {
              
      const { pId } = req.params;
      const productonuevo = req.body; 
      if (!productonuevo) {
        return res
        .status(400)
        .send({ status: "error", error: "Incomplete values is product" });
      }
      //encuentra al primero que cumple la condicion id
      const result = await productsService.updateProducto(pId,productonuevo);
      return res.send({ status: "success", payload: result });
    } catch (error) {
    // req.logger.debug(error.message); 
      console.log(error);
    }
  };
//////////////////////////////////////////////////////////////////////////////////////
export  async function deleteProduct(req, res) {
    try {
     const { pId } = req.params;
     let result=null;
       
    //console.log("producto a borrar xx: " , pId);
    //console.log("usuario " ,  req.session.user.email);

    const usuarioemail= "adminCoder@coder.com";
      const usuariorole="admin";

     /// const usuarioemail= req.session.user.email;
    //  const usuariorole= req.session.user.role;
       
      let productorecuperado =  await productsService.getProductsById(pId);
      if (!productorecuperado)
      { 
        //console.log("entro a no  borrarxxx  " );
        
        return res
        .status(404).send({
        status: "error",
        error: "Could not delete product. No exist product",
      });
      }
      
     // console.log("usuario rol" , req.session.user.role);
     /// console.log("producto recuperado" , productorecuperado.pOwner);

      if ((usuarioemail === productorecuperado.pOwner)  || (usuariorole==="admin")){
         // console.log("entro a borrar  " );
          result =  await productsService.deleteProduct(pId);
          
      }else{ 
          //console.log("entro a no  borrarxxx  " );
          
          return res
          .status(404).send({
          status: "error",
          error: "Could not delete product. No autorize to delete",
        });
        }

      if (!result) {
        return res
          .status(404).send({
          status: "error",
          error: "Could not delete product. No product found in the database",
        });
      }
      res.send({ status: "Success", payload: result });
    } catch (error) {
     // req.logger.debug(error.message); 
      console.log(error);
    }
  };
  
//////////////////////////////////////////////////////////////////////////////////////
export  async function mockingproducts(req, res) {
  try {
    //req.logger.debug('entro al mockingproducts');
    let products = [];
   
     for (let i = 0; i < 100; i++) {
       products.push(generateProducts());
     }
     res.json({
       status: "success",
       payload: products,
     });
  } catch (error) {
   // req.logger.debug(error.message);  
    console.log(error);
  }
};
