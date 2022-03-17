Local Development Environment Setup Tutorial
===

This guide helps you setup all the tools required to run the application locally and make code changes.

Install NodeJS
---

This application uses NodeJS 12.x (LTS).

You can install NodeJS and NPM by using the official NodeJS installer: <https://nodejs.org/en/download/>

If you work with multiple NodeJS versions, Node version managers, like [`nvm`](https://github.com/nvm-sh/nvm) or [`n`](https://github.com/tj/n), would be handy.

Install AWS SAM
---

AWS SAM is used for local Lambda function development. 

Follow the official installation guide: <https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html>

Run the code
---

The code is broken down into a frontend (React app) and a backend (Lambda function). You can start both parts locally for them to talk to each other.

1. Clone this repository
1. Create `ui/.env.local` file, with this content: 
   ```
   REACT_APP_API_BASE_URL=http://localhost:3001
   ```
1. Start the backend by running the following in `lambda` directory:
   ```
   sam build
   sam local start-api
   ```
1. Start the frontend by running the following in `ui` directory:
   ```
   npm start
   ```

The browser should open http://localhost:3001/ for you to use the app.