package main

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

// getOneMovie gets a single movie from the database
func (app *application) getOneMovie(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.logger.Println(errors.New("invalid id parameter"))
		app.errorJSON(w, err)
		return
	}

	movie, err := app.models.DB.Get(id)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	if err = app.writeJSON(w, http.StatusOK, movie, "movie"); err != nil {
		app.errorJSON(w, err)
		return
	}
}

// getAllMovies gets all movies from the database
func (app *application) getAllMovies(w http.ResponseWriter, r *http.Request) {
	movies, err := app.models.DB.All()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	if err = app.writeJSON(w, http.StatusOK, movies, "movies"); err != nil {
		app.errorJSON(w, err)
		return
	}
}

// deleteMovie deletes a movie from the database
func (app *application) deleteMovie(w http.ResponseWriter, r *http.Request) {

}

// insertMovie inserts a movie to the database
func (app *application) insertMovie(w http.ResponseWriter, r *http.Request) {

}

// updateMovie updates a movie in the database
func (app *application) updateMovie(w http.ResponseWriter, r *http.Request) {

}

// searchMovies searches for a movie in the database
func (app *application) searchMovies(w http.ResponseWriter, r *http.Request) {

}