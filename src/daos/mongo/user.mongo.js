import { userModel } from "./model/user.js";

class User {
  constructor() {}
  
 
//////////////////////////////////////////////////////////
  getUsers = async () => {
    const user = await userModel.find();
    return user;
  };
///////////////////////////////////////////////////////
  getUsersById = async (uid) => {
    const user = await userModel.findById({ _id: uid}).lean();  
    
    return user;
  };

  ///////////////////////////////////////////////////////
  getUsersByCartId = async (cid) => {
    
    
    const user = await userModel.findOne({ cart: cid.cart}).lean();
    
 
    
    return user;
  };

  
  ///////////////////////////////////////////////////////
  getUserRole = async (role) => {
  
    const user = await userModel.findById({ role: role}).lean();  
    
    return user;
  };
////////////////////////////////////////////////////////
  createUser = async (user) => {
    const createdUser = await userModel.create(user);
    return createdUser;
  };


/////////////////////////////////////////////////////////////////////////////////////
async updateUser(uid,usernuevo){
    try {
      const createdProduct = await userModel.updateOne({ _id: uid }, usernuevo);
      return createdProduct;
    } catch (error) {
      console.log(error);
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////
  
/////////////////////////////////////////////////////////

}
export const userMongo = new User();