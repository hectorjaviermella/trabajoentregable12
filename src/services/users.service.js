
import { userRepository } from "../repositories/index.js";
import UserDTO from "../daos/dtos/user.dto.js";

export default class UserService {
  constructor() {}

///////////////////////////////////////////////////////////

getUsers(query,limit,page,pCategory,pStatus,sort) {
    const users = userRepository.getUsers(query,limit,page,pCategory,pStatus,sort);
    return users;
  }

////////////////////////////////////////////////////////////////////////
async getUserById(id) {
  try {
    
    const user = await userRepository.getUsersById(id);
    return user;
  } catch (error) {
    console.log();
    return null;
  }
};

////////////////////////////////////////////////////////////////////////
async getUsersByCartId(id) {
  try {
    
    const user = await userRepository.getUsersByCartId(id);
    return user;
  } catch (error) {
    console.log();
    return null;
  }
};
////////////////////////////////////////////////////////////////////////
async getUserRole(role) {
  try {
    
    const user = await userRepository.getUserRole(role);
    return user;
  } catch (error) {
    console.log();
    return null;
  }
};
////////////////////////////////////////////////////////////////////////

create(user) {
    const result = userRepository.addUser(user);
    return result;
  }
////////////////////////////////////////////////////////////////////////

updateUser(uid,user) {
    const createdUser = userRepository.updateUser(uid,user);
    return createdUser;
  }
////////////////////////////////////////////////////////////////////////

deleteUser(pId) {
    const result = userRepository.deleteUser(pId);
    return result;
  }



/////////////////////////////////////////////////////////////////////////////////////
}


