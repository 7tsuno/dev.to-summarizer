import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom'
import { Settings } from './pages/Settings'
import HomeContainer from './containers/pages/Home/HomeContainer'
import ResultListContainer from './containers/pages/ResultList/ResultListContainer'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeContainer />}></Route>
        <Route path="resultList" element={<ResultListContainer />}></Route>
        <Route path="settings" element={<Settings />}></Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
