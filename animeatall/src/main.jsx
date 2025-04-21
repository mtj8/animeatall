import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Layout from './Routes/Layout.jsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import NotFound from './Components/NotFound.jsx'
import CreatePost from './Components/CreatePost.jsx'
import ViewPost from './Components/ViewPost.jsx'
import EditPost from './Components/EditPost.jsx'

document.title = "anime@all"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index={true} element={<App />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/view/:postId" element={<ViewPost />} />
          <Route path="/edit/:postId" element={<EditPost />} />
        </Route>
        <Route
          path="*"
          element={ <NotFound /> }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
