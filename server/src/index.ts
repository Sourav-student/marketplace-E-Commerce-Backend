import dotenv from 'dotenv';
dotenv.config();
import { app } from './app.ts';
import { connectRedis } from './config/redis.ts';
const PORT = process.env.PORT || 8000;

connectRedis();

app.listen(PORT, () => {
  console.log(`server is running at : http://localhost:${PORT}`);
});