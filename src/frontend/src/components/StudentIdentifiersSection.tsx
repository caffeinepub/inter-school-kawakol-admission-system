import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { AdmissionForm } from "../backend";

interface StudentIdentifiersSectionProps {
  formData: Partial<AdmissionForm>;
  setFormData: (data: Partial<AdmissionForm>) => void;
  disabled?: boolean;
}

interface FieldErrors {
  studentPen?: string;
  apparNumber?: string;
  eShikshakoshNumber?: string;
  studentPhone?: string;
  studentEmail?: string;
}

export default function StudentIdentifiersSection({
  formData,
  setFormData,
  disabled,
}: StudentIdentifiersSectionProps) {
  const [errors, setErrors] = useState<FieldErrors>({});

  const validateField = (name: keyof FieldErrors, value: string): string => {
    switch (name) {
      case "studentPen":
        if (!value) return "Student PEN is required";
        if (value.length !== 11)
          return "Student PEN must be exactly 11 characters";
        return "";
      case "apparNumber":
        if (!value) return "APPAR Number is required";
        if (value.length !== 12)
          return "APPAR Number must be exactly 12 characters";
        return "";
      case "eShikshakoshNumber":
        if (!value) return "E-Shikshakosh Number is required";
        if (value.length !== 15)
          return "E-Shikshakosh Number must be exactly 15 characters";
        return "";
      case "studentPhone":
        if (!value) return "Student Phone is required";
        if (!/^\d{10}$/.test(value))
          return "Student Phone must be exactly 10 digits";
        return "";
      case "studentEmail":
        if (!value) return "Student Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (name: keyof FieldErrors, value: string) => {
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Identifiers &amp; Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Student PEN */}
          <div className="space-y-1">
            <Label htmlFor="studentPen">
              Student Permanent Enrolment Number (PEN) *
              <span className="ml-1 text-xs text-muted-foreground">
                (exactly 11 characters)
              </span>
            </Label>
            <Input
              id="studentPen"
              value={formData.studentPen || ""}
              onChange={(e) => handleChange("studentPen", e.target.value)}
              placeholder="11-character PEN"
              maxLength={11}
              disabled={disabled}
              className={
                errors.studentPen
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.studentPen && (
              <p className="text-xs text-destructive">{errors.studentPen}</p>
            )}
          </div>

          {/* APPAR Number */}
          <div className="space-y-1">
            <Label htmlFor="apparNumber">
              APPAR Number *
              <span className="ml-1 text-xs text-muted-foreground">
                (exactly 12 characters)
              </span>
            </Label>
            <Input
              id="apparNumber"
              value={formData.apparNumber || ""}
              onChange={(e) => handleChange("apparNumber", e.target.value)}
              placeholder="12-character APPAR Number"
              maxLength={12}
              disabled={disabled}
              className={
                errors.apparNumber
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.apparNumber && (
              <p className="text-xs text-destructive">{errors.apparNumber}</p>
            )}
          </div>
        </div>

        {/* E-Shikshakosh Number */}
        <div className="space-y-1">
          <Label htmlFor="eShikshakoshNumber">
            E-Shikshakosh Number *
            <span className="ml-1 text-xs text-muted-foreground">
              (exactly 15 characters)
            </span>
          </Label>
          <Input
            id="eShikshakoshNumber"
            value={formData.eShikshakoshNumber || ""}
            onChange={(e) => handleChange("eShikshakoshNumber", e.target.value)}
            placeholder="15-character E-Shikshakosh Number"
            maxLength={15}
            disabled={disabled}
            className={
              errors.eShikshakoshNumber
                ? "border-destructive focus-visible:ring-destructive"
                : ""
            }
          />
          {errors.eShikshakoshNumber && (
            <p className="text-xs text-destructive">
              {errors.eShikshakoshNumber}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Student Phone */}
          <div className="space-y-1">
            <Label htmlFor="studentPhone">
              Student Phone *
              <span className="ml-1 text-xs text-muted-foreground">
                (10 digits)
              </span>
            </Label>
            <Input
              id="studentPhone"
              type="tel"
              value={formData.studentPhone || ""}
              onChange={(e) =>
                handleChange(
                  "studentPhone",
                  e.target.value.replace(/\D/g, "").slice(0, 10),
                )
              }
              placeholder="10-digit phone number"
              maxLength={10}
              disabled={disabled}
              className={
                errors.studentPhone
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.studentPhone && (
              <p className="text-xs text-destructive">{errors.studentPhone}</p>
            )}
          </div>

          {/* Student Email */}
          <div className="space-y-1">
            <Label htmlFor="studentEmail">Student Email *</Label>
            <Input
              id="studentEmail"
              type="email"
              value={formData.studentEmail || ""}
              onChange={(e) => handleChange("studentEmail", e.target.value)}
              placeholder="student@example.com"
              disabled={disabled}
              className={
                errors.studentEmail
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.studentEmail && (
              <p className="text-xs text-destructive">{errors.studentEmail}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
