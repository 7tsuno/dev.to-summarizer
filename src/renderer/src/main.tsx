import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ResultList } from './pages/ResultList'
import { Settings } from './pages/Settings'
import HomeContainer from './containers/pages/Home/HomeContainer'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeContainer />}></Route>
        <Route path="resultList" element={<ResultList />}></Route>
        <Route path="settings" element={<Settings />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
