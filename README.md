# Estimates App

Full stack application for paving contractors to create estimates for their customers

### Technologies and Frameworks Used

- TypeScript
- Node.js/Express
- Jest
- MongoDB
- React
- Bootstrap

## Directory Structure and Important Files for the Back End (server folder)

```
dist/                    // compiled javascript files
node_modules/            // npm modules
src/                     // source folder
-- __tests__/            // tests folder
---- estimates.test.ts   // estimates api endpoint tests
-- controllers/          // route request handlers
---- estimates.ts        // estimates request handlers
-- models/               // database models (mongoose/mongodb)
---- Estimate.ts         // schema for estimate objects
-- routes/               // api routes
---- estimates.ts        // estimates routes
---- index.ts            // groups all routes for the "/api" endpoint
-- util/                 // utilities
---- CustomError.ts      // custom error class
---- functions.ts        // reusable functions
-- app.ts                // instantiate app and register routes
-- config.ts             // store and export env variables
-- db.ts                 // handle database connection and cleanup
-- server.ts             // express server config
.env                     // environment variables
.eslintignore            // ignore files and directories for eslint
.eslintrc.js             // eslint config
.gitignore               // ignore files and directories for git
package.json             // application definition file
tsconfig.json            // config file for typescript
```

## Directory Structure and Important Files for the Front End (client folder)

```
node_modules/            // npm modules
public/                  // static files
-- index.html            // html template root
src/                     // source folder
-- components/           // custom react components
---- Alert.tsx           // alert component
---- Button.tsx          // button component
---- Field.tsx           // form field component
---- InputField.tsx      // input component
---- Switch.tsx          // switch toggle component
-- lib/                  // library folder
---- api.ts              // axios instance for api requests
---- functions.ts        // reusable functions
---- types.ts            // interface for estimates
-- pages/                // routes for each page
---- BuildEstimate.tsx   // estimate builder form
---- Estimate.tsx        // view an existing estimate
---- Home.tsx            // view all estimates
---- NotFound.tsx        // 404 not found page
-- App.tsx               // app logic and routing
-- config.ts             // store and export env variables
-- index.tsx             // app root render
.env                     // environment variables
.gitignore               // ignore files and directories for git
package.json             // application definition file
tsconfig.json            // config file for typescript
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Follow instructions to install and run MongoDB Community Edition - https://www.mongodb.com/docs/manual/administration/install-community/
- Follow instructions to install Node.js (v18+) - https://nodejs.org/en/download/
- Follow instructions to install git - https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- Install an integrated development environment (IDE) such as Visual Studio Code (VS Code)
  - Follow instructions to install VS Code - https://code.visualstudio.com/download
- OPTIONAL : Follow instructions to install Studio 3T - https://studio3t.com/download/
  - Studio 3T is a desktop graphical user interface (GUI) for your MongoDB hosting deployments that allows you to interact with your data

### Installing and Setting Up Your Development Environment

#### Open a terminal/command line and clone the repository (via HTTPS, SSH or GitHub CLI) in a directory of your choice

- Using HTTPS `git clone https://github.com/iamfaisalh/onecrew.git`
- Using SSH `git clone git@github.com:iamfaisalh/onecrew.git`
- Using GitHub CLI `gh repo clone iamfaisalh/onecrew`

Change directory (`cd`) into the repository or open up the repository in VS Code and open the integrated terminal

#### Back end (server) setup

- `cd` into the server directory
- Create a file called `.env` then copy and paste the code below. Replace <YOUR_CONNECTION_STRING> with your MongoDB connection string
  - Connection string example `mongodb://localhost:27017/mydb`
  - Note : Make sure MongoDB is already running in the background. Using the connection string `mongodb://localhost:27017/mydb` will automatically create a database called "mydb" (if it does not exist) when you run the server

```
ALLOWED_ORIGINS="http://localhost:3000"
MONGO_URI="<YOUR_CONNECTION_STRING>"
```

- Install the node_modules with the following command : `npm install`

#### Starting the server

- To run the server in development mode and automatically restart the server upon file changes : `npm run dev`
- To run the server normally :
  - Build the project : `npm run build`
  - Start the server on port 9000 : `npm start`

#### Testing the API

Tests can be found in the `__tests__` directory

- To run tests using Jest : `npm test`
- This should test the following endpoints :
  - `GET /api/estimates` - Fetch all estimates
    - Test 1 : should successfully return a list of estimates
  - `GET /api/estimates/:id` - Fetch one estimate by ID
    - Test 2 : should handle invalid estimate IDs
    - Test 3 : should handle estimates that do not exist
  - `POST /api/estimates`
    - Test 4 : should handle a missing property in the request body
    - Test 5 : should handle an estimate with no items
    - Test 6 : should handle an invalid estimate item
    - Test 7 : should handle a negative rate price on an estimate item
    - Test 8 : should successfully create an estimate

#### Front end (client) setup

- Open a new terminal window
- `cd` into the client directory
- Create a file called `.env` then copy and paste the code below

```
REACT_APP_SERVER_URL="http://localhost:9000/api"
```

- Install the node_modules with the following command : `npm install`
- Start the app in development mode on port 3000 : `npm start`
- Open http://localhost:3000 to view it in your browser
