const express = require('express'); // Import the Express web framework
const fs = require('fs'); // Import the File System module
const bodyParser = require('body-parser');//Import the bodyParser module
const app = express(); // Create an instance of the Express application
const cors = require('cors');//Import the cors module
const port = process.env.PORT || 8080; // Define the port the server will listen on

//=========================MIDDLEWARE SETUP======================================
app.use(bodyParser.urlencoded({ extended: false }));//Parse incoming requests with payloads attatched to it
app.use(bodyParser.json());//Returns middleware that parses and requests where the Content-Type matches the type option
app.use(cors());//Enables CORS for handling cross-origin requests.

//========================REQUESTS================================
//------------------GET REQUEST-------------------------
// GET route to retrieve projects
app.get('/api', (req, res) => {
    const projectId = req.query.projectId;// Get the projectId from query parameter

    if (projectId) {
        const project = getProjectById(projectId);// Fetch the project by projectId
        if (project) {
            res.json(project); // Respond with the project if found
        }
        else {
            res.status(404).send(`Project with ID ${projectId} not found.`);
            // Respond with a 404 error(Not Found) if the project is not found
        }
    }
    else {
        // If no projectId provided, fetch and respond with all projects
        const projects = getAllProjects();//Get the array of projects
        res.json(projects); // Respond with all the projects in JSON format
    }
});

//---------------------------POST REQUEST------------------------------
// POST route to add a new project
app.post('/api', (req, res) => {
    const project = req.body;// Get the project data from the request body
    addProject(project);
    res.send("success");
});

//--------------------------PUT REQUESTS----------------------------------
// PUT route to update project title
app.put('/api/updateTitle', (req, res) => {
    const index = req.body.projectId;// Get the current title from the query parameter
    const newTitle = req.body.newTitle;// Get the new title from the query parameter
    const projects = getAllProjects();//Get the array of projects

    if (index > -1) {
        projects[index].title = newTitle;
        console.log(projects);
        fs.writeFileSync('projects.json', JSON.stringify(projects));// Write the updated data to file
        res.send('Title updated'); // Respond after updating the title
    } else {
        res.status(404).send('Title could not be found');// Respond with a 404 error if the description cannot be found

    }
});

// PUT route to update project description
app.put('/api/updateDescription', (req, res) => {
    const projectIndex = req.body.projectId;// Previous description
    const newDescription = req.body.newDescription;// New description
    const projects = getAllProjects();// Get the array of projects


    if (projectIndex > -1) {
        projects[projectIndex].description = newDescription;
        fs.writeFileSync('projects.json', JSON.stringify(projects));// Write the updated data to file
        console.log(projects);
        res.send("Description updated"); // Respond after updating the description
    } else {
        res.status(404).send('Description could not be found'); // Respond with a 404 error if the description cannot be found

    }
});

//------------------------DELETE REQUEST----------------------------
// DELETE route to delete a project
app.delete('/api', (req, res) => {
    const projectId = req.query.projectId;// Get the projectId from query parameter
    const projects = getAllProjects();// Get the array of projects

    const projectIndex = projects.findIndex(project => project.projectId === projectId);

    if (projectIndex > -1) {
        deleteProject(projectId);
        res.send("Project deleted."); // Respond after deleting the project

    } else {
        res.status(404).send('Project with the given ID not found.');
        // Respond with a 404 error if the description cannot be found
    }
});
//=========================FUNCTIONS====================================

// Function to read and parse projects data from 'projects.json' file
function getAllProjects() {
    try {
        const content = fs.readFileSync('projects.json', 'utf8'); // Read project data from 'projects.json'
        return JSON.parse(content);// Parse the JSON content and return
    } catch (error) {
        fs.writeFileSync('projects.json', '[]');// Write an empty array to 'projects.json'
        return [];// Return an empty array if an error occurs
    }
}

//Function to add a new project
function addProject(project) {
    const projects = getAllProjects();// Get the array of projects
    projects.push(project);// Add the new project to the list
    fs.writeFileSync('projects.json', JSON.stringify(projects));// Write changes to file
}
// Function to delete a project by projectId
function deleteProject(projectId) {
    const projects = getAllProjects();//Get the array of projects
    const index = projects.findIndex(project => project.projectId === projectId);//callback function

    if (index !== -1) {
        projects.splice(index, 1);//Remove project from list
        fs.writeFileSync('projects.json', JSON.stringify(projects));//Write the updated 
    }
}

// Function to get a project by ID
function getProjectById(projectId) {
    const projects = getAllProjects();// Get the array of projects
    return projects.find(project => project.projectId === projectId);// Find the project by projectId
}

// ---------------Start the server-----------------
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);//Display a message in the console indicating that the server is running.
});