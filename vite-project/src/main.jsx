import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'react-toastify/ReactToastify.css'
import './index.css'
import { ToastContainer } from 'react-toastify'
<<<<<<< HEAD

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer/>
    <App/>
=======
import { store, persistor } from './redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer/>
        <App/>
      </PersistGate>
    </Provider>
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
  </StrictMode>,
)
