import { Router } from "express";
import { codeExec } from "./controllers/CompilerController"

const routes = Router();

//rotas
routes.post('/compiler', codeExec);

export default routes;