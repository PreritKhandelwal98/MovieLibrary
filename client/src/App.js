import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import MyList from './components/MyList';
import MovieListDetails from './components/MovieListDetails'
import { Toaster } from 'react-hot-toast';
import Unauthorized from './components/Unauthorized';

function App() {
  return (
    <div className="App">
      <Toaster />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/lists/:listId" element={<MovieListDetails />} />
          <Route path="/unauthorized" component={<Unauthorized />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
