import { Router } from "express";
import { codeExec } from "./controllers/CompilerController"

const routes = Router();

//rotas
routes.post('/', codeExec);

export default routes;