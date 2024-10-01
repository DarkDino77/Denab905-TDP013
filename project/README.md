# README
## Specfication

We are using Specification 1 for our program.

## install dependencies 
To install all required dependencies, run the following command

`$ npm install `

This command will install all the packages listed in the package.json.

## Start the mongo db server first before you run or test the server
Start MongoDB:

`sudo systemctl start mongod`

### Test
To run tests using Mocha, execute:

`$ npm test` 

This will initiate all the test cases defined in the test.js file.

### Run
To start the program in development mode (using nodemon), run:

`$ npm start` 

Nodemon will automatically restart the application when any file changes.

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

