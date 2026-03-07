import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AdmissionForm } from "../backend";

interface Class10SubjectSelectionProps {
  formData: Partial<AdmissionForm>;
  setFormData: (data: Partial<AdmissionForm>) => void;
  disabled?: boolean;
}

export default function Class10SubjectSelection({
  formData,
  setFormData,
  disabled,
}: Class10SubjectSelectionProps) {
  const milSubjects = ["Hindi", "Urdu", "Bangla", "Maithili"];
  const silSubjects = ["Sanskrit", "HIN(NLH)", "Arabic", "Persian", "Bhojpuri"];
  const compulsorySubjects = ["Math", "Science", "Social Science", "English"];
  const extraSubjects = [
    "Mathematics",
    "Maithili",
    "Sanskrit",
    "Persian",
    "Music",
    "Home Science",
    "Economics",
    "Arabic",
    "Fine Arts",
    "Commerce",
    "Dance",
  ];

  const toggleSubject = (
    category: "mil" | "sil" | "compulsory",
    subject: string,
  ) => {
    const currentSubjects = formData.subjects?.[category] || [];
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter((s) => s !== subject)
      : [...currentSubjects, subject];

    setFormData({
      ...formData,
      subjects: {
        ...formData.subjects!,
        [category]: newSubjects,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class 10th Subject Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            M.I.L. Subject's (Select Multiple) *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {milSubjects.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={`mil-${subject}`}
                  checked={formData.subjects?.mil?.includes(subject) || false}
                  onCheckedChange={() => toggleSubject("mil", subject)}
                  disabled={disabled}
                />
                <Label htmlFor={`mil-${subject}`}>{subject}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">
            S.I.L. Subject's (Select Multiple) *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {silSubjects.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={`sil-${subject}`}
                  checked={formData.subjects?.sil?.includes(subject) || false}
                  onCheckedChange={() => toggleSubject("sil", subject)}
                  disabled={disabled}
                />
                <Label htmlFor={`sil-${subject}`}>{subject}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Compulsory Subject's (Select Multiple) *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {compulsorySubjects.map((subject) => (
              <div key={subject} className="flex items-center space-x-2">
                <Checkbox
                  id={`comp-${subject}`}
                  checked={
                    formData.subjects?.compulsory?.includes(subject) || false
                  }
                  onCheckedChange={() => toggleSubject("compulsory", subject)}
                  disabled={disabled}
                />
                <Label htmlFor={`comp-${subject}`}>{subject}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Extra Subject (Select One) *
          </Label>
          <RadioGroup
            value={formData.subjects?.extra || ""}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                subjects: { ...formData.subjects!, extra: value },
              })
            }
            disabled={disabled}
          >
            <div className="grid grid-cols-2 gap-3">
              {extraSubjects.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <RadioGroupItem value={subject} id={`extra-${subject}`} />
                  <Label htmlFor={`extra-${subject}`}>{subject}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
