# README

## Instructions
Start the MongoDB service to ensure your database is running.
```bash
 sudo systemctl start mongod
```
Change to the directory where your backend code is located.
```bash
 cd backend
```
Install all the necessary Node.js packages specified in your package.json file.
```bash
 npm install
```
To run tests using Mocha, execute:

```bash
 npm test
```

Run the backend server to begin handling requests.
```bash
 npm start
```
Open a separate terminal and navigate to the frontend directory. 
```bash
 cd frontend
```
Install all the necessary Node.js packages specified in your package.json file for the frontend.
```bash
 npm install
```
Run the frontend server to begin serving your application.
```bash
 npm run dev
```
Open another separate terminal and navigate to the frontend directory.
```bash
 cd frontend
```
Start the Tailwind CSS compiler to automatically generate your styles whenever changes are made to your CSS files.
```bash
 npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
```
Open your web browser and go to http://localhost:5173 to view your application.


## Install MongoDB on Linux (Ubuntu 22.04 Jammy)
To install MongoDB on Ubuntu 22.04, follow these steps:
Install the required tools:

`$ sudo apt-get install gnupg curl`

Add MongoDB's public key and repository:

` $ curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor `

Add the MongoDB repository to your system:

`$ echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list`

Update the package list:

`$ sudo apt-get update`

Install MongoDB:

`$ sudo apt-get install -y mongodb-org`

## mongodb cheat cheats
Here are some useful commands for managing the MongoDB service:

Start MongoDB:

`sudo systemctl start mongod`

Access the MongoDB shell:

`mongosh`

Check MongoDB status:

`sudo systemctl status mongod`

Stop MongoDB:

`sudo systemctl stop mongod`

Restart MongoDB:

`sudo systemctl restart mongod`

For detailed MongoDB installation instructions, refer to the official documentation:

https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

