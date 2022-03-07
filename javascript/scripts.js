// Create app object //
const movieMood = {}

// Variables for API information //
movieMood.apiURL = `https://api.themoviedb.org/3/discover/movie`;
movieMood.apiKey = `c7b080a6a4bebf767174709ad40d8d83`;


// Event Listener: Listen for the user input //
movieMood.eventListenerSetup = function () {

    // Show year value under slider bar
    let slider = document.getElementById("user-input-two");
    let output = document.getElementById("selectedYear");

    // Display slider value on the page
    output.innerHTML = slider.value;
    
    // Update the with current slider value as it is moved
    slider.oninput = function() {
        output.innerHTML = this.value;
    }
    
    const userInput = document.querySelector('button');

    userInput.addEventListener("click", function () {

        // Get search parmeter inputs from user //
        const userGenreInput = document.getElementById("user-input-one");
        const userGenreValue = userGenreInput.value;

        const userDecadeInput = document.getElementById("user-input-two");
        const userDecadeValue = userDecadeInput.value;

        movieMood.getMovie(userDecadeValue, userGenreValue);
    });


    // Method to retrive data from API //
    movieMood.getMovie = function (userDecadeValue, userGenreValue) {

        // Construct URL endpoint and specify the paremeters we want to include  //
        const url = new URL(movieMood.apiURL);
        url.search = new URLSearchParams({
            // include URL parms here
            api_key: movieMood.apiKey,
            year: userDecadeValue,
            with_genres: userGenreValue,
        });


        // Pass in new URL featuring params provided by the URLSearchParams constructor //
        fetch(url)
            .then(function (response) {
                // Parse this response into JSON
                // Return JSON response so that it can be used in the next function
                return response.json();
            })
            //Parse the JSON Promise response and log out readable data (AKA data in JSON format)
            .then(function (jsonResponse) {

                // Get the total number query results pages
                let totalPages = jsonResponse.total_pages;
                // Make sure we have a full page of results
                totalPages = totalPages - 1;
                // Gereate a random page number to return
                const randomPage = Math.floor(Math.random() * `${totalPages}`) + 1;

                movieMood.getDetails(userDecadeValue, userGenreValue, randomPage);
            });
    }


    // Second API call to get specific page of results (and combine poster_path results to grab poster img files)
    movieMood.getDetails = function (userDecadeValue, userGenreValue,randomPage) {

        // Construct URL endpoint and specify the paremeters we want to include  //
        const url = new URL(movieMood.apiURL);
        url.search = new URLSearchParams({
            // include URL parms here
            api_key: movieMood.apiKey,
            year: userDecadeValue,
            with_genres: userGenreValue,
            page: `${randomPage}`
        });


        // Pass in new URL featuring params provided by the URLSearchParams constructor //
        fetch(url)
            .then(function (responseTwo) {
                // Parse this response into JSON
                // Return JSON response so that it can be used in the next function
                return responseTwo.json();
            })
            //Parse the JSON Promise response and log out readable data (AKA data in JSON format)
            .then(function (jsonResponseTwo) {
                movieMood.displayMovies(jsonResponseTwo);
            });
    }
}



// Create method to display to display API data //
movieMood.displayMovies = function (jsonResponseTwo) {

    // Clear the old movie selections //
    const ulElement = document.querySelector('#movie-display-ul');
    ulElement.innerHTML = '';

    
    // Display the first 3 movies returned from the random page of query results array//
    for (let i = 0; i <= 2; i++) {
        const basePosterUrl = 'https://image.tmdb.org/t/p/w300';
        const movieTitle = jsonResponseTwo.results[i].title;
        const moviePoster = jsonResponseTwo.results[i].poster_path;
        const movieSynopsis = jsonResponseTwo.results[i].overview;

        // Create li element for movies to be appended onto page
        const liElement = document.createElement('li');
        liElement.classList.add('movie');

        // Create h2 element for movie title to be appended
        const heading = document.createElement('h2');
        heading.textContent = movieTitle;

        // Create img element for movie poster to be appended onto page 
        const image = document.createElement('img');
        if (!moviePoster) {
            image.src = './assets/noPosterImg.jpg';
        } else {
            image.src = basePosterUrl+moviePoster;
        }

        // Create p element for movie synopsis to be appended onto page
        const paragraph = document.createElement('p');

        // Paragraph.classList.add ("synopsis");
        paragraph.textContent = movieSynopsis;
        liElement.append(image, heading, paragraph);

        // Add the li to the ul //
        ulElement.appendChild(liElement);
    };
}


// Create app intialization method //
movieMood.init = function () {
    movieMood.eventListenerSetup();
};

// Call init method //
movieMood.init();