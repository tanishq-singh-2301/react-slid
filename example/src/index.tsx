import './index.css';
import 'react-component-library-ts/dist/index.css';
import ReactDOM from 'react-dom/client';
import App from './routes';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
