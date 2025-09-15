import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './components/users/SignIn'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SignIn/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
