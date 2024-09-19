//TMDB

const API_KEY = "api_key=f4abde90edc036d771807774ecbde7f4";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";

//URL=https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=ae0056049f43748602d2ad32e5bcecc7

const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const genres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const main = document.getElementById("main");
const form = document.getElementById("form"); 
const search = document.getElementById("search"); // function search bar
const tagsEl = document.getElementById("tags");


//Dynamic creation of tags
var selectedGenre = []; //have all ids that we click 
setGenre();
function setGenre() {
  tagsEl.innerHTML = "";
  genres.forEach((genre) => {
    const t = document.createElement("div");
    t.classList.add("tag");
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener("click", () => {
      if (selectedGenre.length == 0) {   //check if anything in selected genre id 
        selectedGenre.push(genre.id);
      } else {
        if (selectedGenre.includes(genre.id)) {  //if id present in genre then dont duplice (1st click takes u to genre then next click takes back to default(remove num from array))
          selectedGenre.forEach((id, idx) => {
            if (id == genre.id) {               //this code line has the functionality mentioned abover
              selectedGenre.splice(idx, 1);
            }
          });
        } else {
          selectedGenre.push(genre.id);
        }
      }
      console.log(selectedGenre);
      getMovies(API_URL + "&with_genres=" + encodeURI(selectedGenre.join(","))); //API called to load genre on screen (discover GET API)
      highlightSelection();
    });
    tagsEl.append(t);
  });
}

//highlights selected genre (keep if needded)
function highlightSelection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach((tag) => {
    tag.classList.remove("highlight");
  });    ///this part removed highlighted genre
  // clearBtn();
  if (selectedGenre.length != 0) {
    selectedGenre.forEach((id) => {
      const hightlightedTag = document.getElementById(id);
      hightlightedTag.classList.add("highlight");
    });
  }
}

getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;
  fetch(url).then((res) => res.json()).then((data) => {
      console.log(data.results);
      if (data.results.length !== 0) {
        showMovies(data.results);
      } else {
        main.innerHTML = `<h1 class="no-results">No Results Found</h1>`;
      }
    });
}

function showMovies(data) {
  main.innerHTML = "";

  data.forEach((movie) => {
    const { title, poster_path, vote_average, overview, id } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    //placeholder image in case of no poster //placeholder image in case of no poster 
    movieEl.innerHTML = `
             <img src="${poster_path ? IMG_URL + poster_path: "http://via.placeholder.com/1080x1580"}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}" onclick="window.open('https://www.themoviedb.org/movie/${id}', '_blank')">Know More</button
            </div>
        
        `;

    main.appendChild(movieEl);

    document.getElementById(id).addEventListener("click", () => {
      console.log(id);
      openNav(movie);
    });
  });
}



function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}


form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value;
  selectedGenre = [];
  setGenre();
  if (searchTerm) {
    getMovies(searchURL + "&query=" + searchTerm); //call API with search parameter
  } else {
    getMovies(API_URL);
  }
});