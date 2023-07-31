import { ticketModel } from "./model/ticket.js";

class Ticket {
  constructor() {}
  
 

  getTicket = async () => {
    const ticket = await ticketModel.find();
    return ticket;
  };

  getTicketsById = async (id) => {
    try {
  
    const user = await userModel.findOne(id).lean();
    return user;
  } catch (error) {
    console.log(error);
  }
  };

  createTicket = async (ticket) => {
    try {
    const createdTicket = await ticketModel.create(ticket);
    return createdTicket;
   } catch (error) {
    console.log(error);
  }
  };
  /////////////////////////////////////////////////////////////////////////////////////
  updateTicket = async (tId,ticketnuevo) =>{
    try {
      const createTicket = await productModel.updateOne({ _id: tId }, ticketnuevo);
      return createTicket;
    } catch (error) {
      console.log(error);
    }
    };
}

export const ticketMongo = new Ticket();