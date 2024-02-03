import React, { useEffect, useState } from 'react';

export default  function FetchTasks {
  // State variables to store user data and fetched tasks
  const [userData, setUserData] = useState(null);
  const [fetchedTasks, setFetchedTasks] = useState(null);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    // Define an async function to fetch data
    const fetchData = async () => {
      try {
        // Send a GET request to the server's '/findTasks' endpoint
        const response = await fetch('/findTasks', {
          method: 'GET',//Request method
          // mode:'cors',
          headers: {
            'Authorization': `Bearer ${yourAccessToken}`, // Replace with the actual token
            'Content-Type': 'application/json',
          },
        });

        // Check if the network response is successful (status code in the range 200-299)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the JSON data from the response
        const data = await response.json();
        
        // Update the state with the fetched user data and tasks
        setUserData(data.data);
        setFetchedTasks(data.fetchedTasks);
      } catch (error) {
        console.error('Error fetching data:', error);// Log an error message if there's an issue fetching data

      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); // The empty dependency array ensures that this effect runs only once

  return (
    <div>
      {/* Render the fetched data if userData is not null */}
      {userData && (
        <div>
          {/* Display login status as a string */}
          <p>Login: {String(data.login)}</p>     
          {/* Display user data as a JSON string */}
          <p>User Data: {JSON.stringify(userData)}</p>
          {/* Display fetched tasks as a JSON string */}
          <p>Fetched Tasks: {JSON.stringify(fetchedTasks)}</p>
        </div>
      )}
    </div>
  );
};

