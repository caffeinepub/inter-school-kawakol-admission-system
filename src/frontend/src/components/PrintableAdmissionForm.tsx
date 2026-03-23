import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";
import type { Student } from "../backend";

interface PrintableAdmissionFormProps {
  student: Student;
  admissionNumber?: string;
}

export default function PrintableAdmissionForm({
  student,
  admissionNumber,
}: PrintableAdmissionFormProps) {
  const handlePrint = () => {
    window.print();
  };

  if (!student.form) return null;

  const form = student.form;

  const getClassLabel = (classValue: string) => {
    const classMap: Record<string, string> = {
      class09th: "09th",
      class10th: "10th",
      class11th: "11th",
      class12th: "12th",
    };
    return classMap[classValue] || classValue;
  };

  const getGenderLabel = (gender: string) => {
    const genderMap: Record<string, string> = {
      male: "Male",
      female: "Female",
      other: "Other",
    };
    return genderMap[gender] || gender;
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      general: "General",
      ews: "EWS",
      sc: "SC",
      st: "ST",
      bci: "BC - I",
      bcii: "BC - II",
    };
    return categoryMap[category] || category;
  };

  const getBankNameLabel = (bankName: string) => {
    const bankMap: Record<string, string> = {
      stateBankOfIndia: "State Bank of India",
      punjabNationalBank: "Punjab National Bank",
      madhyaBiharGraminBank: "Madhya Bihar Gramin Bank",
      dakshinBiharGraminBank: "Dakshin Bihar Gramin Bank",
      unionBankOfIndia: "Union Bank of India",
      indianPostPaymentBank: "Indian Post Payment Bank",
      finoPaymentBank: "Fino Payment Bank",
      other: "Other",
    };
    return bankMap[bankName] || bankName;
  };

  const getPassingDivisionLabel = (division: string) => {
    const divisionMap: Record<string, string> = {
      first: "First Division",
      second: "Second Division",
      third: "Third Division",
    };
    return divisionMap[division] || division;
  };

  const getStateLabel = (state: string | undefined) => {
    if (!state) return "-";
    const stateMap: Record<string, string> = {
      bihar: "Bihar",
      jharkhand: "Jharkhand",
    };
    return stateMap[state] || state;
  };

  const getStreamLabel = (stream: string | undefined) => {
    if (!stream) return "";
    const streamMap: Record<string, string> = {
      science: "Science",
      arts: "Arts",
      commerce: "Commerce",
    };
    return streamMap[stream] || stream;
  };

  const val = (v: string | undefined | null, fallback = "-") =>
    v?.trim() || fallback;

  // Helper field display
  const Field = ({
    label,
    value,
  }: {
    label: string;
    value: string | undefined | null;
  }) => (
    <div style={{ marginBottom: "3px" }}>
      <div
        className="print-field-label"
        style={{
          fontSize: "7pt",
          fontWeight: 600,
          color: "#555",
          lineHeight: "1.2",
        }}
      >
        {label}
      </div>
      <div
        className="print-field-value"
        style={{
          fontSize: "8pt",
          fontWeight: 500,
          borderBottom: "1px solid #bbb",
          minHeight: "13px",
          paddingBottom: "1px",
          wordBreak: "break-word",
          lineHeight: "1.3",
        }}
      >
        {val(value)}
      </div>
    </div>
  );

  // Section heading
  const SectionTitle = ({ title }: { title: string }) => (
    <div
      style={{
        fontSize: "8.5pt",
        fontWeight: 700,
        backgroundColor: "#e8e8f0",
        color: "#333",
        padding: "2px 6px",
        marginBottom: "4px",
        marginTop: "6px",
        borderLeft: "3px solid #4444aa",
      }}
    >
      {title}
    </div>
  );

  return (
    <Card className="print-section">
      <CardHeader className="no-print">
        <div className="flex items-center justify-between">
          <CardTitle>Admission Form - Print View</CardTitle>
          <Button
            onClick={handlePrint}
            variant="outline"
            data-ocid="print.primary_button"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Form
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* ===== PRINT LAYOUT ===== */}
        <div
          id="print-content"
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "8pt",
            color: "#111",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "2px solid #4444aa",
              paddingBottom: "6px",
              marginBottom: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src="/assets/generated/school-logo.dim_1024x1024.png"
                alt="ISK Logo"
                className="print-logo"
                style={{ width: "60px", height: "60px", objectFit: "contain" }}
              />
              <div>
                <div
                  style={{ fontSize: "13pt", fontWeight: 700, color: "#222" }}
                >
                  INTER SCHOOL KAWAKOL
                </div>
                <div style={{ fontSize: "8pt", color: "#555" }}>
                  Nawada, Bihar
                </div>
                <div style={{ fontSize: "7pt", color: "#666" }}>
                  School Code: 82021 &amp; 23054 | UDIS: 10360504011
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "10pt",
                  fontWeight: 700,
                  color: "#4444aa",
                  borderBottom: "1px solid #4444aa",
                  paddingBottom: "2px",
                  marginBottom: "2px",
                }}
              >
                APPLICATION FORM FOR ADMISSION
              </div>
              <div style={{ fontSize: "7pt", color: "#555" }}>
                प्रवेश हेतु आवेदन पत्र
              </div>
              <div style={{ fontSize: "7.5pt", marginTop: "4px" }}>
                Class of Admission:{" "}
                <strong>{getClassLabel(student._class)}</strong>
              </div>
              <div style={{ fontSize: "7.5pt" }}>
                Status:{" "}
                <strong style={{ textTransform: "capitalize" }}>
                  {student.status}
                </strong>
              </div>
              {admissionNumber && (
                <div style={{ fontSize: "7.5pt", marginTop: "2px" }}>
                  Admission No:{" "}
                  <strong style={{ fontFamily: "monospace", color: "#4444aa" }}>
                    {admissionNumber}
                  </strong>
                </div>
              )}
              <div style={{ fontSize: "7pt", color: "#555" }}>
                Date:{" "}
                {new Date(
                  Number(student.registrationDate) / 1000000,
                ).toLocaleDateString("en-IN")}
              </div>
            </div>
            {/* Photo */}
            <div style={{ textAlign: "center" }}>
              {form.photo ? (
                <img
                  src={form.photo.getDirectURL()}
                  alt="Student"
                  style={{
                    width: "80px",
                    height: "100px",
                    objectFit: "cover",
                    border: "1px solid #888",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "80px",
                    height: "100px",
                    border: "1px dashed #888",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "7pt",
                    color: "#888",
                    textAlign: "center",
                    padding: "4px",
                  }}
                >
                  Paste Photo Here
                </div>
              )}
              <div
                style={{ fontSize: "6.5pt", color: "#555", marginTop: "2px" }}
              >
                Applicant Photo
              </div>
            </div>
          </div>

          {/* ---- SECTION 1: Personal Details ---- */}
          <SectionTitle title="1. Personal Details — व्यक्तिगत विवरण" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "3px 10px",
            }}
          >
            <Field
              label="Student Name (In Capital Letters)"
              value={form.studentName}
            />
            <Field
              label="Father's Name (In Capital Letters)"
              value={form.fatherName}
            />
            <Field
              label="Mother's Name (In Capital Letters)"
              value={form.motherName}
            />
            <Field
              label="Date of Birth (DOB)"
              value={
                form.dateOfBirth
                  ? new Date(
                      Number(form.dateOfBirth) / 1000000,
                    ).toLocaleDateString("en-IN")
                  : "-"
              }
            />
            <Field label="Gender (लिंग)" value={getGenderLabel(form.gender)} />
            <Field
              label="Category (जाति श्रेणी)"
              value={getCategoryLabel(form.category)}
            />
            <Field
              label="Physically Handicapped (शारीरिक रूप से विकलांग)"
              value={form.physicallyHandicapped ? "Yes" : "No"}
            />
            {form.physicallyHandicapped && (
              <>
                <Field label="Handicap Type" value={form.handicapType} />
                <Field
                  label="Handicap Percentage (%)"
                  value={
                    form.handicapPercentage
                      ? `${Number(form.handicapPercentage)}%`
                      : "-"
                  }
                />
              </>
            )}
            <Field
              label="Student Aadhaar Number (आधार नंबर)"
              value={form.aadharNumber}
            />
            <Field
              label="Annual Family Income (वार्षिक आय)"
              value={form.annualFamilyIncome}
            />
            <Field label="Mobile Number (मोबाइल)" value={form.studentPhone} />
            <Field label="Email ID (ईमेल)" value={form.studentEmail} />
          </div>

          {/* ---- SECTION 2: Student Identifiers ---- */}
          <SectionTitle title="2. Student Identifiers — छात्र पहचान संख्या" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "3px 10px",
            }}
          >
            <Field
              label="Student PEN (11 characters)"
              value={form.studentPen}
            />
            <Field
              label="APPAR Number (12 characters)"
              value={form.apparNumber}
            />
            <Field
              label="E-Shikshakosh Number (15 characters)"
              value={form.eShikshakoshNumber}
            />
            <Field label="Student Phone" value={form.studentPhone} />
            <Field label="Student Email" value={form.studentEmail} />
          </div>

          {/* ---- SECTION 3: Parent's Details ---- */}
          <SectionTitle title="3. Parent's Details — अभिभावक विवरण" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3px 10px",
            }}
          >
            <Field label="Father's Name" value={form.fathersName} />
            <Field label="Mother's Name" value={form.mothersName} />
            <Field label="Father's Occupation" value={form.fathersOccupation} />
            <Field label="Mother's Occupation" value={form.mothersOccupation} />
            <Field label="Father's Contact" value={form.fathersContact} />
            <Field
              label="Mother's Contact"
              value={form.mothersContact || "—"}
            />
            <Field
              label="Father's Name as per Aadhaar"
              value={form.fathersNameAsPerAadhaar}
            />
            <Field
              label="Mother's Name as per Aadhaar"
              value={form.mothersNameAsPerAadhaar}
            />
            <Field
              label="Father's Aadhaar Card Number"
              value={form.fatherAadhar}
            />
            <Field
              label="Mother's Aadhaar Card Number"
              value={form.motherAadhar}
            />
          </div>

          {/* ---- SECTION 4: Bank Details ---- */}
          <SectionTitle title="4. Bank Details — बैंक विवरण" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: "3px 10px",
            }}
          >
            <Field
              label="Account Holder's Name"
              value={form.accountHolderName}
            />
            <Field
              label="Bank Account Number (खाता संख्या)"
              value={form.bankAccountNumber}
            />
            <Field label="IFSC Code (आईएफएससी)" value={form.ifscCode} />
            <Field
              label="Bank Name (बैंक का नाम)"
              value={getBankNameLabel(form.bankName)}
            />
          </div>

          {/* ---- SECTION 5: Previous Exam ---- */}
          <SectionTitle title="5. Qualifying Exam Details — पिछली परीक्षा विवरण" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "3px 10px",
            }}
          >
            <Field
              label="Previous Exam Passed (पिछला कक्षा)"
              value={form.previousExam}
            />
            <Field
              label="Roll No. of Previous Class"
              value={form.previousRollNo}
            />
            <Field
              label="School Name (स्कूल का नाम)"
              value={form.previousSchool}
            />
            <Field
              label="Passing Year (उत्तीर्ण वर्ष)"
              value={form.passingYear?.toString()}
            />
            <Field
              label="Marks Obtained (प्राप्त अंक)"
              value={form.marksObtained?.toString()}
            />
            <Field
              label="Division (श्रेणी)"
              value={getPassingDivisionLabel(form.passingDivision)}
            />
          </div>

          {/* ---- SECTION 6: Address ---- */}
          <SectionTitle title="6. Address — पता" />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: "3px 10px",
            }}
          >
            <Field label="Village (गाँव)" value={form.address?.village} />
            <Field
              label="Post Office (डाकघर)"
              value={form.address?.postOffice}
            />
            <Field
              label="Police Station (पुलिस स्टेशन)"
              value={form.address?.policeStation}
            />
            <Field label="Block (ब्लॉक)" value={form.address?.block} />
            <Field label="District (जिला)" value={form.address?.district} />
            <Field
              label="State (राज्य)"
              value={getStateLabel(form.address?.state)}
            />
            <Field label="Pin Code (पिन कोड)" value={form.address?.pinCode} />
          </div>

          {/* ---- SECTION 7: Subject Selection ---- */}
          {form.subjects && (
            <>
              <SectionTitle title="7. Subject Selection — विषय चयन" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "3px 10px",
                }}
              >
                {form.subjects.stream && (
                  <Field
                    label="Stream (धारा)"
                    value={getStreamLabel(form.subjects.stream)}
                  />
                )}
                {form.subjects.mil && form.subjects.mil.length > 0 && (
                  <Field
                    label="M.I.L. Subject"
                    value={form.subjects.mil.join(", ")}
                  />
                )}
                {form.subjects.sil && form.subjects.sil.length > 0 && (
                  <Field
                    label="S.I.L. Subject"
                    value={form.subjects.sil.join(", ")}
                  />
                )}
                {form.subjects.compulsory &&
                  form.subjects.compulsory.length > 0 && (
                    <Field
                      label="Compulsory Subjects (अनिवार्य विषय)"
                      value={form.subjects.compulsory.join(", ")}
                    />
                  )}
                {form.subjects.extra && (
                  <Field
                    label="Extra Subject (अतिरिक्त विषय)"
                    value={form.subjects.extra}
                  />
                )}
                {form.subjects.extraSubjects && (
                  <Field
                    label="Extra Subjects (11th/12th)"
                    value={form.subjects.extraSubjects}
                  />
                )}
              </div>
            </>
          )}

          {/* ---- SECTION 8: Documents Checklist ---- */}
          <SectionTitle title="8. Documents Checklist / दस्तावेज़ चेकलिस्ट" />
          <div
            style={{
              border: "1px solid #bbb",
              padding: "5px 8px",
              borderRadius: "4px",
              marginBottom: "4px",
            }}
          >
            <p
              style={{
                fontSize: "7.5pt",
                marginBottom: "3px",
                fontWeight: 600,
              }}
            >
              Confirm that you have the following documents / निम्नलिखित दस्तावेज़ों
              की पुष्टि करें:
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2px 8px",
              }}
            >
              {[
                { label: "Caste Certificate", hindi: "जाति प्रमाण पत्र" },
                { label: "Income Certificate", hindi: "आय प्रमाण पत्र" },
                { label: "Residence Certificate", hindi: "निवास प्रमाण पत्र" },
                {
                  label: "Transfer Certificate (Original)",
                  hindi: "स्थानांतरण प्रमाण पत्र (मूल)",
                },
                {
                  label: "Previous Class Marksheets",
                  hindi: "पिछली कक्षा की अंकसूची",
                },
                {
                  label: "Student Aadhaar Card Photocopy",
                  hindi: "छात्र/छात्रा आधार कार्ड फोटोकॉपी",
                },
                {
                  label: "Mother's Aadhaar Card Photocopy",
                  hindi: "माता का आधार कार्ड फोटोकॉपी",
                },
                {
                  label: "Father's Aadhaar Card Photocopy",
                  hindi: "पिता का आधार कार्ड फोटोकॉपी",
                },
              ].map((doc) => (
                <div
                  key={doc.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "1px 0",
                  }}
                >
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      border: "1px solid #333",
                      borderRadius: "2px",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e8f5e9",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "7pt",
                        color: "#2e7d32",
                        fontWeight: "bold",
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </span>
                  </div>
                  <span style={{ fontSize: "7pt" }}>
                    {doc.label}{" "}
                    <span lang="hi" style={{ color: "#555" }}>
                      / {doc.hindi}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ---- SECTION 9: Declaration ---- */}
          <SectionTitle title="9. Declaration / घोषणा (अभिभावक का घोषणा)" />
          <div
            style={{
              border: "1px solid #bbb",
              padding: "5px 8px",
              marginBottom: "4px",
              fontSize: "7pt",
              lineHeight: "1.5",
            }}
          >
            <p style={{ marginBottom: "3px" }}>
              <strong>English:</strong> All the information given by my
              son/daughter in this form and all the certificates attached are
              true. If found false, the school administration will have the
              right to take all legal action. I will not appeal against this. My
              son/daughter will follow the orders, instructions and rules issued
              by the school administration. If this is not done, the school
              administration will be free to expel the student. The school
              administration will not be responsible for getting or not getting
              government benefits.
              <strong>
                {" "}
                75% attendance is mandatory and must be present in the school
                uniform (dress).
              </strong>
            </p>
            <p lang="hi" style={{ marginBottom: "4px" }}>
              <strong>हिंदी:</strong> मेरे बेटे/बेटी द्वारा इस फॉर्म में दी गई सभी जानकारी
              और संलग्न सभी प्रमाण पत्र सत्य हैं। यदि असत्य पाया गया तो विद्यालय प्रशासन
              को सभी कानूनी कार्रवाई करने का अधिकार होगा। मैं इसके विरुद्ध अपील नहीं
              करूँगा/करूँगी। मेरा बेटा/बेटी विद्यालय प्रशासन द्वारा जारी आदेशों, निर्देशों और
              नियमों का पालन करेगा/करेगी। यदि ऐसा नहीं किया गया, तो विद्यालय प्रशासन
              छात्र को निष्कासित करने के लिए स्वतंत्र होगा। सरकारी लाभ मिलने या न मिलने के
              लिए विद्यालय प्रशासन जिम्मेदार नहीं होगा।
              <strong>
                {" "}
                75% उपस्थिति अनिवार्य है और विद्यालय की वर्दी (ड्रेस) में उपस्थित रहना
                आवश्यक है।
              </strong>
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  border: "1px solid #333",
                  display: "inline-block",
                  backgroundColor: form.guardianDeclaration
                    ? "#4444aa"
                    : "white",
                }}
              />
              <span style={{ fontSize: "7.5pt", fontWeight: 600 }}>
                I / We have read and agree to the above declaration.
                &nbsp;|&nbsp;
                <span lang="hi">मैंने/हमने उपरोक्त घोषणा पढ़ी है और सहमत हैं।</span>
              </span>
            </div>
          </div>

          {/* Signature row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px",
              marginTop: "10px",
              paddingTop: "6px",
              borderTop: "1px solid #bbb",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  borderBottom: "1px solid #333",
                  height: "28px",
                  marginBottom: "2px",
                }}
              />
              <div style={{ fontSize: "7pt", color: "#555" }}>
                Signature of Father / पिता का हस्ताक्षर
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  borderBottom: "1px solid #333",
                  height: "28px",
                  marginBottom: "2px",
                }}
              />
              <div style={{ fontSize: "7pt", color: "#555" }}>
                Signature of Student / छात्र का हस्ताक्षर
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  borderBottom: "1px solid #333",
                  height: "28px",
                  marginBottom: "2px",
                }}
              />
              <div style={{ fontSize: "7pt", color: "#555" }}>
                Signature of Principal / प्राचार्य का हस्ताक्षर
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              marginTop: "6px",
              fontSize: "6.5pt",
              color: "#666",
              borderTop: "1px solid #ccc",
              paddingTop: "3px",
            }}
          >
            Inter School Kawakol, Nawada, Bihar | School Code: 82021 &amp; 23054
            | UDIS: 10360504011
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
