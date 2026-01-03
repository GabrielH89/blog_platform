import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/users/SignIn';
import HomeUser from './components/posts/HomeUser';
import PrivateRoute from './utils/PrivateRoute';
import Profile from './components/users/Profile';
import PostCard from './components/posts/PostCard';
import Historic from './components/users/Historic';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <SignIn/>}/>
          <Route path='/user/home' element={<PrivateRoute element={<HomeUser/>}/>}/>
          <Route path='/user/profile' element={<PrivateRoute element={<Profile/>}/>}/>
          <Route path='/home/post/:id' element={<PrivateRoute element={<PostCard/>}/>}/>
          <Route path='/user/historic' element={<PrivateRoute element={<Historic/>}/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
