import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, WalletIcon, SettingsIcon, Home } from 'lucide-react'

const Sidebar = () => {

    const location = useLocation();
    const isDashboard = location.pathname === '/'; 
    const isReports = location.pathname === '/reports';

    return (
        <aside className="border-r bg-background px-4 py-6 sm:px-6">
            <nav className="flex flex-col gap-4">
                <Link
                    to="/"
                    className={`flex items-center gap-2 ${isDashboard ? 'text-foreground font-bold underline' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <HomeIcon className="h-5 w-5" />
                    Dashboard
                </Link>
                <Link
                    to="/reports"
                    className={`flex items-center gap-2 ${isReports ? 'text-foreground font-bold underline' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <WalletIcon className="h-5 w-5" />
                    Reports
                </Link>
            </nav>
        </aside>
    )
}

export default Sidebar
