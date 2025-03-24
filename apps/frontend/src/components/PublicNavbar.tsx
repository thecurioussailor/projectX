import { Link } from 'react-router-dom';

const PublicNavbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-6 shadow-sm bg-white">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-3xl font-bold">projectX</Link>
      </div>
      <div>
        <Link 
          to="/signin" 
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7F37D8] hover:bg-[#6c2eb9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7F37D8]"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default PublicNavbar; 