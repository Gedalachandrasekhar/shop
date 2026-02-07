import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 font-roboto">
            <Sidebar />
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;