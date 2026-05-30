import 'dotenv/config';
import app from './app';
import { prisma } from './config/db';

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');
  } catch (error) {
    console.error('Warning: Failed to connect to database. Server will run but DB features may fail:', error);
  }
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
