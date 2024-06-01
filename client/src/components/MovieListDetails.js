import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MovieListDetails = () => {
    const { listId } = useParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Content-Type': 'application/json' };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lists/details/${listId}`, {
                    method: 'GET',
                    headers
                });

                if (!response.ok) {
                    if (response.status === 403) {
                        toast.error('You do not have access to view this list');
                        navigate('/unauthorized');
                        return;
                    }
                    throw new Error('Failed to fetch list details');
                }

                const data = await response.json();
                setMovies(data);
            } catch (err) {
                console.error('Error fetching list details:', err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [listId, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Movies</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {movies.map((movie) => (
                    <div key={movie._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <img
                            src={movie.Poster}
                            alt={movie.Title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-bold">{movie.Title}</h3>
                        <p className="text-gray-700"><strong>Genre:</strong> {movie.Genre}</p>
                        <p className="text-gray-700"><strong>IMDB Rating:</strong> {movie.imdbRating} stars</p>
                        <p className="text-gray-700"><strong>Runtime:</strong> {movie.Runtime}</p>
                        <p className="text-gray-700"><strong>Released:</strong> {movie.Released}</p>
                        <p className="text-gray-700 mt-2"><strong>Plot:</strong> {movie.Plot}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieListDetails;
