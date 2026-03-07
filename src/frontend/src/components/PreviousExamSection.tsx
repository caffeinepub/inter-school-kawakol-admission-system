import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdmissionForm, PassingDivision } from "../backend";

interface PreviousExamSectionProps {
  formData: Partial<AdmissionForm>;
  setFormData: (data: Partial<AdmissionForm>) => void;
  disabled?: boolean;
}

export default function PreviousExamSection({
  formData,
  setFormData,
  disabled,
}: PreviousExamSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Exam Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="previousExam">Previous Exam Passed *</Label>
            <Select
              value={formData.previousExam}
              onValueChange={(value) =>
                setFormData({ ...formData, previousExam: value })
              }
              disabled={disabled}
            >
              <SelectTrigger id="previousExam">
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="08TH">08TH</SelectItem>
                <SelectItem value="09TH">09TH</SelectItem>
                <SelectItem value="10TH">10TH</SelectItem>
                <SelectItem value="11TH">11TH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="previousRollNo">
              Roll Number of Previous Class *
            </Label>
            <Input
              id="previousRollNo"
              value={formData.previousRollNo || ""}
              onChange={(e) =>
                setFormData({ ...formData, previousRollNo: e.target.value })
              }
              disabled={disabled}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="previousSchool">Previous School Name *</Label>
          <Input
            id="previousSchool"
            value={formData.previousSchool || ""}
            onChange={(e) =>
              setFormData({ ...formData, previousSchool: e.target.value })
            }
            disabled={disabled}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="passingYear">Passing Year *</Label>
            <Select
              value={formData.passingYear?.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, passingYear: BigInt(value) })
              }
              disabled={disabled}
            >
              <SelectTrigger id="passingYear">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="marksObtained">Marks Obtained *</Label>
            <Input
              id="marksObtained"
              type="number"
              value={
                formData.marksObtained ? Number(formData.marksObtained) : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  marksObtained: BigInt(e.target.value || 0),
                })
              }
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passingDivision">Division *</Label>
            <Select
              value={formData.passingDivision}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  passingDivision: value as PassingDivision,
                })
              }
              disabled={disabled}
            >
              <SelectTrigger id="passingDivision">
                <SelectValue placeholder="Select division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First Division</SelectItem>
                <SelectItem value="second">Second Division</SelectItem>
                <SelectItem value="third">Third Division</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
