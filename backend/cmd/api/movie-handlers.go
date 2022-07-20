package main

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/BradPreston/go-movies/backend/models"
	"github.com/julienschmidt/httprouter"
)

func (app *application) getOneMovie(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.logger.Println(errors.New("invalid id parameter"))
		app.errorJSON(w, err)
		return
	}

	movie := models.Movie {
		ID: id,
		Title: "Some movie",
		Description: "some description",
		Year: 2021,
		ReleaseDate: time.Date(2021, 01, 01, 01, 0, 0, 0, time.Local),
		Runtime: 100,
		Rating: 5,
		MPAARating: "PG-13",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err = app.writeJSON(w, http.StatusOK, movie, "movie"); err != nil {
		app.logger.Println(errors.New("could not write movie to json"))
	}
}

func (app *application) getAllMovies(w http.ResponseWriter, r *http.Request) {
	
}