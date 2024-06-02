import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from '../assets/logo.png';
import toast from 'react-hot-toast';

const Header = () => {
    const { isLoggedIn, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleMyListClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            toast.error("Login Required.");
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        }
    };

    return (
        <div className="flex justify-between border-b-2 shadow-lg">
            <div className="items-center flex">
                <Link to='/'>
                    <img
                        src={Logo}
                        className="w-36 h-24 items-center cursor-pointer ml-8"
                        alt="Logo"
                    />
                </Link>
            </div>

            <div>
                <ul className="flex p-4 m-4 justify-between">
                    <li className="m-4 cursor-pointer">
                        <Link to="/">
                            Home
                        </Link>
                    </li>
                    <li className="m-4 cursor-pointer">
                        <Link to="/my-list" onClick={handleMyListClick}>
                            My List
                        </Link>
                    </li>
                    {isLoggedIn ? (
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-lg"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/register">
                            <button
                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-4 rounded-lg"
                            >
                                Login/SignUp
                            </button>
                        </Link>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Header;
