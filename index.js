const findMovieInput = document.querySelector("#findMovieInput");
const mainContent = document.querySelector("main");
const moviesListWrapper = document.querySelector(".moviesListWrapper");

const API_URL = "https://www.omdbapi.com/";
const API_KEY = "9b45ec85";
let page = 1;
let movieName = '';
let selectedMovies = JSON.parse(localStorage.getItem('selectedMovies')) || [];

if (!movieName) {
    movieName = 'Home Alone';
    showMovieList(movieName, page);
}

async function getMoviesList(movieName, page) {
    let response = await fetch(`${API_URL}?apikey=${API_KEY}&s=${movieName}&page=${page}`);
    if (response.ok) {
        let data = await response.json();
        return data;
    }
}

const arrowLeft = document.querySelector("#arrowLeftImg");
const arrowRight = document.querySelector("#arrowRightImg");

function showMovieList(movieName, page) {
    let moviesList = getMoviesList(movieName, page);
    moviesList.then((data) => {
        moviesListWrapper.innerHTML = '';

        if (page === 1) {
            arrowLeft.style.display = 'none';
        }
        else {
            arrowLeft.style.display = 'block';
        }

        if (data.totalResults < 10) {
            arrowRight.style.display = 'none';
        }
        else {
            arrowRight.style.display = 'block';
        }

        data.Search.forEach((item) => {
            if (item.Poster !== "N/A") {
                moviesListWrapper.innerHTML += `
                    <div class="movieItem" imdbID="${item.imdbID}">
                        <img src="${item.Poster}" class="moviePoster" />
                        <div class="movieInfo">
                            <div class="movieTitle">${item.Title}</div>
                            <button class="heartBtn">
                                <img id="heartImg" src="./images/heart.svg" />
                            </button>
                        </div>
                    </div>`;
            }
        });
        let hearts = document.querySelectorAll(".heartBtn");
        addedToSelected(hearts);  
    });
}

function addedToSelected(hearts){
    for (let i = 0; i < hearts.length; i++) {
        hearts[i].addEventListener('click', function (e) {
            if (!hearts[i].classList.contains('redHeart')) {
                hearts[i].innerHTML = '<img id="heartImg" src="./images/red-heart.svg" />';
                hearts[i].classList.add('redHeart');
                if (selectedMovies.indexOf(hearts[i].parentElement.parentElement.getAttribute("imdbID")) === -1) {
                    selectedMovies.push(hearts[i].parentElement.parentElement.getAttribute("imdbID"));
                }
                localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));
            } else {
                hearts[i].innerHTML = '<img id="heartImg" src="./images/heart.svg" />';
                hearts[i].classList.remove('redHeart');
                let k = selectedMovies.indexOf(hearts[i].parentElement.parentElement);
                selectedMovies.splice(k, 1);
                localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));
            }
        });
    }
}

findMovieInput.addEventListener('input', function (e) {
    if (e.target.value.trim()) {
        movieName = e.target.value.trim();
        showMovieList(movieName, page);
    }
});

arrowLeft.addEventListener('click', function (e) {
    page -= 1;
    showMovieList(movieName, page);
});

arrowRight.addEventListener('click', function (e) {
    page += 1;
    showMovieList(movieName, page);
});

let headerHeartBtn = document.querySelector(".headerHeartBtn");
headerHeartBtn.addEventListener('click', function (e) {
    moviesListWrapper.innerHTML = '';
    arrowLeft.style.display = 'none';
    arrowRight.style.display = 'none';
    selectedMovies.forEach((item) => {
        fetch(`${API_URL}?apikey=${API_KEY}&i=${item}`)
            .then((response) => {
                response.json()
                .then((response) => {
                    moviesListWrapper.innerHTML += `
                        <div class="movieItem" imdbID="${response.imdbID}">
                        <img src="${response.Poster}" class="moviePoster" />
                        <div class="movieInfo">
                            <div class="movieTitle">${response.Title}</div>
                            <button class="heartBtn">
                                <img id="heartImg" src="./images/red-heart.svg" />
                            </button>
                        </div>
                    </div>`;
                    let hearts = document.querySelectorAll(".heartBtn");
                    removedFromSelected(hearts);
                });
            });
    });
});

function removedFromSelected(hearts){
    for (let i = 0; i < hearts.length; i++) {
        hearts[i].addEventListener('click', function (e) {
            if (!hearts[i].classList.contains('emptyHeart')) {
                hearts[i].innerHTML = '<img id="heartImg" src="./images/heart.svg" />';
                hearts[i].classList.add('emptyHeart');
                let k = selectedMovies.indexOf(hearts[i].parentElement.parentElement);
                selectedMovies.splice(k, 1);
                localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));
            } else {
                hearts[i].innerHTML = '<img id="heartImg" src="./images/red-heart.svg" />';
                hearts[i].classList.remove('emptyHeart');
                if (selectedMovies.indexOf(hearts[i].parentElement.parentElement.getAttribute("imdbID")) === -1) {
                    selectedMovies.push(hearts[i].parentElement.parentElement.getAttribute("imdbID"));
                }
                localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));
            }
        });
    }
}