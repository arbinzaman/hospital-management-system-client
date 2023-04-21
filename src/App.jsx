import {RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import router from './components/Layouts/routes';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <div className='bg-tahiti-darkGreen ' >
      <RouterProvider router={router}></RouterProvider>
      <ToastContainer/>
    </div>
  );
}

export default App;

