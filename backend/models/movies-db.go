package models

import (
	"context"
	"database/sql"
	"fmt"
	"time"
)

// DBModel is the type for a DB model
type DBModel struct {
	DB *sql.DB
}

// Get returns one movie and an error, if any
func (m *DBModel) Get(id int) (*Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3 * time.Second)
	defer cancel()

	query := `
	SELECT
		id, title, description, year, release_date, rating, runtime, mpaa_rating, created_at, updated_at
	FROM
		movies
	WHERE
		id = $1
	`

	row := m.DB.QueryRowContext(ctx, query, id)

	var movie Movie
	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.Description,
		&movie.Year,
		&movie.ReleaseDate,
		&movie.Rating,
		&movie.Runtime,
		&movie.MPAARating,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	// get the genres
	query = `
	SELECT
		mg.id, mg.movie_id, mg.genre_id, g.genre_name
	FROM
		movies_genres mg
		left join genres g on (g.id = mg.genre_id)
	WHERE
		mg.movie_id = $1
	`
	rows, err := m.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	genres := make(map[int]string) 
	for rows.Next() {
		var mg MovieGenre
		err := rows.Scan(
			&mg.ID,
			&mg.MovieID,
			&mg.GenreID,
			&mg.Genre.GenreName,
		)
		if err != nil {
			return nil, err
		}
		genres[mg.ID] = mg.Genre.GenreName
	}

	movie.MovieGenre = genres

	return &movie, nil
} 

// All returns all movies and an error, if any
func (m *DBModel) All(genre ...int) ([]*Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3 * time.Second)
	defer cancel()

	where := ""
	if len(genre) > 0 {
		where = fmt.Sprintf("WHERE id IN (SELECT movie_id FROM movies_genres WHERE genre_id = %d)", genre[0])
	}

	query := fmt.Sprintf(`
	SELECT
		id, title, description, year, release_date, runtime, rating, mpaa_rating, created_at, updated_at
	FROM
		movies %s
	ORDER BY
		title
	`, where)
	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*Movie

	for rows.Next() {
		var movie Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.Description,
			&movie.Year,
			&movie.ReleaseDate,
			&movie.Runtime,
			&movie.Rating,
			&movie.MPAARating,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		// get the genres
		genreQuery := `
		SELECT
			mg.id, mg.movie_id, mg.genre_id, g.genre_name
		FROM
			movies_genres mg
			left join genres g on (g.id = mg.genre_id)
		WHERE
			mg.movie_id = $1
		`
		genreRows, err := m.DB.QueryContext(ctx, genreQuery, movie.ID)
		if err != nil {
			return nil, err
		}

		genres := make(map[int]string) 
		for genreRows.Next() {
			var mg MovieGenre
			err := genreRows.Scan(
				&mg.ID,
				&mg.MovieID,
				&mg.GenreID,
				&mg.Genre.GenreName,
			)
			if err != nil {
				return nil, err
			}
			genres[mg.ID] = mg.Genre.GenreName
		}
		genreRows.Close()

		movie.MovieGenre = genres
		movies = append(movies, &movie)
	}

	return movies, nil
}

func (m *DBModel) GenresAll() ([]*Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3 * time.Second)
	defer cancel()

	query := `
	SELECT
		id, genre_name, created_at, updated_at
	FROM
		genres
	ORDER BY
		genre_name
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*Genre
	for rows.Next() {
		var genre Genre
		err := rows.Scan(
			&genre.ID,
			&genre.GenreName,
			&genre.CreatedAt,
			&genre.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &genre)
	}

	return genres, nil
}

// func (m *DBModel) GetMoviesByGenre(id int) ([]*Movie, error) {
// 	ctx, cancel := context.WithTimeout(context.Background(), 3 * time.Second)
// 	defer cancel()

// 	var movies []*Movie

// 	query := `
// 	SELECT
// 		g.id, g.genre_name, g.created_at, g.updated_at, mg.genre_id, mg.movie_id
// 	FROM
// 		genres g
// 		left join movies_genres mg (mg.genre_id = g.id)
// 	WHERE
// 		g.id = $1
// 	`

// 	return movies, nil
// }


