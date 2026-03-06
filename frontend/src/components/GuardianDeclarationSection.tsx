import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AdmissionForm } from '../backend';

interface GuardianDeclarationSectionProps {
  formData: Partial<AdmissionForm>;
  setFormData: (data: Partial<AdmissionForm>) => void;
  disabled?: boolean;
}

export default function GuardianDeclarationSection({
  formData,
  setFormData,
  disabled,
}: GuardianDeclarationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Declaration / घोषणा</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* English Declaration */}
        <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
          <p className="font-semibold text-foreground mb-2">English:</p>
          <p className="leading-relaxed text-muted-foreground">
            All the information given by my son/daughter in this form and all the certificates
            attached are true. If found false, the school administration will have the right to take
            all legal action. I will not appeal against this. My son/daughter will follow the
            orders, instructions and rules issued by the school administration. If this is not done,
            the school administration will be free to expel the student. The school administration
            will not be responsible for getting or not getting government benefits. 75% attendance
            is mandatory and must be present in the school uniform (dress).
          </p>
        </div>

        {/* Hindi Declaration */}
        <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
          <p className="font-semibold text-foreground mb-2">हिंदी:</p>
          <p className="leading-relaxed text-muted-foreground" lang="hi">
            मेरे बेटे/बेटी द्वारा इस फॉर्म में दी गई सभी जानकारी और संलग्न सभी प्रमाण पत्र सत्य
            हैं। यदि असत्य पाया गया तो विद्यालय प्रशासन को सभी कानूनी कार्रवाई करने का अधिकार
            होगा। मैं इसके विरुद्ध अपील नहीं करूँगा/करूँगी। मेरा बेटा/बेटी विद्यालय प्रशासन
            द्वारा जारी आदेशों, निर्देशों और नियमों का पालन करेगा/करेगी। यदि ऐसा नहीं किया गया,
            तो विद्यालय प्रशासन छात्र को निष्कासित करने के लिए स्वतंत्र होगा। सरकारी लाभ मिलने
            या न मिलने के लिए विद्यालय प्रशासन जिम्मेदार नहीं होगा। 75% उपस्थिति अनिवार्य है
            और विद्यालय की वर्दी (ड्रेस) में उपस्थित रहना आवश्यक है।
          </p>
        </div>

        {/* Acknowledgement Checkbox */}
        <div className="flex items-start space-x-3 pt-2">
          <Checkbox
            id="guardianDeclaration"
            checked={formData.guardianDeclaration || false}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, guardianDeclaration: checked as boolean })
            }
            disabled={disabled}
            className="mt-0.5"
          />
          <Label htmlFor="guardianDeclaration" className="font-medium cursor-pointer leading-relaxed">
            <span className="block">
              I / We have read and agree to the above declaration *
            </span>
            <span className="block text-muted-foreground mt-0.5" lang="hi">
              मैंने/हमने उपरोक्त घोषणा पढ़ी है और सहमत हैं *
            </span>
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
