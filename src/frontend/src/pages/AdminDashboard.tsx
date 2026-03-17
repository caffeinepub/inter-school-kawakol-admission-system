import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  Download,
  Loader2,
  LogOut,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  useApproveApplication,
  useGetAllAdmissionNumbers,
  useGetAllApplications,
  useRejectApplication,
} from "../hooks/useQueries";
import { exportToExcel } from "../utils/exportToExcel";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    data: applications,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllApplications();
  const { data: admissionNumbersMap } = useGetAllAdmissionNumbers();
  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    toast.success("Logged out successfully");
    navigate({ to: "/admin/login" });
  };

  const handleApprove = async (email: string) => {
    try {
      await approveMutation.mutateAsync(email);
      toast.success("Application approved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve application");
    }
  };

  const handleReject = async (email: string) => {
    try {
      await rejectMutation.mutateAsync(email);
      toast.success("Application rejected");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject application");
    }
  };

  const handleExport = () => {
    if (applications && applications.length > 0) {
      exportToExcel(applications, admissionNumbersMap);
      toast.success("Excel file downloaded successfully");
    } else {
      toast.error("No applications to export");
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.info("Refreshing applications...");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="default"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
            Approved
          </Badge>
        );
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getClassLabel = (classValue: string) => {
    const classMap: Record<string, string> = {
      class09th: "09th",
      class10th: "10th",
      class11th: "11th",
      class12th: "12th",
    };
    return classMap[classValue] || classValue;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Admin Dashboard - All Applications
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={isFetching}
                data-ocid="admin.refresh_button"
              >
                {isFetching ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Refresh
              </Button>
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isError && (
            <div
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm"
              data-ocid="admin.error_state"
            >
              <strong>Error loading applications:</strong>{" "}
              {(error as any)?.message ||
                "Unknown error. Please click Refresh to try again."}
            </div>
          )}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications && applications.length > 0 ? (
                  applications.map((student) => (
                    <TableRow key={student.email}>
                      <TableCell className="font-mono text-xs text-primary">
                        {admissionNumbersMap?.get(student.email) || "-"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{getClassLabel(student._class)}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {new Date(
                          Number(student.registrationDate) / 1000000,
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-right">
                        {student.status === "pending" && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(student.email)}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(student.email)}
                              disabled={rejectMutation.isPending}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-8"
                      data-ocid="admin.applications.empty_state"
                    >
                      {isFetching
                        ? "Loading applications..."
                        : "No applications found. Students must register and submit the admission form to appear here."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
