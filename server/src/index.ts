import dotenv from 'dotenv';
dotenv.config();
import { app } from './app.ts';
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`server is running at : http://localhost:${PORT}`);
});