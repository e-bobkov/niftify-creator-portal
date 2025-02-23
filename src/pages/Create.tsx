import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Palette, Brush, Globe2, Award, Send, Upload, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

interface CreatorForm {
  fullName: string;
  email: string;
  bio: string;
  experience: string;
  artStyle: string;
  portfolio: string;
  socialLinks: string;
  achievements: string;
  artworks: File[];
}

interface FormBlock {
  id: keyof CreatorForm | (keyof CreatorForm)[];
  icon: typeof Palette;
  title: string;
  description: string;
  fields: {
    id: keyof CreatorForm;
    placeholder: string;
    type?: string;
    isTextarea?: boolean;
    isFileUpload?: boolean;
  }[];
}

const formBlocks: FormBlock[] = [
  {
    id: ["fullName", "email", "bio"],
    icon: Palette,
    title: "Basic Information",
    description: "Tell us about yourself",
    fields: [
      { id: "fullName", placeholder: "Your Full Name" },
      { id: "email", placeholder: "Email Address", type: "email" },
      { id: "bio", placeholder: "Tell us about yourself", isTextarea: true }
    ]
  },
  {
    id: ["experience", "artStyle"],
    icon: Brush,
    title: "Creative Experience",
    description: "Share your artistic journey",
    fields: [
      { id: "experience", placeholder: "Your experience in digital art", isTextarea: true },
      { id: "artStyle", placeholder: "Preferred art styles" }
    ]
  },
  {
    id: ["artworks"],
    icon: Upload,
    title: "Your Artworks",
    description: "Show us your best works",
    fields: [
      { id: "artworks", placeholder: "Upload your artworks", type: "file", isFileUpload: true }
    ]
  },
  {
    id: ["portfolio", "socialLinks"],
    icon: Globe2,
    title: "Online Presence",
    description: "Connect your digital footprint",
    fields: [
      { id: "portfolio", placeholder: "Portfolio URL" },
      { id: "socialLinks", placeholder: "Social Media Links" }
    ]
  },
  {
    id: ["achievements"],
    icon: Award,
    title: "Achievements",
    description: "Showcase your accomplishments",
    fields: [
      { id: "achievements", placeholder: "Your achievements in art", isTextarea: true }
    ]
  }
];

const ProgressIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex justify-center gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div key={index} className="flex items-center">
        {index === currentStep ? (
          <Circle className="w-6 h-6 text-primary animate-pulse" />
        ) : index < currentStep ? (
          <CheckCircle2 className="w-6 h-6 text-primary" />
        ) : (
          <Circle className="w-6 h-6 text-muted-foreground/30" />
        )}
        {index < totalSteps - 1 && (
          <div className={`w-8 h-0.5 mx-1 ${index < currentStep ? "bg-primary" : "bg-muted-foreground/30"}`} />
        )}
      </div>
    ))}
  </div>
);

const Create = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreatorForm>({
    fullName: "",
    email: "",
    bio: "",
    experience: "",
    artStyle: "",
    portfolio: "",
    socialLinks: "",
    achievements: "",
    artworks: [],
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (id: keyof CreatorForm, value: string | File[]) => {
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleChange("artworks", files);
  };

  const isStepComplete = () => {
    const currentBlock = formBlocks[step];
    const fields = Array.isArray(currentBlock.id) ? currentBlock.id : [currentBlock.id];
    return fields.every(field => {
      if (field === "artworks") {
        return form[field].length > 0;
      }
      return typeof form[field] === "string" && form[field].trim().length > 0;
    });
  };

  const handleNext = () => {
    if (step < formBlocks.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      toast.success("Application submitted successfully! We'll get back to you soon.");
      navigate('/');
    }, 5000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            <CheckCircle2 className="w-20 h-20 text-primary mx-auto" />
            <h2 className="text-4xl font-bold">Thank You!</h2>
            <div className="space-y-4">
              <p className="text-xl text-muted-foreground">
                Your application has been submitted for review
              </p>
              <p className="text-muted-foreground">
                We will send the results to your email: <span className="text-primary">{form.email}</span>
              </p>
            </div>
            <div className="pt-8">
              <Alert>
                <AlertDescription>
                  You will be redirected to the homepage in a few seconds...
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentBlock = formBlocks[step];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Become a Creator</h1>
            <p className="text-muted-foreground text-lg">
              Join our creative community and start monetizing your digital art
            </p>
          </div>

          <ProgressIndicator currentStep={step} totalSteps={formBlocks.length} />

          <div className="glass-card p-8 rounded-lg animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <currentBlock.icon className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-2xl font-semibold">{currentBlock.title}</h3>
                  <p className="text-muted-foreground">{currentBlock.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {currentBlock.fields.map(field => (
                  field.isFileUpload ? (
                    <div key={field.id} className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="artworks"
                      />
                      <label 
                        htmlFor="artworks"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/50 rounded-lg cursor-pointer hover:border-primary transition-colors"
                      >
                        <Upload className="w-8 h-8 text-primary mb-2" />
                        <span className="text-sm text-muted-foreground">
                          {form.artworks.length > 0 
                            ? `${form.artworks.length} файлов выбрано`
                            : "Нажмите чтобы загрузить работы"}
                        </span>
                      </label>
                    </div>
                  ) : field.isTextarea ? (
                    <Textarea
                      key={field.id}
                      placeholder={field.placeholder}
                      value={form[field.id] as string}
                      onChange={e => handleChange(field.id, e.target.value)}
                    />
                  ) : (
                    <Input
                      key={field.id}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={form[field.id] as string}
                      onChange={e => handleChange(field.id, e.target.value)}
                    />
                  )
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleNext}
                  disabled={!isStepComplete()}
                  size="lg"
                >
                  {step === formBlocks.length - 1 ? (
                    <>
                      <Send className="mr-2" />
                      Отправить заявку
                    </>
                  ) : (
                    "Следующий шаг"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
