import React, { useState, useEffect } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
import Button from 'react-bootstrap/Button';//Import Button component from bootstrap library

//App function component
export default function App() {//Export default App function component
  //=====================STATE VARIABLES============================
  const [error, setError] = useState(null);// State used to store error information
  const [isLoaded, setIsLoaded] = useState(false);//State used to track whether data is loaded
  const [projects, setProjects] = useState([]);//State used to storing project data
  const [newProjectTitle, setNewProjectTitle] = useState("");// State used to store new project title
  const [newProjectDescription, setNewProjectDescription] = useState("");// State used to store new project description
  const [editProjectTitles, setEditProjectTitles] = useState({});// State used to handle editing project titles
  const [editProjectDescriptions, setEditProjectDescriptions] = useState({});// State used to handle editing project descriptions

//===================FETCH JSON DATA=====================
// useEffect hook to fetch data when the API component mounts
  useEffect(() => {

    fetch("http://localhost:8080/api")// Fetch request to the specified endpoint
      .then((res) => res.json())// Convert the response to JSON format
      .then(
        (result) => {// Result if the fetch request is successful
          setIsLoaded(true);// Update loading status to true
          setProjects(result);// Update projects state with fetched data
          console.log(result);
        },
        (error) => {// Result if an error occurs during the fetch
          setIsLoaded(true);// Update loading status to true
          setError("Failed to load data. Please try again later.");// Store any errors that occur during fetching
        }
      );
  }, []);// Empty dependency array means this effect runs only once after the initial render

//============================FUNCTIONS TO HANDLE REQUESTS===============================
//-----------------------------POST REQUEST----------------------------------
// Function to add a new project
  const addProject = async () => {//Define the asnychronous function to add a new project

    //Conditional rendering to ensure that the title is not empty
    if (newProjectTitle.trim() === "") {
      setError("Project title is required.");  // Set an error message in the error state if the title is empty.
      return;// If the title is empty, return early to prevent further execution of the function.
    }

    try {
      const response = await fetch("http://localhost:8080/api", {//Request API URL
        method: "POST",//Request method
        headers: {
          "Content-Type": "application/json",//Type of content being passed
        },
        body: JSON.stringify({
          title: newProjectTitle,//New project title
          description: newProjectDescription,// New project description
        }),
      });

      // Conditional rendering to check the 'ok' property of the 'response' object is false.
      if (!response.ok) {
        throw new Error("Failed to add project.");//Throw an error with the error message if the POST request is unsuccessful 
      }

      const responseData = await response.json();
      console.log(responseData);// Log the response data from the server to the console

      setNewProjectTitle("");
      setNewProjectDescription("");
    } catch (error) {
      setError("Error adding the new project: " + error.message);// Set an error message in the error state
    }
  }

     //---------------------------PUT REQUESTS----------------------------------------
    //---------------Function to edit project title-----------------------
  const editTitle = async (projectId) => {//Define the asynchronous function to edit project title
           //Conditional rendering to check whether the title being edited is empty or undefined
    if (!editProjectTitles[projectId]) {
      setError("Title cannot be empty.");// If the title is empty or undefined, set an error message in the 'error' state.
      return;
    }

    //Conditional rendering to check if the edited title is the same as the current title of the project.
    if (editProjectTitles[projectId] === projects.find(p => p.projectId === projectId).title) {
      return;  

    }

    try {
      const response = await fetch(`http://localhost:8080/api/updateTitle`, {//Request API URL `http://localhost:8080/api/updateTitle`
        method: "PUT",//Request method
        headers: {
          "Content-Type": "application/json",//Type of content being passed
        },
        body: JSON.stringify({
          newTitle: editProjectTitles[projectId],
          projectId: projectId
        }),
      });
         
      // Conditional rendering to check the 'ok' property of the 'response' object is false.
      if (!response.ok) {
        throw new Error("Failed to edit project title.");//Throw an error message if the PUT request is unsuccessful
      }

      setProjects((prevProjects) =>// Use the setProjects function to update the projects state
        prevProjects.map((project) => {//Map over the previous projects array
          if (project.projectId === projectId) {// Conditional rendering to check if the current project matches the edited project
            return { ...project, title: editProjectTitles[projectId] };//If the current project matches, create a new project object with the edited title
          }
          return project;// If the current project doesn't match, return the project object as it is
        })
      );
    } catch (error) {
      setError("Error editing the project title: " + error.message);// Set an error message in the error state
    }
  }

   //--------------Function to edit project description
  const editDescription = async (projectId, description) => {//Define the asynchronous function to edit project description
    if (description === projects.find(p => p.projectId === projectId).description) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/updateDescription`, {//Request API URL `http://localhost:8080/api/updateDescription`
        method: "PUT",//Request method
        headers: {
          "Content-Type": "application/json",//Type of content being passed
        },
        body: JSON.stringify({
          newProjectDescription: description,
          projectId : projectId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit project description.");// Throw an error if the PUT request is not successful
      }

      setProjects((prevProjects) =>// Use the setProjects function to update the projects state
        prevProjects.map((project) => {//Map over the previous projects array
          if (project.projectId === projectId) {// Conditional rendering to check if the current project matches the edited project
            return { ...project, description: description };//If the current project matches, create a new project object with the edited title
          }
          return project;// If the current project doesn't match, return the project object as it is
        })
      );
    } catch (error) {
      setError("Error editing the project description: " + error.message);
    }
  }

  //----------------------DELETE REQUEST-------------------------------
  //Function to delete a project
  const deleteProject = async (projectId) => {//Define the asynchronous function to delete a project from the array
    try {
      const response = await fetch(`http://localhost:8080/api/${projectId}`, {//Fetch API URL `http://localhost:8080/api/${projectId}`
        method: "DELETE",//Request method
        headers: {
          "Content-Type": "application/json",//Type of content being passed
        },
      });
 
      // Conditional rendering to check the 'ok' property of the 'response' object is false.
      if (!response.ok) {
        throw new Error("Failed to delete the project.");//Throw an error if the DELETE request is unsuccessful
      }

         
      setProjects((prevProjects) => // Update the projects state by filtering out the deleted project
        prevProjects.filter((project) => project.projectId !== projectId)
      );
      console.log(response);//Log the response data from the server to the console


    } catch (error) {
      setError("Error deleting the project: " + error.message);// Set an error message in the error state
    }
    
  }
  //=================JSX rendering===============================

  return (
    <>
    {/* Header */}
      <div id='heading'>
        <header id='header'>
         
                <h1 className='h1'>WEB PROJECTS</h1>      
        </header>
      </div>
      {/* section1 */}
      <section id='section1'>
        {/* Form used to add a new project */}
       
        <form onSubmit={addProject} className='form'>
          {/* Row2 */}
            {/* <Row id='row2'className='row'> */}
              {/* <Col className='col'> */}
          {/* Label for Project Title */}
          <label className='label'>TITLE:</label>
          {/* Input field for Project Title */}
          <input
            type='text'
            onChange={(e) => setNewProjectTitle(e.target.value)}// Update the new project title when the input value changes
            value={newProjectTitle}// Bind the value of the input to the state variable newProjectTitle
            className='input'
          />
          {/* Label for Project Description */}
          <label className='label'>DESCRIPTION:</label>
          <input
            type='text'
            onChange={(e) => setNewProjectDescription(e.target.value)}
            value={newProjectDescription}
            className='input'
          />
          <Button type='submit' variant='primary' onClick={addProject} className='btn'>
            ADD PROJECT
          </Button>
           
        </form>
           
      </section>
      {/* Section 2 */}
      <section id='section2'>
        
        {error ? (//Output if an error occurs
          <div id='error'>{error}</div>// Display error message if error state is not null
        ) : !isLoaded ? (//Conditional rendering for if the data has not fully loaded yet
            <div>Loading...</div>// Display loading message if data is not loaded yet
        ) : (
          // Render an unordered list of projects
         
          <ul id='projectList'>
                {/* Map over the projects array and rendering each project */}
            {projects.map((project) => (
              <li key={project.projectId} className='item'>
                
                {/* Display the project title */}
                <div className='title'><h2 className='h2'>
                  TITLE:
                </h2> <h3 className='h3'>{project.title}</h3>{" "}</div>  
                {/* Display the project description */}
                <div className='description'>
                <h2 className='h2'>
                  DESCRIPTION:</h2> <h3 className='h3'>{project.description}</h3>
                </div>
                {/* Button to delete the project */}     
                <Button 
                variant="primary"
                className='btn'
                  onClick={() => deleteProject(project.projectId)}/* Onclick function to delete a project */
                >
                  DELETE
                  </Button>
               
                <div className='editProject'>
                {/* Input field to the project title */}
                <input
                  className='input'
                  value={editProjectTitles[project.projectId] || ""}
                  onChange={(e) =>// Event handler for handling changes to the input field
                    setEditProjectTitles({
                      ...editProjectTitles,// Create a shallow copy of the existing state
                      [project.projectId]: e.target.value,
                    })
                  }
                />
                {/* Button to trigger editing the project title */}
                <Button
                variant='primary'
                  type='button'
                  onClick={() => editTitle(project.projectId)}//onclick event to edit the title
                  className='btn'
                >
                  EDIT TITLE
                </Button>

                {/* Input field for editing the project description */}
                <input
                  className='input'
                  value={editProjectDescriptions[project.projectId] || ""}
                  onChange={(e) =>// Event handler for handling changes to the input field
                    setEditProjectDescriptions({
                      ...editProjectDescriptions,
                      [project.projectId]: e.target.value,
                    })
                  }
                />
                {/* Button to trigger editing the project description */}
                <Button
                variant='primary'
                  type='button'
                  className='btn'
                  onClick={() => editDescription(project.projectId, editProjectDescriptions[project.projectId])}// Event handler for handling changes to the input field
                >
                  EDIT DESCRIPTION
                </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
           
      </section>
     
    </>
  );
}
