import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Chatbot from './Chatbot';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <main className="pt-16 md:pl-64">
        <div className="max-w-3xl mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default Layout;
