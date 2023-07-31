import  TicketService  from "../services/tickets.service.js";


import  CartsService  from "../services/carts.service.js";
import  ProductsService  from "../services/products.service.js";

//const cartsService = new CartsService();
//const productsService = new ProductsService();

const ticketService = new TicketService();
//////////////////////////////////////////////////////////////////////////////////////////////
export async function getTicketsById(req, res) {
  try {
    const tId = req.params.tId;

    
    const ticket = await ticketService.getTicketsById(tId);
    if (!ticket) {
        return res
          .status(400)
          .send({ status: "error", error: "No se pudo encontrar el ticket" });
      }
    return res.send({ status: "success", payload: ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  }

//////////////////////////////////////////////////////////////////////////////////////////////
  export async function createTicket(req, res) {
    try {
      
        const cId = req.params.cId;    
        const ticket = await ticketService.createTicket(cId);
        return res.send({ status: "success", payload: ticket });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

