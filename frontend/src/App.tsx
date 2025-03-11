import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import SearchPage from './pages/SearchPage'
import PersonPage from './pages/PersonPage'
import FilmPage from './pages/FilmPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<SearchPage />} />
          <Route path='/people/:id' element={<PersonPage />} />
          <Route path='/films/:id' element={<FilmPage />} />
        </Routes>
      </Layout >
    </BrowserRouter >
  )
}

export default App
