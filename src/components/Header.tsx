import { Link } from "react-router-dom"
import { Button } from "./ui/button.tsx";
import { LogIn, Shield } from "lucide-react";
import civicIssueLogo from "../assets/civic-issue.png";


const Header = () => {
    const id = true;
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Not on profile pages */}
            <Link to="/" className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-10 h-10 p-1 rounded-lg civic-gradient">
                <img src={civicIssueLogo} alt="civicIssueLogo" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-foreground">CivicIssueReporter</h1>
                    <p className="text-xs text-muted-foreground">
                        {id? "Dashboard" : "Building Better Communities"}
                    </p>
                </div>
            </Link>

            {/* Only on landing page */}
            {id ? <></> : <nav className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-foreground hover:text-primary transition-colors">
                    Features
                </a>
                <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
                How It Works
                </a>
                <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
                </a>
            </nav>}

            {/* Only after logged in */}
            {/* For admin the link to will be admin/profile */}
            {id ? 
            <div className="flex items-center space-x-3">
              <Link to="/citizen/profile">
                <Button variant="outline" size="sm">
                    Profile
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm">
                    Logout
                </Button>
              </Link>
            </div>
            :
            // Only on landing page
            <div className="flex items-center space-x-3">
                <Link to="/citizen" >
                    <Button variant="outline" size="sm" className="items-center space-x-2 cursor-pointer">
                        <LogIn className="h-4 w-4" />
                        <span className="hidden sm:flex">Citizen Login</span>
                    </Button>
                </Link>
                <Link to="/admin">
                    <Button size="sm" className="flex items-center space-x-2 civic-gradient border-0 text-white hover:opacity-90 cursor-pointer">
                        <Shield className="h-4 w-4" />
                        <span>Admin Login</span>
                    </Button>
                </Link>
            </div>}
        </div>
      </div>
    </header>
  )
}

export default Header;
