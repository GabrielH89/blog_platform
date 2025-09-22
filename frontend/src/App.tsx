import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './components/users/SignIn'
import HomeUser from './components/posts/HomeUser'
import PrivateRoute from './utils/PrivateRoute'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <SignIn/>}/>
          <Route path='/home' element={<PrivateRoute element={<HomeUser/>} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
