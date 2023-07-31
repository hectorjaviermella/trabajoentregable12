
  
export default class UsersRepository {
    constructor(dao) {
      this.dao = dao;
    }
   
      async getUsers(query,limit,page,pCategory,pStatus,sort){
          try {
            let users=0;          
            users = await this.dao.paginate(query, {limit:limit,page:page,pCategory,pStatus,lean:true,sort:sort});   
                             
            return users;
          } catch (error) {
              throw new Error('Error retrieving Users from the database.');
          }
        };

        async getUsers(){
          try {
            let users=0;          
            users = await this.dao.getUsers();   
                             
            return users;
          } catch (error) {
              throw new Error('Error retrieving Users from the database.');
          }
        };
      
  //////////////////////////////////////////////////////////////////////////  
  async getUsersById(uid){
      try {
       console.log("getUsersById  en users.repository",uid);
     
        const users = await this.dao.getUsersById(uid);
        
        return users;
      } catch (error) {
        throw new Error('Error retrieving the users from the database.');
      }
    };

      //////////////////////////////////////////////////////////////////////////  
  async getUsersByCartId(cId){
    try {
    
      const users = await this.dao.getUsersByCartId(cId);
    
      return users;
    } catch (error) {
      throw new Error('Error retrieving the users from the database.');
    }
  };
      //////////////////////////////////////////////////////////////////////////  
  async getUserRole(role){
    try {
      console.log("getusuerrole repository " , role);
      const users = await this.dao.getUserRole(role);
      
      return users;
    } catch (error) {
      throw new Error('Error retrieving the users from the database.');
    }
  };

  
  /////////////////////////////////////////////////////////////////////////  
  async addUser(user){
      try {
        const createdUser = await this.dao.create(user);
        return createdUser;
      } catch (error) {
        console.log(error);
      }
    };
  
  
  /////////////////////////////////////////////////////////////////////////////////
  async deleteUser(pId){
      try {
          let result = await  this.dao.deleteOne({ _id: pId });
        return result;
      } catch (error) {
        console.log(error);
      }
    };
  /////////////////////////////////////////////////////////////////////////////////////
  async updateUser(uid,usernuevo){
      try {
        const createdUser = await this.dao.updateUser( uid, usernuevo);
        return createdUser;
      } catch (error) {
        console.log(error);
      }
    };
  
    }  
    
   