// func (m *DBModel) GetMoviesByGenre(id int) ([]*Movie, error) {
// 	ctx, cancel := context.WithTimeout(context.Background(), 3 * time.Second)
// 	defer cancel()

// 	var movies []*Movie

// 	query := `
// 	SELECT
// 		g.id, g.genre_name, g.created_at, g.updated_at, mg.genre_id, m
// 	FROM
// 		genre g
// 		left join movies_genres mg (mg.genre_id = g.id)
// 		left join movies m (m.id = mg.movie_id)
// 	WHERE
// 		g.id = $1
// 	`
// 	rows, err := m.DB.QueryContext(ctx, query, id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer rows.Close()

// 	for rows.Next() {
// 		// var genre Genre
// 		// err := rows.Scan(
// 		// 	&genre.ID,
// 		// 	&genre.GenreName,
// 		// 	&genre.CreatedAt,
// 		// 	&genre.UpdatedAt,
// 		// )
// 		// if err != nil {
// 		// 	return nil, err
// 		// }

// 		var movie Movie
// 		err := rows.Scan(
// 			&movie.ID,
// 			&movie.Title,
// 			&movie.Description,
// 			&movie.Year,
// 			&movie.ReleaseDate,
// 			&movie.Runtime,
// 			&movie.Rating,
// 			&movie.MPAARating,
// 			&movie.CreatedAt,
// 			&movie.UpdatedAt,
// 		)
// 		if err != nil {
// 			return nil, err
// 		}

// 		movies = append(movies, &movie)

// 		// mgQuery := `
// 		// SELECT
// 		// 	mg.id, mg.movie_id, mg.genre_id, mg.created_at, mg.updated_at, m.id
// 		// FROM
// 		// 	movies_genres mg
// 		// 	left join movies m (m.id = mg.movie_id)
// 		// WHERE
// 		// 	mg.genre_id = $1
// 		// `
// 		// mgRows, err := m.DB.QueryContext(ctx, mgQuery, genre.ID)
// 		// if err != nil {
// 		// 	return nil, err
// 		// }

// 		// for mgRows.Next() {
// 		// 	var mg MovieGenre
// 		// 	err := mgRows.Scan(
// 		// 		&mg.ID,
// 		// 		&mg.MovieID,
// 		// 		&mg.GenreID,
// 		// 		&mg.CreatedAt,
// 		// 		&mg.UpdatedAt,
// 		// 	)
// 		// 	if err != nil {
// 		// 		return nil, err
// 		// 	}

// 		// 	movieQuery := `
// 		// 	SELECT
// 		// 		m.id, m.title, m.description, m.year, m.release_date, m.runtime, m.rating, m.mpaa_rating, m.created_at, m.updated_at, mg.movie_id
// 		// 	FROM
// 		// 		movies m
// 		// 		left join movies_genres mg (mg.movie_id = m.id)
// 		// 	WHERE
// 		// 		m.id = $1
// 		// 	`

// 		// 	// movieQuery := `
// 		// 	// SELECT
// 		// 	// 	id, title, description, year, release_date, runtime, rating, mpaa_rating, created_at, updated_at
// 		// 	// FROM
// 		// 	// 	movies
// 		// 	// WHERE
// 		// 	// 	id = $1
// 		// 	// `

// 		// 	movieRows, err := m.DB.QueryContext(ctx, movieQuery, mg.MovieID)
// 		// 	if err != nil {
// 		// 		return nil, err
// 		// 	}
// 		// 	for movieRows.Next() {
// 		// 		var movie Movie

// 		// 		err := rows.Scan(
// 		// 			&movie.ID,
// 		// 			&movie.Title,
// 		// 			&movie.Description,
// 		// 			&movie.Year,
// 		// 			&movie.ReleaseDate,
// 		// 			&movie.Runtime,
// 		// 			&movie.Rating,
// 		// 			&movie.MPAARating,
// 		// 			&movie.CreatedAt,
// 		// 			&movie.UpdatedAt,
// 		// 		)
// 		// 		if err != nil {
// 		// 			return nil, err
// 		// 		}

// 		// 		movies = append(movies, &movie)
// 		// 	}
// 		// 	defer movieRows.Close()
// 		// }
// 		// defer mgRows.Close()
// 	}
// 	return movies, nil
// }