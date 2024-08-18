import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Cloud, HomeIcon, WalletIcon, SettingsIcon } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { Button } from './ui/button'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useState } from 'react'


const Navbar = () => {

    const apiGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL || "https://3q04lem3jd.execute-api.us-east-1.amazonaws.com/cloudCostBoard"

    const username = localStorage.getItem("cloudUsername")
    const [inProcess, setInProcess] = useState(false);
    console.log(username)
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            setInProcess(true);
            const res = await axios.post(apiGatewayUrl+"/deleteSecret", {
                username
            })
            console.log(res.data.statusCode)
            if (res.data.statusCode === 200) {
                toast.success("Logout successful.")
                localStorage.removeItem("cloudUsername")
                navigate('/connect')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setInProcess(false)
        }
    }

    if (!username) {
        navigate('/connect')
    }

    return (
        <>
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
                <Link to='/' className="flex items-center gap-2 font-bold" prefetch={false}>
                    <Cloud className="h-6 w-6 text-primary" />
                    <span>cloudCostBoard</span>
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                            <Avatar>
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>{username && username[0]}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{username}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleClick}>{ inProcess ? "Logging out..." : "LogOut"}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>
        </>
    )
}

export default Navbar