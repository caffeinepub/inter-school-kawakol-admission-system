import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

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

export default function DocumentsChecklistSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents Checklist / दस्तावेज़ चेकलिस्ट</CardTitle>
        <p className="text-sm text-muted-foreground">
          Confirm that you have the following documents ready for submission.
          <br />
          <span lang="hi">
            कृपया पुष्टि करें कि आपके पास निम्नलिखित दस्तावेज़ जमा करने के लिए तैयार हैं।
          </span>
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start space-x-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors"
            >
              <Checkbox
                id={doc.id}
                checked={checked[doc.id] || false}
                onCheckedChange={() => toggle(doc.id)}
                className="mt-0.5"
              />
              <Label htmlFor={doc.id} className="cursor-pointer leading-snug">
                <span className="block font-medium text-sm">{doc.label}</span>
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
