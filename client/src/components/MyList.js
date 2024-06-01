import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function MyList() {
    const [lists, setLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLists = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User not logged in');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lists`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
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
        navigate(`/lists/${listId}`);
    };

    const handleToggleVisibility = async (listId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('User not logged in');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/lists/toggle-visibility/${listId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to toggle visibility');
            }

            const updatedList = await response.json();
            setLists((prevLists) =>
                prevLists.map((list) => (list._id === updatedList._id ? updatedList : list))
            );
            toast.success(`List visibility updated to ${updatedList.isPublic ? 'Public' : 'Private'}`);
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">My Lists</h1>
            {lists.length > 0 ? (
                <div className="space-y-4">
                    {lists.map((list) => (
                        <div key={list._id} className="bg-white shadow-lg rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold">{list.name}</h2>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleListClick(list._id)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Show Movies
                                    </button>
                                    <button
                                        onClick={() => handleToggleVisibility(list._id)}
                                        className={`py-2 px-4 rounded font-bold ${list.isPublic
                                            ? 'bg-green-500 hover:bg-green-700 text-white'
                                            : 'bg-red-500 hover:bg-red-700 text-white'
                                            }`}
                                    >
                                        {list.isPublic ? 'Make Private' : 'Make Public'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No lists found.</p>
            )}
        </div>
    );
}

export default MyList;
