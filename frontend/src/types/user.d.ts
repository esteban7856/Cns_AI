export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: "padre" | "medico" | "administrador";
  primerIngreso: boolean;
  token: string;
}
