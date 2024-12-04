import express from 'express';
import { createBlog, deleteBlog, getAllBlogs, getBlog, updateBlog } from '../controllers/BlogController.js';
import { getCliente, addPlanToClient } from '../controllers/ClienteController.js';
import { getClients, getClientById, createClient, updateClient, checkUserExists } from "../controllers/ClientController.js";

import { getPlan } from '../controllers/PlanController.js';
import { fetchAdminById } from '../controllers/AdminController.js';
import { getEmployees } from '../controllers/EmployeeController.js';
import { createProduct, getAllProducts, deleteProduct } from '../controllers/ProductController.js';





const router = express.Router();

// Ruta para obtener un administrador por ID
router.get('/:id', fetchAdminById);

// Ruta para obtener todos los empleados
router.get('/', getEmployees);

// Rutas de Blogs
router.get('/', getAllBlogs);
router.get('/:id', getBlog);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

// Rutas de Clientes

router.get("/client", getClients);
router.get("/client/:id", getClientById);
router.post("/client", createClient);
router.put("/client/:id", updateClient);
router.get("/check-user", checkUserExists);
router.get('/client/:id', getCliente);
router.post('/client/:id/planes', addPlanToClient);

// Rutas de Planes
router.get('/planes/:id', getPlan);
router.patch("/planes/:id", updatePlanEndDate);
router.get("/client/:id/activePlan", checkActivePlan);
router.post("/client/:id/planes", addPlanToClient);

// Rutas para productos
router.post('/', createProduct);         
router.get('/', getAllProducts);         
router.delete('/:id', deleteProduct);    

//Rutas para tickets
router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.get('/client/:clientId', ticketController.getTicketsByClientId);
router.post('/', ticketController.createTicket);
router.post('/update-status', ticketController.updateTicketStatus);

export default router;
