import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Clock, Edit, Loader2, XCircle } from "lucide-react";
import { useEffect } from "react";
import PrintableAdmissionForm from "../components/PrintableAdmissionForm";
import { useGetCallerStudent } from "../hooks/useQueries";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { data: student, isLoading } = useGetCallerStudent();

  useEffect(() => {
    if (!isLoading && !student) {
      navigate({ to: "/login" });
    }
  }, [student, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) return null;

  const getStatusBadge = () => {
    switch (student.status) {
      case "pending":
        return (
          <Badge
            variant="default"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            <Clock className="mr-1 h-4 w-4" />
            Under Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-4 w-4" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-4 w-4" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (student.status) {
      case "pending":
        return "Your application is currently under review by the school administration. You can still edit your form before a final decision is made.";
      case "approved":
        return "Congratulations! Your application has been approved. Please print your admission form and submit it to the school office.";
      case "rejected":
        return "Unfortunately, your application has been rejected. Please contact the school administration for more information.";
      default:
        return "";
    }
  };

  // Students can edit their form only when status is pending (under review)
  const canEdit = student.status === "pending" && !!student.form;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Student Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Application Status
              </p>
              <div className="mt-2">{getStatusBadge()}</div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Student Name</p>
              <p className="font-semibold">{student.name}</p>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{getStatusMessage()}</p>
          </div>

          {canEdit && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/admission-form" })}
                data-ocid="dashboard.edit_button"
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Application Form
              </Button>
            </div>
          )}

          {!student.form && (
            <div className="flex justify-center pt-2">
              <Button
                onClick={() => navigate({ to: "/admission-form" })}
                data-ocid="dashboard.primary_button"
                className="gap-2"
              >
                Complete Admission Form
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {student.form && <PrintableAdmissionForm student={student} />}
    </div>
  );
}
