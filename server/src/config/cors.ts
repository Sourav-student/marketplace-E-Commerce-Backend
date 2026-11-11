import cors from "cors";
import { env } from "./env";

export const corsConfig = cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods : ["GET", "POST", "DELETE", "PATCH", "PUT"]
});