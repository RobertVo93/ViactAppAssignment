# How to run
1. ### Init the .env field with all the key provided in the .env.example, locate in the root folder
2. ### Install the dependencies
```bash
  npm install
```
3. ### Setup the database
   1. Open the terminal at root folder
   2. Start the docker by running the below command (Note that you need to setup docker on your side, this guide will not instruct you how to setup docker)
   ```bash
      docker compose up -d
   ```
   3. Init the data tables by running the below migration command
   ```bash
      npm run migrate:up
   ```
4. ### Install MySQL Workbench if you want to view the database (https://dev.mysql.com/downloads/workbench/)
5. ### Start the server by running the below command
```bash
  npm run start:dev
```