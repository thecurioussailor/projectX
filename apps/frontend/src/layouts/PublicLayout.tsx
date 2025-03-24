import { Outlet } from 'react-router-dom';
// import PublicNavbar from '../components/PublicNavbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <PublicNavbar /> */}
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout; 