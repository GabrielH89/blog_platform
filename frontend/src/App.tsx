import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/users/SignIn';
import HomeUser from './components/posts/HomeUser';
import PrivateRoute from './utils/PrivateRoute';
import Profile from './components/users/Profile';
import PostCard from './components/posts/PostCard';
import Historic from './components/users/Historic';
import AdminHome from './components/admin/AdminHome';
import AdminProfile from './components/admin/AdminProfile';
import AdminPosts from './components/admin/AdminPosts';
import AdminListUsers from './components/admin/AdminListUsers';

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

          //
          <Route path='/admin/home' element={<PrivateRoute element={<AdminHome/>}/>}/>
          <Route path='/admin/profile' element={<PrivateRoute element={<AdminProfile/>}/>}/>
          <Route path='/admin/posts' element={<PrivateRoute element={<AdminPosts/>}/>}/>
          <Route path="/admin/users" element={<AdminListUsers />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
