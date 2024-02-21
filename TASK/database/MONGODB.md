# Express-generator-MONGODB
express-generator with mongodb

## TABLE OF CONTENTS
1. [DEPENDENCIES](#dependencies)
2. [FILE STRUCTURE](#file-structure)

## DEPENDENCIES


### BACK-END
```bash
npx express-generator
npm install jsonwebtoken
npm install nodemone
npm install cors
npm install body-parser
npm install mongoose
npm install dotenv
```
### FRONT-END
```
npx create-react-app front-end
npm i react-bootstrap bootstrap
```
## FILE STRUCTURE 
```
your_project/
├── bin/
│   └── www                 # Entry point for your Express app
├── models/
│   └── your_model.js       # Mongoose model definitions
├── public/                 # Static files (css, js, images)
├── routes/
│   └── index.js            # Route definitions
├── views/                  # Template files (ejs, pug, etc.)
├── app.js                  # Main application file, where Express app is configured
├── package.json            # Project dependencies and scripts
└── .env                    # Environment variables (optional)
```

1. **bin/www**: This is the entry point of your Express application. It typically creates the HTTP server and listens on a port.

2. **models/**: This directory contains your Mongoose model definitions. Each model file defines a schema and interacts with MongoDB using Mongoose.

3. **public/**: This directory holds static assets like CSS, JavaScript, and images.

4. **routes/**: This directory contains route definitions for your application. Each file typically represents a different route or a group of related routes.

5. **views/**: This directory contains your view templates. These can be rendered by your routes to generate HTML to be sent to the client.

6. **app.js**: This is where you configure your Express application. You set up middleware, routes, and connect to the database (in this case, MongoDB using Mongoose).

7. **package.json**: This file lists your project dependencies and may also include scripts for running your application, among other things.

8. **.env**: This file is used to store environment variables. It's optional but often used to store sensitive information like database URIs.
