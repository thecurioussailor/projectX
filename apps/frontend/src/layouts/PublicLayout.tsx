import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
// import PublicNavbar from '../components/PublicNavbar';

const PublicLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <PublicNavbar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout; 