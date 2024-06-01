import { useState } from "react";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const Body = () => {
    const [searchText, setSearchText] = useState("");
    const [movieData, setMovieData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saveError, setSaveError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedList, setSelectedList] = useState("");
    const [newListName, setNewListName] = useState("");
    const [userLists, setUserLists] = useState([]);
    const navigate = useNavigate();

    const fetchData = async (title) => {
        setIsLoading(true);
        setError(null);
        setSaveError(null);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_OMDB_API_KEY}&t=${title}`
            );
            const jsonData = await response.json();
            if (jsonData.Response === "False") {
                setError(jsonData.Error);
                setMovieData(null);
            } else {
                setMovieData(jsonData);
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSave = async () => {
        if (!movieData) return;
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error("Please log in.");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lists`, {
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
            setUserLists(userLists);
            setIsModalOpen(true);
            setSelectedOption(""); // Reset selectedOption when opening modal
        } catch (err) {
            setSaveError(err.message);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleCreateNewList = async () => {
        setIsModalOpen(false);

        if (!movieData) return;

        const token = localStorage.getItem('token');

        if (!token) {
            toast.error("Please log in.");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            return;
        }

        try {
            const newListResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: newListName,
                    isPublic: false,
                    movies: [movieData],
                }),
            });

            if (!newListResponse.ok) {
                const errorResponse = await newListResponse.json();
                throw new Error(errorResponse.message || 'Failed to create new list');
            }

            toast.success(`Movie saved to ${newListName}`);
        } catch (err) {
            setSaveError(err.message);
        }
    };

    const handleAddToExistingList = async () => {
        setIsModalOpen(false);

        if (!movieData) return;

        const token = localStorage.getItem('token');

        if (!token) {
            toast.error("Please log in.");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            return;
        }

        try {
            const { _id: id } = userLists.find(list => list._id === selectedList);
            const addMovieResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lists/add-movies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ movies: [movieData] }),
            });

            if (!addMovieResponse.ok) {
                const errorResponse = await addMovieResponse.json();
                throw new Error(errorResponse.message || 'Failed to add movie to list');
            }

            toast.success(`Movie saved to selected list`);
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
                        onKeyPress={handleKeyPress}
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
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                className="bg-white p-8 rounded-lg w-96 mx-auto text-center"
            >
                <h2 className="text-lg font-bold mb-6">Would you like to create a new list or add to an existing list?</h2>
                <div className="flex justify-center mb-4">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
                        onClick={() => handleOptionSelect('new')}
                    >
                        Create New List
                    </button>
                    <button
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleOptionSelect('existing')}
                    >
                        Add to Existing List
                    </button>
                </div>
                {selectedOption === 'new' && (
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Enter the name for your new list"
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            className="border border-gray-300 rounded p-2 mb-4 w-full"
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                            onClick={handleCreateNewList}
                        >
                            Create New List
                        </button>
                    </div>
                )}
                {selectedOption === 'existing' && (
                    <div className="mt-4">
                        <select
                            value={selectedList}
                            onChange={(e) => setSelectedList(e.target.value)}
                            className="border border-gray-300 rounded p-2 mb-4 w-full"
                        >
                            <option value="">Select a list</option>
                            {userLists.map(list => (
                                <option key={list._id} value={list._id}>{list.name}</option>
                            ))}
                        </select>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleAddToExistingList}
                        >
                            Add to Existing List
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Body;

