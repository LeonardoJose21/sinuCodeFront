import ReactDOM from 'react-dom/client'
import { UserProvider } from './roleContext.jsx'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <UserProvider>
        <App />
    </UserProvider>
)
