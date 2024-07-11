const cl = console.log;
const moviecontainer = document.getElementById("moviecontainer");
const backdrop = document.getElementById("backdrop");
const movieModel = document.getElementById("movieModel");
const addmoviebtn = document.getElementById("addmoviebtn");
const movieClose = [...document.querySelectorAll(".movieClose")];
const movieform = document.getElementById("movieform");
const titleControls = document.getElementById("title");
const movieurlControls = document.getElementById("movieurl");
const contentControls = document.getElementById("content");
const ratingControls = document.getElementById("rating");
const submitbtn = document.getElementById("submitbtn");
const updatebtn = document.getElementById("updatebtn");

const generateUuid = () => {
  return String("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(
    /[xy]/g,
    (character) => {
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random & 0x3) | 0x8;

      return value.toString(16);
    }
  );
};

const createMovieCards = (arr) => {
  let result = " ";

  arr.forEach((movie) => {
    result += `<div class="col-md-4 mb-4 mb-md-0">
                   <div class="card movieCard" id="${movie.movieId}">                   
                        <figure class="m-0">
                            <img src=${movie.movieurl} alt="">
                        
                            <figcaption>
                               <div class="figcapinfo">
                                <h3>${movie.title}</h3>
                                <strong>Rating:${movie.rating}/5</strong>
                                <p>
                                ${movie.content}
                                </p>
                                </div>
                                <div>
                                    <button class="btn btn-sm btn-light" onclick="onMovieEdit(this)">
                                     Edit
                                    </button>
                                    <button class="btn btn-sm nfx-btn text-white" onclick="onMovieRemove(this)">
                                      Remove
                                    </button>
                                 </div>
                            </figcaption> 
                            
                        
                        </figure>
                                                                  
                        </div>
                    </div>`;

    moviecontainer.innerHTML = result;
  });
};

let movieArr = JSON.parse(localStorage.getItem("movieArr")) || [];

if (movieArr.length > 0) {
  createMovieCards(movieArr);
}

const toggleModalBackdrop = () => {
  backdrop.classList.toggle(`visible`);
  movieModel.classList.toggle(`visible`);
  updatebtn.classList.add(`d-none`);
  submitbtn.classList.remove(`d-none`);

  movieform.reset();
};

const onMovieRemove = (ele)=>{
    Swal.fire({
        title: "Do you want to remove this movie?",
        showCancelButton: true,
        confirmButtonText: "Remove",
        confirmButtonColor: "#e50914",
        cancelButtonColor: "#000",
        
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            let removeId = ele.closest('.movieCard').id;
            cl(removeId)

            //remove from array
            let getIndex = movieArr.findIndex(movie=> movie.movieId===removeId);

            movieArr.splice(getIndex,1);

            //remove from LS
            localStorage.setItem("movieArr",JSON.stringify(movieArr));

            //remove from UI
            ele.closest('.movieCard').parentElement.remove();

            swal.fire({
                title:`Movie removed successfully`,
                timer:2500,
                icon:'success'
            })
        } 
      });
    
}

const onMovieEdit = (ele) => {
  toggleModalBackdrop();
  let editId = ele.closest('.movieCard').id;
  cl(editId);
  localStorage.setItem("editmovieId", editId);
  updatebtn.classList.remove(`d-none`);
  submitbtn.classList.add(`d-none`);

  let editMovieObj = movieArr.find((movie) => movie.movieId === editId);

  titleControls.value = editMovieObj.title;
  movieurlControls.value = editMovieObj.movieurl;
  contentControls.value = editMovieObj.content;
  ratingControls.value = editMovieObj.rating;
};

const onmovieAdd = (eve) => {
  eve.preventDefault();
  let movieObj = {
    title: titleControls.value,
    movieurl: movieurlControls.value,
    content: contentControls.value,
    rating: ratingControls.value,
    movieId: generateUuid(),
  };
  cl(movieObj);
  movieform.reset();
  movieArr.unshift(movieObj);
  localStorage.setItem("movieArr", JSON.stringify(movieArr));
  // createMovieCards(movieArr);
  toggleModalBackdrop();

  swal.fire({
    title: `New movie ${movieObj.title}is added successfully!!!`,
    timer: 2500,
    icon: "success",
  });

  //we will create a new card for new movie object

  let div = document.createElement("div");

  div.className = "col-md-4";

  div.innerHTML = `<div class="card movieCard" id="${movieObj.movieId}">                   
                        <figure class="m-0">
                            <img src=${movieObj.movieurl} alt="">
                        
                            <figcaption>
                                <h3>${movieObj.title}</h3>
                                <strong>Rating:${movieObj.rating}/5</strong>
                                <p>
                                ${movieObj.content}
                                </p>
                                <div>
                                    <button class="btn btn-sm btn-light" onclick="onMovieEdit(this)">
                                     Edit
                                    </button>
                                    <button class="btn btn-sm nfx-btn text-white" onclick="onMovieRemove(this)">
                                      Remove
                                    </button>
                                 </div>`;

  moviecontainer.prepend(div);
};

movieClose.forEach((btn) => {
  btn.addEventListener("click", toggleModalBackdrop);
});

const onupdatemovie = () => {
  //updateId

  let updatemovieId = localStorage.getItem("editmovieId");
  //updateobj

  let updatemovieObj = {
    title: titleControls.value,
    movieurl: movieurlControls.value,
    content: contentControls.value,
    rating: ratingControls.value,
    movieId: updatemovieId,
  };

  cl(updatemovieObj);

  let getIndex = movieArr.findIndex(movie => movie.movieId===updatemovieId);

  movieArr[getIndex] = updatemovieObj;

  localStorage.setItem("movieArr", JSON.stringify(movieArr));

  let getMovieCard = document.getElementById(updatemovieId);

  getMovieCard.innerHTML=`<figure class="m-0">
                            <img src=${updatemovieObj.movieurl} alt="">
                        
                            <figcaption>
                                <h3>${updatemovieObj.title}</h3>
                                <strong>Rating:${updatemovieObj.rating}/5</strong>
                                <p>
                                ${updatemovieObj.content}
                                </p>
                                <div>
                                    <button class="btn btn-sm btn-light" onclick="onMovieEdit(this)">
                                     Edit
                                    </button>
                                    <button class="btn btn-sm nfx-btn text-white" onclick="onMovieRemove(this)">
                                      Remove
                                    </button>
                                 </div>
                            </figcaption> 
                            
                        
                        </figure>`

  toggleModalBackdrop();
}

addmoviebtn.addEventListener("click", toggleModalBackdrop);
movieform.addEventListener("submit", onmovieAdd);
updatebtn.addEventListener("click", onupdatemovie);
