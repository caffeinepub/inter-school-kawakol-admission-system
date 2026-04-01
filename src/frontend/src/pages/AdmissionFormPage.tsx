import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Loader2, Save, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type AdmissionForm,
  BankName,
  Category,
  Gender,
  PassingDivision,
  State,
} from "../backend";
import AddressSection from "../components/AddressSection";
import BankDetailsSection from "../components/BankDetailsSection";
import Class9SubjectSelection from "../components/Class9SubjectSelection";
import Class10SubjectSelection from "../components/Class10SubjectSelection";
import Class11And12SubjectSelection from "../components/Class11And12SubjectSelection";
import ContactDetailsSection from "../components/ContactDetailsSection";
import DocumentsChecklistSection, {
  DOCUMENTS,
} from "../components/DocumentsChecklistSection";
import GuardianDeclarationSection from "../components/GuardianDeclarationSection";
import PersonalDetailsSection from "../components/PersonalDetailsSection";
import PreviousExamSection from "../components/PreviousExamSection";
import StudentIdentifiersSection from "../components/StudentIdentifiersSection";
import {
  useGetCallerStudent,
  useSaveDraft,
  useSubmitForm,
} from "../hooks/useQueries";
import { getCanisterErrorMessage } from "../utils/errorHandling";

export default function AdmissionFormPage() {
  const navigate = useNavigate();
  const { data: student, isLoading: studentLoading } = useGetCallerStudent();
  const saveDraftMutation = useSaveDraft();
  const submitFormMutation = useSubmitForm();

  const [formData, setFormData] = useState<Partial<AdmissionForm>>({
    studentPen: "",
    apparNumber: "",
    eShikshakoshNumber: "",
    studentPhone: "",
    studentEmail: "",
    fathersName: "",
    mothersName: "",
    fathersOccupation: "",
    mothersOccupation: "",
    fathersContact: "",
    mothersContact: "",
    fathersNameAsPerAadhaar: "",
    mothersNameAsPerAadhaar: "",
    studentName: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: BigInt(0),
    gender: Gender.male,
    category: Category.general,
    physicallyHandicapped: false,
    handicapType: undefined,
    handicapPercentage: undefined,
    aadharNumber: "",
    annualFamilyIncome: "",
    accountHolderName: "",
    bankAccountNumber: "",
    ifscCode: "",
    bankName: BankName.stateBankOfIndia,
    mobileNumber: "",
    emailId: "",
    fatherAadhar: "",
    motherAadhar: "",
    previousExam: "",
    previousRollNo: "",
    previousSchool: "",
    passingYear: BigInt(2024),
    marksObtained: BigInt(0),
    passingDivision: PassingDivision.first,
    address: {
      village: "",
      postOffice: "",
      policeStation: "",
      block: "",
      district: "",
      state: State.bihar,
      pinCode: "",
    },
    guardianDeclaration: false,
    subjects: {
      mil: [],
      sil: [],
      compulsory: [],
      extra: undefined,
      stream: undefined,
      extraSubjects: undefined,
    },
  });

  const [documentsChecked, setDocumentsChecked] = useState<
    Record<string, boolean>
  >({});
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (student?.form) {
      setFormData(student.form);
    }
  }, [student]);

  const isFormDisabled =
    student?.status === "approved" || student?.status === "rejected";

  const toggleDocument = (id: string) =>
    setDocumentsChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const validateForm = (): boolean => {
    // --- Personal Details ---
    if (!formData.studentName?.trim()) {
      toast.error("Student Name is required");
      return false;
    }
    if (!formData.dateOfBirth || formData.dateOfBirth === BigInt(0)) {
      toast.error("Date of Birth is required");
      return false;
    }
    if (!formData.fatherName?.trim()) {
      toast.error("Father's Name is required");
      return false;
    }
    if (!formData.motherName?.trim()) {
      toast.error("Mother's Name is required");
      return false;
    }
    if (!formData.gender) {
      toast.error("Gender is required");
      return false;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return false;
    }
    if (!formData.aadharNumber?.trim()) {
      toast.error("Student Aadhaar Number is required");
      return false;
    }
    if (!formData.emailId?.trim()) {
      toast.error("Religion is required");
      return false;
    }
    if (!formData.mobileNumber?.trim()) {
      toast.error("Caste is required");
      return false;
    }
    if (!formData.annualFamilyIncome?.trim()) {
      toast.error("Annual Family Income is required");
      return false;
    }

    // --- Student Identifiers & Contact ---
    if (!formData.studentPen?.trim()) {
      toast.error("Student PEN is required");
      return false;
    }
    if (formData.studentPen.length !== 11) {
      toast.error("Student PEN must be exactly 11 characters");
      return false;
    }
    if (!formData.apparNumber?.trim()) {
      toast.error("APPAR Number is required");
      return false;
    }
    if (formData.apparNumber.length !== 12) {
      toast.error("APPAR Number must be exactly 12 characters");
      return false;
    }
    if (!formData.eShikshakoshNumber?.trim()) {
      toast.error("E-Shikshakosh Number is required");
      return false;
    }
    if (formData.eShikshakoshNumber.length !== 15) {
      toast.error("E-Shikshakosh Number must be exactly 15 characters");
      return false;
    }
    if (!formData.studentPhone?.trim()) {
      toast.error("Student Phone is required");
      return false;
    }
    if (!/^\d{10}$/.test(formData.studentPhone)) {
      toast.error("Student Phone must be exactly 10 digits");
      return false;
    }
    if (!formData.studentEmail?.trim()) {
      toast.error("Student Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
      toast.error("Student Email must be a valid email address");
      return false;
    }

    // --- Bank Details ---
    if (!formData.accountHolderName?.trim()) {
      toast.error("Bank Account Holder Name is required");
      return false;
    }
    if (!formData.bankAccountNumber?.trim()) {
      toast.error("Bank Account Number is required");
      return false;
    }
    if (!formData.ifscCode?.trim()) {
      toast.error("IFSC Code is required");
      return false;
    }
    if (!formData.bankName) {
      toast.error("Bank Name is required");
      return false;
    }

    // --- Parent's Details ---
    if (!formData.fathersName?.trim()) {
      toast.error("Father's Name (Parent Details) is required");
      return false;
    }
    if (!formData.mothersName?.trim()) {
      toast.error("Mother's Name (Parent Details) is required");
      return false;
    }
    if (!formData.fathersOccupation?.trim()) {
      toast.error("Father's Occupation is required");
      return false;
    }
    if (!formData.mothersOccupation?.trim()) {
      toast.error("Mother's Occupation is required");
      return false;
    }
    if (!formData.fathersContact?.trim()) {
      toast.error("Father's Contact is required");
      return false;
    }
    if (!/^\d{10}$/.test(formData.fathersContact)) {
      toast.error("Father's Contact must be exactly 10 digits");
      return false;
    }
    if (!formData.mothersContact?.trim()) {
      toast.error("Mother's / Guardian Contact Number is required");
      return false;
    }
    if (!/^\d{10}$/.test(formData.mothersContact)) {
      toast.error(
        "Mother's / Guardian Contact Number must be exactly 10 digits",
      );
      return false;
    }
    if (!formData.fathersNameAsPerAadhaar?.trim()) {
      toast.error("Father's Name as per Aadhaar is required");
      return false;
    }
    if (!formData.mothersNameAsPerAadhaar?.trim()) {
      toast.error("Mother's Name as per Aadhaar is required");
      return false;
    }
    if (!formData.fatherAadhar?.trim()) {
      toast.error("Father's Aadhaar Card Number is required");
      return false;
    }
    if (!formData.motherAadhar?.trim()) {
      toast.error("Mother's Aadhaar Card Number is required");
      return false;
    }

    // --- Previous Exam ---
    if (!formData.previousExam?.trim()) {
      toast.error("Previous Exam Passed is required");
      return false;
    }
    if (!formData.previousRollNo?.trim()) {
      toast.error("Roll Number of Previous Class is required");
      return false;
    }
    if (!formData.previousSchool?.trim()) {
      toast.error("Previous School Name is required");
      return false;
    }
    if (!formData.passingYear || formData.passingYear === BigInt(0)) {
      toast.error("Passing Year is required");
      return false;
    }
    if (!formData.marksObtained || formData.marksObtained === BigInt(0)) {
      toast.error("Marks Obtained is required");
      return false;
    }
    if (!formData.passingDivision) {
      toast.error("Division is required");
      return false;
    }

    // --- Address ---
    if (!formData.address?.village?.trim()) {
      toast.error("Village is required");
      return false;
    }
    if (!formData.address?.postOffice?.trim()) {
      toast.error("Post Office is required");
      return false;
    }
    if (!formData.address?.policeStation?.trim()) {
      toast.error("Police Station is required");
      return false;
    }
    if (!formData.address?.block?.trim()) {
      toast.error("Block is required");
      return false;
    }
    if (!formData.address?.district?.trim()) {
      toast.error("District is required");
      return false;
    }
    if (!formData.address?.state) {
      toast.error("State is required");
      return false;
    }
    if (!formData.address?.pinCode?.trim()) {
      toast.error("Pin Code is required");
      return false;
    }

    // --- Subject Selection ---
    if (student?._class === "class09th" || student?._class === "class10th") {
      if (!formData.subjects?.mil?.length) {
        toast.error("M.I.L. Subject selection is required");
        return false;
      }
      if (!formData.subjects?.sil?.length) {
        toast.error("S.I.L. Subject selection is required");
        return false;
      }
      if (!formData.subjects?.compulsory?.length) {
        toast.error("Please select at least one Compulsory Subject");
        return false;
      }
    }

    if (student?._class === "class11th" || student?._class === "class12th") {
      if (!formData.subjects?.stream) {
        toast.error("Stream selection is required for Class 11/12");
        return false;
      }
      if (!formData.subjects?.compulsory?.length) {
        toast.error("Please select at least one stream subject");
        return false;
      }
    }

    // --- Documents Checklist (all mandatory) ---
    const uncheckedDoc = DOCUMENTS.find((doc) => !documentsChecked[doc.id]);
    if (uncheckedDoc) {
      toast.error(
        `Documents Checklist: Please confirm "${uncheckedDoc.label}" is available`,
      );
      return false;
    }

    // --- Declaration ---
    if (!formData.guardianDeclaration) {
      toast.error("Guardian declaration must be accepted");
      return false;
    }

    return true;
  };

  const handleSaveDraft = async () => {
    setActionError(null);
    if (!student?.email) {
      toast.error("Student email not found");
      return;
    }

    try {
      await saveDraftMutation.mutateAsync({
        email: student.email,
        form: formData as AdmissionForm,
      });
      toast.success("Draft saved successfully");
    } catch (error: unknown) {
      const friendlyMessage = getCanisterErrorMessage(error);
      setActionError(friendlyMessage);
    }
  };

  const handleFinalSubmit = async () => {
    setActionError(null);
    if (!validateForm()) return;

    if (!student?.email) {
      toast.error("Student email not found");
      return;
    }

    try {
      await submitFormMutation.mutateAsync({
        email: student.email,
        form: formData as AdmissionForm,
      });
      toast.success("Application submitted successfully!");
      navigate({ to: "/dashboard" });
    } catch (error: unknown) {
      const friendlyMessage = getCanisterErrorMessage(error);
      setActionError(friendlyMessage);
    }
  };

  if (studentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    navigate({ to: "/login" });
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Admission Application Form - Step 2
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Complete all sections below to submit your admission application
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <PersonalDetailsSection
          formData={formData}
          setFormData={setFormData}
          disabled={isFormDisabled}
        />
        <StudentIdentifiersSection
          formData={formData}
          setFormData={setFormData}
          disabled={isFormDisabled}
        />
        <BankDetailsSection
          formData={formData}
          setFormData={setFormData}
          disabled={isFormDisabled}
        />
        <ContactDetailsSection
          formData={formData}
          setFormData={setFormData}
          disabled={isFormDisabled}
        />
        <PreviousExamSection
          formData={formData}
          setFormData={setFormData}
          disabled={isFormDisabled}
        />
        <AddressSection
          formData={formData}
          setFormData={setFormData}
          disabled={isFormDisabled}
        />

        {student._class === "class09th" && (
          <Class9SubjectSelection
            formData={formData}
            setFormData={setFormData}
            disabled={isFormDisabled}
          />
        )}
        {student._class === "class10th" && (
          <Class10SubjectSelection
            formData={formData}
            setFormData={setFormData}
            disabled={isFormDisabled}
          />
        )}
        {(student._class === "class11th" || student._class === "class12th") && (
          <Class11And12SubjectSelection
            formData={formData}
            setFormData={setFormData}
            disabled={isFormDisabled}
          />
        )}

        <DocumentsChecklistSection
          checked={documentsChecked}
          onChange={toggleDocument}
          disabled={isFormDisabled}
        />

        <GuardianDeclarationSection
          formData={formData}
          setFormData={setFormData}
          disabled={isFormDisabled}
        />

        {!isFormDisabled && (
          <Card>
            <CardContent className="pt-6">
              {actionError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{actionError}</AlertDescription>
                </Alert>
              )}
              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={
                    saveDraftMutation.isPending || submitFormMutation.isPending
                  }
                >
                  {saveDraftMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleFinalSubmit}
                  disabled={
                    submitFormMutation.isPending || saveDraftMutation.isPending
                  }
                >
                  {submitFormMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Final Submit
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
