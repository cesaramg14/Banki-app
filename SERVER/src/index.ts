import { app } from "./app";
import { sequelize } from "@config/connection";
import { envs } from "@config/envs";
import "@models/initModels";

const PORT = envs.PORT || 3000;

const main = async () => {
  try {
  
    await sequelize.sync();
    console.log("Database connected successfully");

   
    const server = app.listen(PORT);
    console.log(`Server running on port ${PORT}`);

   
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM. Performing graceful shutdown...');
      await sequelize.close();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('Received SIGINT. Performing graceful shutdown...');
      await sequelize.close();
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
};

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
