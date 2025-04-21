import '../App.css'
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>Not Found</h1>
      <p>get outta here!</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}

export default NotFound;