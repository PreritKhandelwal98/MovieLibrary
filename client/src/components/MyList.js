import React, { useState, useEffect } from 'react';

function MyList() {
    const [lists, setLists] = useState([]);
    const [visibleListId, setVisibleListId] = useState(null); // State to track which list's details are visible
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLists = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User not logged in');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/lists', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch lists');
                }

                const data = await response.json();
                setLists(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLists();
    }, []);

    const handleListClick = (listId) => {
        // Toggle the visibility of the selected list's movies
        setVisibleListId((prevListId) => (prevListId === listId ? null : listId));
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>My Lists</h1>
            {lists.length > 0 ? (
                <ul>
                    {lists.map((list) => (
                        <li key={list._id}>
                            <button
                                onClick={() => handleListClick(list._id)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                {list.name}
                            </button>
                            {visibleListId === list._id && (
                                <ul className="mt-2 ml-4">
                                    {list.movies.map((movie) => (
                                        <li key={movie._id} className="mb-2">
                                            <h3 className="text-xl font-bold">{movie.Title}</h3>
                                            <p><strong>Genre:</strong> {movie.Genre}</p>
                                            <p><strong>IMDB Rating:</strong> {movie.imdbRating} stars</p>
                                            <p><strong>Runtime:</strong> {movie.Runtime}</p>
                                            <p><strong>Released:</strong> {movie.Released}</p>
                                            <p><strong>Plot:</strong> {movie.Plot}</p>
                                            <img src={movie.Poster} alt={movie.Title} className="w-32" />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No lists found.</p>
            )}
        </div>
    );
}

export default MyList;
