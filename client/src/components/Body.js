import { useState } from "react";
import toast from 'react-hot-toast';

const Body = () => {
    const [searchText, setSearchText] = useState("");
    const [movieData, setMovieData] = useState(null);  // State to store movie data
    const [isLoading, setIsLoading] = useState(false); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error state
    const [saveError, setSaveError] = useState(null); // State to manage save error state

    const fetchData = async (title) => {
        setIsLoading(true);
        setError(null);
        setSaveError(null);
        try {
            const data = await fetch(
                `http://www.omdbapi.com/?apikey=e0f771f1&t=${title}`
            );
            const jsonData = await data.json();
            if (jsonData.Response === "False") {
                setError(jsonData.Error);
                setMovieData(null);
            } else {
                setMovieData(jsonData);  // Store the fetched data in the state
            }
        } catch (err) {
            setError("Failed to fetch movie data");
            setMovieData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        if (searchText.trim() !== "") {
            fetchData(searchText.trim());
        }
    };

    const handleSave = async () => {
        if (!movieData) return;
        const token = localStorage.getItem('token');

        try {
            // Fetch user's lists
            const response = await fetch('http://localhost:8000/api/lists', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to fetch user lists');
            }

            const userLists = await response.json();

            // Always prompt the user to either create a new list or select an existing one
            const selectedListOption = prompt(
                'Would you like to create a new list or add to an existing list? (Enter "new" or "existing")'
            );

            if (selectedListOption === 'new') {
                const newListName = prompt('Enter the name for your new list:');
                if (newListName) {
                    const newListResponse = await fetch('http://localhost:8000/api/lists', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            name: newListName,
                            isPublic: false, // Set default privacy setting for new list
                            movies: [movieData], // Wrap movie data in an array
                        }),
                    });

                    if (!newListResponse.ok) {
                        const errorResponse = await newListResponse.json();
                        throw new Error(errorResponse.message || 'Failed to create new list');
                    }

                    toast.success(`Movie saved to ${newListName}`);
                }
            } else if (selectedListOption === 'existing') {
                if (userLists.length === 0) {
                    throw new Error('No existing lists found. Please create a new list first.');
                }

                const selectedList = prompt('Select a list to add the movie to:\n\n' + userLists.map(list => list.name).join('\n'));
                if (selectedList) {
                    const { _id: id } = userLists.find(list => list.name === selectedList); // Destructure _id from found list object
                    console.log("this is id:", id);
                    // Add the movie to the selected list
                    const addMovieResponse = await fetch(`http://localhost:8000/api/lists/add-movies/${id}`, {
                        method: 'PUT', // Use PUT method to update the list
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ movies: [movieData] }), // Wrap movie data in an object with 'movies' key
                    });

                    if (!addMovieResponse.ok) {
                        const errorResponse = await addMovieResponse.json();
                        throw new Error(errorResponse.message || 'Failed to add movie to list');
                    }

                    toast.success(`Movie saved to ${selectedList}`);
                }
            } else {
                throw new Error('Invalid option selected.');
            }
        } catch (err) {
            setSaveError(err.message);
        }
    };


    return (
        <div className="body mt-14 mx-4">
            <div className="flex justify-center mb-8">
                <div className="search flex items-center bg-white shadow-lg rounded-lg p-4">
                    <input
                        className="border-solid border-gray-300 border-2 py-2 px-4 rounded-l-lg focus:outline-none"
                        type="text"
                        data-testid="searchInput"
                        placeholder="Search movies..."
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />
                    <button
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-r-lg"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>
            <div className="flex justify-center">
                {isLoading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {saveError && <p className="text-red-500">{saveError}</p>}
                {!movieData && !isLoading && !error && (
                    <p className="text-gray-500">Search for a movie to see its details.</p>
                )}
                {movieData && !isLoading && !error && (
                    <div className="flex w-full max-w-4xl bg-black shadow-lg rounded-lg overflow-hidden">
                        <div className="w-1/2">
                            <img
                                src={movieData.Poster}
                                alt={movieData.Title}
                                className="w-full h-full object-cover rounded-l-lg"
                            />
                        </div>
                        <div className="w-1/2 p-4 flex flex-col justify-center bg-gray-50">
                            <h2 className="text-3xl font-bold mb-4 text-gray-800">{movieData.Title}</h2>
                            <p className="text-lg text-gray-700"><strong>Genre:</strong> {movieData.Genre}</p>
                            <p className="text-lg text-gray-700"><strong>IMDB Rating:</strong> {movieData.imdbRating} stars</p>
                            <p className="text-lg text-gray-700"><strong>Runtime:</strong> {movieData.Runtime}</p>
                            <p className="text-lg text-gray-700"><strong>Released:</strong> {movieData.Released}</p>
                            <p className="text-lg mt-4 text-gray-700"><strong>Plot:</strong> {movieData.Plot}</p>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                                onClick={handleSave}
                            >
                                Save to My List
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Body;
