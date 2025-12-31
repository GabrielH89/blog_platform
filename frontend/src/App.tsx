import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/users/SignIn';
import HomeUser from './components/posts/HomeUser';
import PrivateRoute from './utils/PrivateRoute';
import Profile from './components/users/Profile';
import PostCard from './components/posts/PostCard';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <SignIn/>}/>
          <Route path='/user/home' element={<PrivateRoute element={<HomeUser/>}/>}/>
          <Route path='/profile' element={<PrivateRoute element={<Profile/>}/>}/>
          <Route path='/home/post/:id' element={<PrivateRoute element={<PostCard/>}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
