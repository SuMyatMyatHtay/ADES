const playURouteDataDiv = document.getElementById('PlayURouteData');
const searchBox = document.getElementById('searchBox');
const searchButton = document.getElementById('searchButton');


searchButton.addEventListener('click', function () {
  const Username = searchBox.value;
  console.log(Username);
  const body = {
    "username": Username
  }

  //  http://localhost:3000/api/playURoute
  axios.post(` http://localhost:3000/api/playURoute`, body) 
  //This is the axios post and the Link that I use for the route to search for
    .then(function (response) {
      const data = response.data[0];
      console.log(response);

      //displaying using the html for data
      const playURouteDataDiv = document.getElementById('PlayURouteData');
      playURouteDataDiv.innerHTML = `
    <h2>Your ID: ${data.yourID}</h2> 
    <h2>Username: ${data.Username}</h2>
    <h2>Created: ${data.Created}</h2>
    <h2>Your Points: ${data.yourPoints}</h2> 
  `;
    }) // used a catch function to show results
    .catch((error) => {
      console.error(error); // when runs and unsuccessful, it will throw error
    });
});
