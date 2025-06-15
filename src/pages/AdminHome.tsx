import { useState } from "react";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Edit,
  Search,
  Trash2,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<string[]>([]);

  // Mock issue data
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: "Broken streetlight on Oak Avenue",
      description:
        "The streetlight has been flickering for weeks and now it's completely out.",
      status: "In Progress",
      priority: "Medium",
      location: "Oak Avenue & 2nd Street",
      reportDate: "2024-01-15",
      category: "Infrastructure",
    },
    {
      id: 2,
      title: "Pothole on Main Street",
      description:
        "Large pothole causing damage to vehicles near the intersection.",
      status: "Resolved",
      priority: "High",
      location: "Main Street & 5th Avenue",
      reportDate: "2024-01-10",
      category: "Road Maintenance",
    },
    {
      id: 3,
      title: "Graffiti on public building",
      description: "Vandalism on the side wall of the community center.",
      status: "Pending",
      priority: "Low",
      location: "Community Center",
      reportDate: "2024-01-20",
      category: "Vandalism",
    },
    {
      id: 4,
      title: "Damaged traffic sign",
      description: "Stop sign bent and difficult to see at Elm and Maple.",
      status: "In Progress",
      priority: "High",
      location: "Elm Street & Maple Avenue",
      reportDate: "2024-01-25",
      category: "Traffic",
    },
    {
      id: 5,
      title: "Water leak on Pine Street",
      description: "Water bubbling up from the street near the fire hydrant.",
      status: "Resolved",
      priority: "Medium",
      location: "Pine Street & 3rd Avenue",
      reportDate: "2024-01-05",
      category: "Utilities",
    },
  ]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedIssues = [...issues].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn as keyof (typeof a)] as string;
    const bValue = b[sortColumn as keyof (typeof b)] as string;

    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const filteredIssues = sortedIssues.filter((issue) => {
    const searchMatch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase());

    const statusMatch =
      statusFilters.length === 0 || statusFilters.includes(issue.status);
    const priorityMatch =
      priorityFilters.length === 0 || priorityFilters.includes(issue.priority);

    return searchMatch && statusMatch && priorityMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section with Profile Link */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and resolve community issues
            </p>
          </div>
          <Link to="/admin/profile">
            <Button variant="outline" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </Button>
          </Link>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <div className="text-2xl font-bold text-foreground">
              {issues.length}
            </div>
            <p className="text-sm text-muted-foreground">Total Issues</p>
          </div>
          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <div className="text-2xl font-bold text-green-600">
              {issues.filter((issue) => issue.status === "Resolved").length}
            </div>
            <p className="text-sm text-muted-foreground">Resolved Issues</p>
          </div>
          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <div className="text-2xl font-bold text-blue-600">
              {issues.filter((issue) => issue.status === "In Progress").length}
            </div>
            <p className="text-sm text-muted-foreground">Issues In Progress</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80"
            />
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Status <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes("Pending")}
                  onCheckedChange={(checked) =>
                    setStatusFilters((prev) =>
                      checked
                        ? [...prev, "Pending"]
                        : prev.filter((s) => s !== "Pending")
                    )
                  }
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes("In Progress")}
                  onCheckedChange={(checked) =>
                    setStatusFilters((prev) =>
                      checked
                        ? [...prev, "In Progress"]
                        : prev.filter((s) => s !== "In Progress")
                    )
                  }
                >
                  In Progress
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes("Resolved")}
                  onCheckedChange={(checked) =>
                    setStatusFilters((prev) =>
                      checked
                        ? [...prev, "Resolved"]
                        : prev.filter((s) => s !== "Resolved")
                    )
                  }
                >
                  Resolved
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Priority <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuCheckboxItem
                  checked={priorityFilters.includes("Low")}
                  onCheckedChange={(checked) =>
                    setPriorityFilters((prev) =>
                      checked
                        ? [...prev, "Low"]
                        : prev.filter((p) => p !== "Low")
                    )
                  }
                >
                  Low
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={priorityFilters.includes("Medium")}
                  onCheckedChange={(checked) =>
                    setPriorityFilters((prev) =>
                      checked
                        ? [...prev, "Medium"]
                        : prev.filter((p) => p !== "Medium")
                    )
                  }
                >
                  Medium
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={priorityFilters.includes("High")}
                  onCheckedChange={(checked) =>
                    setPriorityFilters((prev) =>
                      checked
                        ? [...prev, "High"]
                        : prev.filter((p) => p !== "High")
                    )
                  }
                >
                  High
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Issues Table */}
        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of all reported issues.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("title")}
                    className="w-full"
                  >
                    Title
                    {sortColumn === "title" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("location")}
                    className="w-full"
                  >
                    Location
                    {sortColumn === "location" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("status")}
                    className="w-full"
                  >
                    Status
                    {sortColumn === "status" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">{issue.title}</TableCell>
                  <TableCell>{issue.location}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredIssues.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No issues found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;