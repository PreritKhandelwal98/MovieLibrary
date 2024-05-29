import Logo from '../assets/logo.png'
const Header = () => {

    return (
        <div className="flex justify-between border-b-2 shadow-lg ">
            <div className="items-center flex">
                <img
                    src={Logo}
                    className=" w-36 h-24 items-center cursor-pointer ml-8"
                />
            </div>

            <div>
                <ul className="flex p-4 m-4 justify-between">
                    <li className="m-4">Online Status</li>
                    <li className="m-4 cursor-pointer">
                        Home
                    </li>
                    <li className="m-4 cursor-pointer">
                        Grocery
                    </li>
                    <li className="m-4 font-bold cursor-pointer">
                        Cart
                    </li>
                    <button
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-4 rounded-lg"
                    >
                        Login/SignUp
                    </button>

                </ul>
            </div>
        </div >
    );
};

export default Header;