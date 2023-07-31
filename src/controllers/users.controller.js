import  UsersService  from "../services/users.service.js";
import __dirname from "../utils.js";


const usersService = new UsersService();
////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
/** Ejercicio usando req.params
  * Este endpoint nos permite retornar un producto con un id especifico
 */
export async function getUsersById(req, res) {
    try {
       
       const uid = req.params.uid;  

       const users =  await usersService.getUserById(uid);
       if (!users) {
              return res.status(400).send({ status: "error", error: "No se encontro el usuario" });
         }else{
           return res.send({ status: "success", payload: users });
         }
  
        } catch (error) {
         // req.logger.debug(error.message); 
            console.log(error);
        }
     
   };
/////////////////////////////////////////////////////////////////////

export async function switchRol(req, res) {
   
    try {
       const uid = req.params.uid;   
        const usertoupdate =  await usersService.getUserById(uid);
        
        if (!usertoupdate) {
          return res
          .status(400)
          .send({ status: "error", error: "Incomplete values is product" });
        }

        const listadoc = usertoupdate.documents;

       
        let contador = 0;
        if (listadoc){

         // console.log("entro a cargar listadoc");
        
         ///verifico que tenga cargados los documentos para pasar a premiun el usuario

          listadoc.forEach( files =>{
          
              if (files.name.includes("identificacion")) {
                   contador=contador + 1;
                 
              }

              if (files.name.includes("comprobante de domicilio")) {
                contador=contador + 1;
             
              }

              if (files.name.includes("comprobante de estado de cuenta")) {
                contador=contador + 1;
              
              }
               
            });   
         } 
      //  console.log("hay x documentos" , contador ); 
      // console.log("hay x documentos" , usertoupdate.role ); 

      
      //encuentra al primero que cumple la condicion id
      if (usertoupdate.role==='user' && contador===3){
          //  console.log("entro a cambiar 1");
            usertoupdate.role='premium';
         }
      else{
        if (usertoupdate.role!='premium'){
              return res
            .status(400)
            .send({ status: "error", error: "El usuario no termino de cargar los documentos" });
        }
      }

      if (usertoupdate.role==='premium'  && contador!=3){
       
            usertoupdate.role='user';
      }
      
      
          

      const result = await usersService.updateUser(uid,usertoupdate);
      return res.send({ status: "success", payload: result });
    } catch (error) {
    // req.logger.debug(error.message); 
      console.log(error);
    }
  };

  

  /////////////////////////////////////////////////////////////////////

export async function documents(req, res) {
   
  try {
     const uid = req.params.uid;        
    // let { name} = req.body; 
  
     
      const usertoupdate =  await usersService.getUserById(uid);
    if (!usertoupdate) {
      return res
      .status(400)
      .send({ status: "error", error: "Incomplete values is product" });
    }
    

  const files = req.files;
  

  let documents=[];

  if (files.document){
  //  console.log("entroa cargar documents");
      files.document.forEach( files =>{
        const name=`${files.originalname}`
        const reference=`http://localhost:8080/images/documents/${files.originalname}`
       let elem ={
            name,
            reference
       };
        documents.push(elem);
      });   
   } 
   usertoupdate.documents=documents;
  

  const updateUser =  await usersService.updateUser(uid,usertoupdate);
  if (!updateUser) {
    return res
      .status(400)
      .send({ status: "error", error: "No se pudo actualizar usuario" });
  }
  return res.send({ status: "success", payload: updateUser });
  } catch (error) {
  // req.logger.debug(error.message); 
    console.log(error);
  }
};



/////////////////////////////////////////////////////////////////////

export async function profile(req, res) {
   
  try {
     const uid = req.params.uid;        
    // let { name} = req.body; 
    
     //console.log("xxxx entro user.controller");
     
      const usertoupdate =  await usersService.getUserById(uid);
    if (!usertoupdate) {
      return res
      .status(400)
      .send({ status: "error", error: "Incomplete values is product" });
    }
    

  const files = req.files;
 
  const auxprofile=files.profile[0];

  

  let documents=[];

  if (files.profile){
  //  console.log("entroa cargar documents");
      files.profile.forEach( files =>{
        const name=`${files.originalname}`
        const reference=`http://localhost:8080/images/documents/${files.originalname}`
       let elem ={
            name,
            reference
       };
        documents.push(elem);
      });   
   } 
   usertoupdate.profile=documents[0];
  ///console.log("profile xxxx " , usertoupdate );

  const updateUser =  await usersService.updateUser(uid,usertoupdate);
  if (!updateUser) {
    return res
      .status(400)
      .send({ status: "error", error: "No se pudo actualizar usuario" });
  }
  return res.send({ status: "success", payload: updateUser });
  } catch (error) {
  // req.logger.debug(error.message); 
    console.log(error);
  }
};

