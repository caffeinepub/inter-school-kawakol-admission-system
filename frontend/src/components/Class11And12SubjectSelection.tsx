import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AdmissionForm, Stream } from '../backend';

interface Class11And12SubjectSelectionProps {
  formData: Partial<AdmissionForm>;
  setFormData: (data: Partial<AdmissionForm>) => void;
  disabled?: boolean;
}

export default function Class11And12SubjectSelection({
  formData,
  setFormData,
  disabled,
}: Class11And12SubjectSelectionProps) {
  const scienceSubjects = ['Hindi', 'English', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'Urdu', 'Sanskrit'];
  const commerceSubjects = [
    'Hindi',
    'English',
    'Economics',
    'Accountancy',
    'Entrepreneurship',
    'Computer Science',
    'Business Studies',
    'Urdu',
  ];
  const artsSubjects = [
    'Hindi',
    'English',
    'Political Science',
    'Psychology',
    'Sociology',
    'Geography',
    'History',
    'Home Science',
    'Urdu',
    'Music',
    'Philosophy',
    'Economics',
    'Mathematics',
  ];

  const extraSubjects = [
    'Physics',
    'Chemistry',
    'Biology',
    'Agriculture',
    'Mathematics',
    'Computer Science',
    'Multimedia & Web Tech.',
    'English',
    'Hindi',
    'Urdu',
    'Maithili',
    'Sanskrit',
    'Prakrit',
    'Magahi',
    'Bhojpuri',
    'Arabic',
    'Persian',
    'Pali',
    'Bangla',
    'Yoga & Phy. Edu.',
    'Music',
    'Home Science',
    'Philosophy',
    'History',
    'Political Science',
    'Geography',
    'Psychology',
    'Sociology',
    'Economics',
    'Business Studies',
    'Entrepreneurship',
    'Accountancy',
  ];

  const toggleStreamSubject = (subject: string) => {
    const currentSubjects = formData.subjects?.compulsory || [];
    const newSubjects = currentSubjects.includes(subject)
      ? currentSubjects.filter((s) => s !== subject)
      : [...currentSubjects, subject];

    setFormData({
      ...formData,
      subjects: {
        ...formData.subjects!,
        compulsory: newSubjects,
      },
    });
  };

  const getStreamSubjects = () => {
    switch (formData.subjects?.stream) {
      case 'science':
        return scienceSubjects;
      case 'commerce':
        return commerceSubjects;
      case 'arts':
        return artsSubjects;
      default:
        return [];
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class 11th & 12th Subject Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="stream" className="text-base font-semibold">
            Select Your Stream *
          </Label>
          <Select
            value={formData.subjects?.stream}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                subjects: {
                  ...formData.subjects!,
                  stream: value as Stream,
                  compulsory: [],
                },
              })
            }
            disabled={disabled}
          >
            <SelectTrigger id="stream">
              <SelectValue placeholder="Select stream" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="science">Science Stream</SelectItem>
              <SelectItem value="arts">Arts Stream</SelectItem>
              <SelectItem value="commerce">Commerce Stream</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.subjects?.stream && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {formData.subjects.stream === 'science' && 'Science Stream Subjects'}
              {formData.subjects.stream === 'commerce' && 'Commerce Stream Subjects'}
              {formData.subjects.stream === 'arts' && 'Arts Stream Subjects'}
              {' (Select Multiple) *'}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {getStreamSubjects().map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`stream-${subject}`}
                    checked={formData.subjects?.compulsory?.includes(subject) || false}
                    onCheckedChange={() => toggleStreamSubject(subject)}
                    disabled={disabled}
                  />
                  <Label htmlFor={`stream-${subject}`}>{subject}</Label>
                </div>
              ))}
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="otherSubject">Other Subject (if any)</Label>
              <Input
                id="otherSubject"
                placeholder="Enter other subject"
                disabled={disabled}
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-base font-semibold">Extra Subjects (Select One)</Label>
          <RadioGroup
            value={formData.subjects?.extraSubjects || ''}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                subjects: { ...formData.subjects!, extraSubjects: value },
              })
            }
            disabled={disabled}
          >
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
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
