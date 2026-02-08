import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar (Fixed width) */}
            <Sidebar />

            {/* Main Content Area */}
            {/* ml-72 pushes content right by 18rem (same width as sidebar) */}
            <div className="flex-1 ml-72 transition-all duration-300">
                <main className="p-8 max-w-7xl mx-auto">
                    {/* Content Container */}
                    <div className="animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;