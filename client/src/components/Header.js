import Logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
const Header = () => {

    return (
        <div className="flex justify-between border-b-2 shadow-lg ">
            <div className="items-center flex">
                <Link to='/'><img
                    src={Logo}
                    className=" w-36 h-24 items-center cursor-pointer ml-8"
                /></Link>
            </div>

            <div>
                <ul className="flex p-4 m-4 justify-between">
                    <li className="m-4 cursor-pointer">
                        <Link to="/">
                            Home
                        </Link>
                    </li>
                    <li className="m-4 cursor-pointer">
                        <Link to="/my-list">
                            MyList
                        </Link>
                    </li>
                    <button
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-4 rounded-lg"
                    >
                        <Link to="/register">
                            Login/SignUp
                        </Link>
                    </button>

                </ul>
            </div>
        </div >
    );
};

export default Header;