import './App.css';
import Home from './pages/home';
import EditorPage from './pages/editorPage';
import {Toaster} from 'react-hot-toast';
import {BrowserRouter ,Routes,Route} from 'react-router-dom';

function App() {
  return (
     <> 
    <div>
<Toaster position='top-right' toastOptions={{success:{theme:{primary:'#4aed88',
},
},
}}
></Toaster>
    </div>
   <BrowserRouter >
   <Routes>
    <Route path='/' element={<Home />}></Route>
    <Route path='/editor/:roomId' element={<EditorPage />}></Route>
   </Routes>
   </BrowserRouter>
    </>
   
  )
}

export default App;
