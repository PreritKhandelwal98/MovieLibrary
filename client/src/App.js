import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import MyList from './components/MyList';
import { Toaster } from 'react-hot-toast';

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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
