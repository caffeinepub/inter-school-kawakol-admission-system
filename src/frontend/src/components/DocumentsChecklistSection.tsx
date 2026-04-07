import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const DOCUMENTS = [
  {
    id: "casteCertificate",
    label: "Caste Certificate",
    hindi: "जाति प्रमाण पत्र",
  },
  {
    id: "incomeCertificate",
    label: "Income Certificate",
    hindi: "आय प्रमाण पत्र",
  },
  {
    id: "residenceCertificate",
    label: "Residence Certificate",
    hindi: "निवास प्रमाण पत्र",
  },
  {
    id: "transferCertificate",
    label: "Transfer Certificate (Original)",
    hindi: "स्थानांतरण प्रमाण पत्र (मूल)",
  },
  {
    id: "previousMarksheets",
    label: "Previous Class Marksheets",
    hindi: "पिछली कक्षा की अंकसूची",
  },
  {
    id: "studentAadhaar",
    label: "Student Aadhaar Card Photocopy",
    hindi: "छात्र/छात्रा आधार कार्ड फोटोकॉपी",
  },
  {
    id: "motherAadhaar",
    label: "Mother's Aadhaar Card Photocopy",
    hindi: "माता का आधार कार्ड फोटोकॉपी",
  },
  {
    id: "fatherAadhaar",
    label: "Father's Aadhaar Card Photocopy",
    hindi: "पिता का आधार कार्ड फोटोकॉपी",
  },
];

const ORPHAN_DOCUMENT = {
  id: "deathCertificate",
  label: "Mother & Father Death Certificate",
  hindi: "माता एवं पिता का मृत्यु प्रमाण पत्र",
};

interface Props {
  checked: Record<string, boolean>;
  onChange: (id: string) => void;
  disabled?: boolean;
  isOrphanedDestitute?: boolean;
}

export default function DocumentsChecklistSection({
  checked,
  onChange,
  disabled,
  isOrphanedDestitute,
}: Props) {
  const allDocs = isOrphanedDestitute
    ? [...DOCUMENTS, ORPHAN_DOCUMENT]
    : DOCUMENTS;
  const allChecked = allDocs.every((doc) => checked[doc.id]);

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Documents Checklist / दस्तावेज़ चेकलिस्ट
          <span className="text-red-500 text-sm font-semibold">
            * Mandatory / अनिवार्य
          </span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          All documents below must be confirmed before submitting the form.
          <br />
          <span lang="hi">
            फॉर्म जमा करने से पहले नीचे दिए गए सभी दस्तावेज़ों की पुष्टि करना अनिवार्य है।
          </span>
        </p>
        {!allChecked && (
          <p className="text-xs text-red-500 font-medium mt-1">
            ⚠ Please confirm all documents before final submission.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {allDocs.map((doc) => (
            <div
              key={doc.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                checked[doc.id]
                  ? "border-green-400 bg-green-50"
                  : "border-red-200 bg-red-50/40 hover:bg-red-50/70"
              } ${doc.id === "deathCertificate" ? "sm:col-span-2 border-orange-300 bg-orange-50/40" : ""}`}
            >
              <Checkbox
                id={doc.id}
                checked={checked[doc.id] || false}
                onCheckedChange={() => !disabled && onChange(doc.id)}
                disabled={disabled}
                className="mt-0.5"
              />
              <Label htmlFor={doc.id} className="cursor-pointer leading-snug">
                <span className="block font-medium text-sm">
                  {doc.label} <span className="text-red-500">*</span>
                  {doc.id === "deathCertificate" && (
                    <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-normal">
                      अनाथ/निराश्रित
                    </span>
                  )}
                </span>
                <span
                  className="block text-xs text-muted-foreground mt-0.5"
                  lang="hi"
                >
                  {doc.hindi}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export { DOCUMENTS, ORPHAN_DOCUMENT };
