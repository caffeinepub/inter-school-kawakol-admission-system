import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer } from 'lucide-react';
import { Student } from '../backend';

interface PrintableAdmissionFormProps {
  student: Student;
}

export default function PrintableAdmissionForm({ student }: PrintableAdmissionFormProps) {
  const handlePrint = () => {
    window.print();
  };

  if (!student.form) return null;

  const form = student.form;

  const getClassLabel = (classValue: string) => {
    const classMap: Record<string, string> = {
      class09th: '09th',
      class10th: '10th',
      class11th: '11th',
      class12th: '12th',
    };
    return classMap[classValue] || classValue;
  };

  const getGenderLabel = (gender: string) => {
    const genderMap: Record<string, string> = {
      male: 'Male',
      female: 'Female',
      other: 'Other',
    };
    return genderMap[gender] || gender;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      general: 'General',
      ews: 'EWS',
      sc: 'SC',
      st: 'ST',
      bci: 'BC - I',
      bcii: 'BC - II',
    };
    return categoryMap[category] || category;
  };

  const getBankNameLabel = (bankName: string) => {
    const bankMap: Record<string, string> = {
      stateBankOfIndia: 'State Bank of India',
      punjabNationalBank: 'Punjab National Bank',
      madhyaBiharGraminBank: 'Madhya Bihar Gramin Bank',
      dakshinBiharGraminBank: 'Dakshin Bihar Gramin Bank',
      unionBankOfIndia: 'Union Bank of India',
      indianPostPaymentBank: 'Indian Post Payment Bank',
      finoPaymentBank: 'Fino Payment Bank',
      other: 'Other',
    };
    return bankMap[bankName] || bankName;
  };

  const getPassingDivisionLabel = (division: string) => {
    const divisionMap: Record<string, string> = {
      first: 'First',
      second: 'Second',
      third: 'Third',
    };
    return divisionMap[division] || division;
  };

  const getStateLabel = (state: string) => {
    const stateMap: Record<string, string> = {
      bihar: 'Bihar',
      jharkhand: 'Jharkhand',
    };
    return stateMap[state] || state;
  };

  const getStreamLabel = (stream: string | undefined) => {
    if (!stream) return '';
    const streamMap: Record<string, string> = {
      science: 'Science',
      arts: 'Arts',
      commerce: 'Commerce',
    };
    return streamMap[stream] || stream;
  };

  return (
    <Card className="print-section">
      <CardHeader className="no-print">
        <div className="flex items-center justify-between">
          <CardTitle>Admission Form</CardTitle>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Form
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Print Header with Logo */}
        <div className="print-header text-center mb-8 border-b-2 border-primary pb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img
              src="/assets/generated/school-logo.dim_1024x1024.png"
              alt="ISK Logo"
              className="h-20 w-20 object-contain print-logo"
            />
            <div>
              <h1 className="text-3xl font-bold text-primary">INTER SCHOOL KAWAKOL</h1>
              <p className="text-lg text-muted-foreground">Nawada, Bihar</p>
              <p className="text-sm text-muted-foreground mt-1">
                School Code: 82021 &amp; 23054 | UDIS Code: 10360504011
              </p>
            </div>
          </div>
          <h2 className="text-xl font-semibold mt-4">Admission Application Form</h2>
          <p className="text-sm text-muted-foreground">Academic Year 2024-25</p>
        </div>

        {/* Student Photo and Basic Info Section */}
        <div className="mb-6 flex gap-6">
          <div className="flex-shrink-0">
            {form.photo ? (
              <img
                src={form.photo.getDirectURL()}
                alt="Student"
                className="w-32 h-40 object-cover border-2 border-primary rounded"
              />
            ) : (
              <div className="w-32 h-40 border-2 border-dashed border-muted-foreground/50 rounded flex items-center justify-center bg-muted/30">
                <p className="text-xs text-muted-foreground text-center px-2">Photo Not Uploaded</p>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Class</p>
                <p className="text-base font-medium">{getClassLabel(student._class)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Application Status</p>
                <p className="text-base font-medium capitalize">{student.status}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Registration Date</p>
                <p className="text-base font-medium">
                  {new Date(Number(student.registrationDate) / 1000000).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Email</p>
                <p className="text-base font-medium">{student.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-primary border-b border-primary/30 pb-2 mb-4">
            Personal Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Student Name</p>
              <p className="text-base">{form.studentName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Date of Birth</p>
              <p className="text-base">
                {form.dateOfBirth ? new Date(Number(form.dateOfBirth) / 1000000).toLocaleDateString() : ''}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Gender</p>
              <p className="text-base">{getGenderLabel(form.gender)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Category</p>
              <p className="text-base">{getCategoryLabel(form.category)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Aadhar Number</p>
              <p className="text-base">{form.aadharNumber}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Annual Family Income</p>
              <p className="text-base">{form.annualFamilyIncome}</p>
            </div>
            {form.physicallyHandicapped && (
              <>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Handicap Type</p>
                  <p className="text-base">{form.handicapType || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Handicap Percentage</p>
                  <p className="text-base">
                    {form.handicapPercentage ? `${Number(form.handicapPercentage)}%` : '-'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Student Identifiers & Contact */}
        {(form.studentPen || form.apparNumber || form.eShikshakoshNumber || form.studentPhone || form.studentEmail) && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-primary border-b border-primary/30 pb-2 mb-4">
              Student Identifiers &amp; Contact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {form.studentPen && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Student PEN</p>
                  <p className="text-base">{form.studentPen}</p>
                </div>
              )}
              {form.apparNumber && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">APPAR Number</p>
                  <p className="text-base">{form.apparNumber}</p>
                </div>
              )}
              {form.eShikshakoshNumber && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">E-Shikshakosh Number</p>
                  <p className="text-base">{form.eShikshakoshNumber}</p>
                </div>
              )}
              {form.studentPhone && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Student Phone</p>
                  <p className="text-base">{form.studentPhone}</p>
                </div>
              )}
              {form.studentEmail && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Student Email</p>
                  <p className="text-base">{form.studentEmail}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Parent's Details */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-primary border-b border-primary/30 pb-2 mb-4">
            Parent's Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Father's Name</p>
              <p className="text-base">{form.fathersName || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Mother's Name</p>
              <p className="text-base">{form.mothersName || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Father's Occupation</p>
              <p className="text-base">{form.fathersOccupation || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Mother's Occupation</p>
              <p className="text-base">{form.mothersOccupation || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Father's Contact</p>
              <p className="text-base">{form.fathersContact || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Mother's Contact</p>
              <p className="text-base">{form.mothersContact || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Father's Name as per Aadhaar</p>
              <p className="text-base">{form.fathersNameAsPerAadhaar || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Mother's Name as per Aadhaar</p>
              <p className="text-base">{form.mothersNameAsPerAadhaar || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Father's Aadhaar Card Number</p>
              <p className="text-base">{form.fatherAadhar || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Mother's Aadhaar Card Number</p>
              <p className="text-base">{form.motherAadhar || '-'}</p>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-primary border-b border-primary/30 pb-2 mb-4">
            Bank Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Account Holder's Name</p>
              <p className="text-base">{form.accountHolderName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Bank Account Number</p>
              <p className="text-base">{form.bankAccountNumber}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">IFSC Code</p>
              <p className="text-base">{form.ifscCode}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Bank Name</p>
              <p className="text-base">{getBankNameLabel(form.bankName)}</p>
            </div>
          </div>
        </div>

        {/* Previous Exam Details */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-primary border-b border-primary/30 pb-2 mb-4">
            Previous Exam Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Previous Exam</p>
              <p className="text-base">{form.previousExam}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Roll Number</p>
              <p className="text-base">{form.previousRollNo}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">School Name</p>
              <p className="text-base">{form.previousSchool}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Passing Year</p>
              <p className="text-base">{form.passingYear?.toString()}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Marks Obtained</p>
              <p className="text-base">{form.marksObtained?.toString()}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Division</p>
              <p className="text-base">{getPassingDivisionLabel(form.passingDivision)}</p>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-primary border-b border-primary/30 pb-2 mb-4">
            Address Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Village</p>
              <p className="text-base">{form.address?.village}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Post Office</p>
              <p className="text-base">{form.address?.postOffice}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Police Station</p>
              <p className="text-base">{form.address?.policeStation}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Block</p>
              <p className="text-base">{form.address?.block}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">District</p>
              <p className="text-base">{form.address?.district}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">State</p>
              <p className="text-base">{getStateLabel(form.address?.state)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Pin Code</p>
              <p className="text-base">{form.address?.pinCode}</p>
            </div>
          </div>
        </div>

        {/* Subject Selection */}
        {form.subjects && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-primary border-b border-primary/30 pb-2 mb-4">
              Subject Selection
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {form.subjects.stream && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Stream</p>
                  <p className="text-base">{getStreamLabel(form.subjects.stream)}</p>
                </div>
              )}
              {form.subjects.mil && form.subjects.mil.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">M.I.L. Subjects</p>
                  <p className="text-base">{form.subjects.mil.join(', ')}</p>
                </div>
              )}
              {form.subjects.sil && form.subjects.sil.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">S.I.L. Subjects</p>
                  <p className="text-base">{form.subjects.sil.join(', ')}</p>
                </div>
              )}
              {form.subjects.compulsory && form.subjects.compulsory.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Compulsory Subjects</p>
                  <p className="text-base">{form.subjects.compulsory.join(', ')}</p>
                </div>
              )}
              {form.subjects.extra && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Extra Subject</p>
                  <p className="text-base">{form.subjects.extra}</p>
                </div>
              )}
              {form.subjects.extraSubjects && (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Extra Subjects</p>
                  <p className="text-base">{form.subjects.extraSubjects}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Declaration */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-primary border-b border-primary/30 pb-2 mb-4">
            Declaration
          </h3>
          <p className="text-base">
            Guardian Declaration:{' '}
            <span className="font-medium">{form.guardianDeclaration ? 'Agreed' : 'Not Agreed'}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
