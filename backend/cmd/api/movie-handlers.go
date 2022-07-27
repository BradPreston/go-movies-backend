package main

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/BradPreston/go-movies/backend/models"
	"github.com/julienschmidt/httprouter"
)

type jsonResponse struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
}

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

// getAllGenres gets all of the genres from the database
func (app *application) getAllGenres(w http.ResponseWriter, r *http.Request) {
	genres, err := app.models.DB.GenresAll()
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	if err = app.writeJSON(w, http.StatusOK, genres, "genres"); err != nil {
		app.errorJSON(w, err)
		return
	}
}

func (app *application) getAllMoviesByGenre(w http.ResponseWriter, r *http.Request) {
	params := httprouter.ParamsFromContext(r.Context())

	genreID, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	movies, err := app.models.DB.All(genreID)
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
	params := httprouter.ParamsFromContext(r.Context())

	id, err := strconv.Atoi(params.ByName("id"))
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	if err = app.models.DB.DeleteMovie(id); err != nil {
		app.errorJSON(w, err)
		return
	}

	ok := jsonResponse{
		OK: true,
	}

	if err = app.writeJSON(w, http.StatusOK, ok, "response"); err != nil {
		app.errorJSON(w, err)
		return
	}
}

type MoviePayload struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Year        string `json:"year"`
	ReleaseDate string `json:"release_date"`
	Runtime     string `json:"runtime"`
	Rating      string `json:"rating"`
	MPAARating  string `json:"mpaa_rating"`
}

// updateMovie updates a movie in the database
func (app *application) editMovie(w http.ResponseWriter, r *http.Request) {
	var payload MoviePayload

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		app.errorJSON(w, err)
		return
	}

	var movie models.Movie

	if payload.ID != "0" {
		id, err := strconv.Atoi(payload.ID)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		m, err := app.models.DB.Get(id)
		if err != nil {
			app.errorJSON(w, err)
			return
		}

		movie = *m
		movie.UpdatedAt = time.Now()
	}

	movie.ID, err = strconv.Atoi(payload.ID)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	movie.Title = payload.Title
	movie.Description = payload.Description
	movie.ReleaseDate, err = time.Parse("01-02-2006", payload.ReleaseDate)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	movie.Year = movie.ReleaseDate.Year()
	movie.Runtime, err = strconv.Atoi(payload.Runtime)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	movie.Rating, err = strconv.Atoi(payload.Rating)
	if err != nil {
		app.errorJSON(w, err)
		return
	}
	movie.MPAARating = payload.MPAARating
	movie.CreatedAt = time.Now()
	movie.UpdatedAt = time.Now()

	if movie.ID == 0 {
		if err = app.models.DB.InsertMovie(movie); err != nil {
			app.errorJSON(w, err)
			return
		}
	} else {
		if err = app.models.DB.UpdateMovie(movie); err != nil {
			app.errorJSON(w, err)
			return
		}
	}

	ok := jsonResponse{
		OK: true,
	}

	err = app.writeJSON(w, http.StatusOK, ok, "response")
	if err != nil {
		app.errorJSON(w, err)
		return
	}
}

// searchMovies searches for a movie in the database
func (app *application) searchMovies(w http.ResponseWriter, r *http.Request) {

}
