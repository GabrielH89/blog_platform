import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './components/users/SignIn'
import HomeUser from './components/posts/HomeUser'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignIn/>}/>
          <Route path='/home' element={<HomeUser/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
