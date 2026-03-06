import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerStudent, useSaveDraft, useSubmitForm } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Save, Send, AlertCircle } from 'lucide-react';
import PersonalDetailsSection from '../components/PersonalDetailsSection';
import StudentIdentifiersSection from '../components/StudentIdentifiersSection';
import BankDetailsSection from '../components/BankDetailsSection';
import ContactDetailsSection from '../components/ContactDetailsSection';
import PreviousExamSection from '../components/PreviousExamSection';
import AddressSection from '../components/AddressSection';
import GuardianDeclarationSection from '../components/GuardianDeclarationSection';
import Class9SubjectSelection from '../components/Class9SubjectSelection';
import Class10SubjectSelection from '../components/Class10SubjectSelection';
import Class11And12SubjectSelection from '../components/Class11And12SubjectSelection';
import { AdmissionForm, Gender, Category, BankName, PassingDivision, State } from '../backend';
import { getCanisterErrorMessage } from '../utils/errorHandling';

export default function AdmissionFormPage() {
  const navigate = useNavigate();
  const { data: student, isLoading: studentLoading } = useGetCallerStudent();
  const saveDraftMutation = useSaveDraft();
  const submitFormMutation = useSubmitForm();

  const [formData, setFormData] = useState<Partial<AdmissionForm>>({
    studentPen: '',
    apparNumber: '',
    eShikshakoshNumber: '',
    studentPhone: '',
    studentEmail: '',
    fathersName: '',
    mothersName: '',
    fathersOccupation: '',
    mothersOccupation: '',
    fathersContact: '',
    mothersContact: '',
    fathersNameAsPerAadhaar: '',
    mothersNameAsPerAadhaar: '',
    studentName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: BigInt(0),
    gender: Gender.male,
    category: Category.general,
    physicallyHandicapped: false,
    handicapType: undefined,
    handicapPercentage: undefined,
    aadharNumber: '',
    annualFamilyIncome: '',
    accountHolderName: '',
    bankAccountNumber: '',
    ifscCode: '',
    bankName: BankName.stateBankOfIndia,
    mobileNumber: '',
    emailId: '',
    fatherAadhar: '',
    motherAadhar: '',
    previousExam: '',
    previousRollNo: '',
    previousSchool: '',
    passingYear: BigInt(2024),
    marksObtained: BigInt(0),
    passingDivision: PassingDivision.first,
    address: {
      village: '',
      postOffice: '',
      policeStation: '',
      block: '',
      district: '',
      state: State.bihar,
      pinCode: '',
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

  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (student?.form) {
      setFormData(student.form);
    }
  }, [student]);

  const isFormDisabled =
    student?.status === 'pending' ||
    student?.status === 'approved' ||
    student?.status === 'rejected';

  const validateForm = (): boolean => {
    if (!formData.studentName?.trim()) {
      toast.error('Student name is required');
      return false;
    }
    if (!formData.fatherName?.trim()) {
      toast.error('Father name is required');
      return false;
    }
    if (!formData.motherName?.trim()) {
      toast.error('Mother name is required');
      return false;
    }
    if (!formData.aadharNumber?.trim()) {
      toast.error('Aadhar number is required');
      return false;
    }
    if (!formData.accountHolderName?.trim()) {
      toast.error('Bank account holder name is required');
      return false;
    }
    if (!formData.bankAccountNumber?.trim()) {
      toast.error('Bank account number is required');
      return false;
    }
    if (!formData.ifscCode?.trim()) {
      toast.error('IFSC code is required');
      return false;
    }
    if (!formData.mobileNumber?.trim()) {
      toast.error('Mobile number is required');
      return false;
    }
    if (!formData.emailId?.trim()) {
      toast.error('Email ID is required');
      return false;
    }
    if (!formData.previousSchool?.trim()) {
      toast.error('Previous school name is required');
      return false;
    }
    if (!formData.address?.village?.trim()) {
      toast.error('Village is required');
      return false;
    }
    if (!formData.guardianDeclaration) {
      toast.error('Guardian declaration must be accepted');
      return false;
    }
    // Validate exact-length fields if filled
    if (formData.studentPen && formData.studentPen.length !== 11) {
      toast.error('Student PEN must be exactly 11 characters');
      return false;
    }
    if (formData.apparNumber && formData.apparNumber.length !== 12) {
      toast.error('APPAR Number must be exactly 12 characters');
      return false;
    }
    if (formData.eShikshakoshNumber && formData.eShikshakoshNumber.length !== 15) {
      toast.error('E-Shikshakosh Number must be exactly 15 characters');
      return false;
    }
    if (formData.studentPhone && !/^\d{10}$/.test(formData.studentPhone)) {
      toast.error('Student Phone must be exactly 10 digits');
      return false;
    }
    if (formData.studentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.studentEmail)) {
      toast.error('Student Email must be a valid email address');
      return false;
    }
    if (formData.fathersContact && !/^\d{10}$/.test(formData.fathersContact)) {
      toast.error("Father's Contact must be exactly 10 digits");
      return false;
    }
    if (formData.mothersContact && !/^\d{10}$/.test(formData.mothersContact)) {
      toast.error("Mother's Contact must be exactly 10 digits");
      return false;
    }
    return true;
  };

  const handleSaveDraft = async () => {
    setActionError(null);
    if (!student?.email) {
      toast.error('Student email not found');
      return;
    }

    try {
      await saveDraftMutation.mutateAsync({
        email: student.email,
        form: formData as AdmissionForm,
      });
      toast.success('Draft saved successfully');
    } catch (error: unknown) {
      const friendlyMessage = getCanisterErrorMessage(error);
      setActionError(friendlyMessage);
    }
  };

  const handleFinalSubmit = async () => {
    setActionError(null);
    if (!validateForm()) return;

    if (!student?.email) {
      toast.error('Student email not found');
      return;
    }

    try {
      await submitFormMutation.mutateAsync({
        email: student.email,
        form: formData as AdmissionForm,
      });
      toast.success('Application submitted successfully!');
      navigate({ to: '/dashboard' });
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
    navigate({ to: '/login' });
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
        <PersonalDetailsSection formData={formData} setFormData={setFormData} disabled={isFormDisabled} />
        <StudentIdentifiersSection formData={formData} setFormData={setFormData} disabled={isFormDisabled} />
        <BankDetailsSection formData={formData} setFormData={setFormData} disabled={isFormDisabled} />
        <ContactDetailsSection formData={formData} setFormData={setFormData} disabled={isFormDisabled} />
        <PreviousExamSection formData={formData} setFormData={setFormData} disabled={isFormDisabled} />
        <AddressSection formData={formData} setFormData={setFormData} disabled={isFormDisabled} />

        {student._class === 'class09th' && (
          <Class9SubjectSelection formData={formData} setFormData={setFormData} disabled={isFormDisabled} />
        )}
        {student._class === 'class10th' && (
          <Class10SubjectSelection formData={formData} setFormData={setFormData} disabled={isFormDisabled} />
        )}
        {(student._class === 'class11th' || student._class === 'class12th') && (
          <Class11And12SubjectSelection formData={formData} setFormData={setFormData} disabled={isFormDisabled} />
        )}

        <GuardianDeclarationSection formData={formData} setFormData={setFormData} disabled={isFormDisabled} />

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
                  disabled={saveDraftMutation.isPending || submitFormMutation.isPending}
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
                  disabled={submitFormMutation.isPending || saveDraftMutation.isPending}
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
