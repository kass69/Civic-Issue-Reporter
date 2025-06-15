import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Plus, MapPin, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import HeaderAfterAuth from "../components/HeaderAfterAuth";

const CitizenHome = () => {
  const [searchCity, setSearchCity] = useState("");

  // Mock data for issues - in real app this would come from your backend
  const mockIssues = [
    {
      id: 1,
      title: "Large Pothole on Main Street",
      description: "Deep pothole causing damage to vehicles near the intersection of Main St and Oak Ave.",
      type: "Road Infrastructure",
      city: "Springfield",
      reportedBy: "John D.",
      reportedAt: "2 hours ago",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=400&h=250&fit=crop",
      status: "Open"
    },
    {
      id: 2,
      title: "Overflowing Garbage Bin",
      description: "Trash bin at Central Park is overflowing and attracting pests.",
      type: "Waste Management",
      city: "Springfield",
      reportedBy: "Sarah M.",
      reportedAt: "4 hours ago",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&h=250&fit=crop",
      status: "In Progress"
    },
    {
      id: 3,
      title: "Fallen Tree Branch",
      description: "Large tree branch has fallen across the sidewalk on Elm Street.",
      type: "Environmental Issues",
      city: "Riverside",
      reportedBy: "Mike R.",
      reportedAt: "6 hours ago",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=400&h=250&fit=crop",
      status: "Open"
    },
    {
      id: 4,
      title: "Water Leak",
      description: "Visible water leak from underground pipe causing flooding.",
      type: "Utilities & Infrastructure",
      city: "Springfield",
      reportedBy: "Lisa K.",
      reportedAt: "8 hours ago",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=400&h=250&fit=crop",
      status: "Resolved"
    },
    {
      id: 5,
      title: "Broken Streetlight",
      description: "Streetlight not working on Pine Avenue, creating safety concerns.",
      type: "Utilities & Infrastructure",
      city: "Riverside",
      reportedBy: "Tom H.",
      reportedAt: "12 hours ago",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=400&h=250&fit=crop",
      status: "Open"
    }
  ];

  const filteredIssues = searchCity 
    ? mockIssues.filter(issue => 
        issue.city.toLowerCase().includes(searchCity.toLowerCase())
      )
    : mockIssues;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-red-100 text-red-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderAfterAuth />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Search Issues by City</h2>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Enter city name..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Issues Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Recent Issues
              {searchCity && (
                <span className="text-lg font-normal text-muted-foreground ml-2">
                  in {searchCity}
                </span>
              )}
            </h2>
            <div className="text-sm text-muted-foreground">
              {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''} found
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto">
            {filteredIssues.map((issue) => (
              <Card key={issue.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={issue.image}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{issue.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>{issue.city}</span>
                      <span className="font-medium text-primary">• {issue.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>Reported by {issue.reportedBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{issue.reportedAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No issues found for "{searchCity}"</p>
            </div>
          )}
        </div>

        {/* Create Issue Button */}
        <div className="fixed bottom-8 right-8">
          <Link to="/report-issue">
            <Button 
              size="lg" 
              className="civic-gradient border-0 text-white hover:opacity-90 shadow-lg h-14 px-6 rounded-full"
            >
              <Plus className="h-5 w-5 mr-2" />
              Report New Issue
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CitizenHome;