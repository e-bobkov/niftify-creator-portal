
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Brush, Globe2, Award, Send, ChevronDown, ChevronUp } from "lucide-react";
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

const InfoBlock = ({ 
  block,
  isActive,
  isCompleted,
  onToggle,
  values,
  onChange
}: { 
  block: FormBlock;
  isActive: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  values: CreatorForm;
  onChange: (id: keyof CreatorForm, value: string) => void;
}) => {
  const Icon = isCompleted ? ChevronDown : ChevronUp;

  return (
    <div 
      className={`canvas-card relative transition-all duration-500 ${
        isActive ? 'p-6 space-y-4 z-20 bg-secondary' : 'p-4 -mt-2'
      } ${isCompleted ? 'completed -mt-4 z-10' : ''} rounded-lg`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={onToggle}
      >
        <block.icon className="w-6 h-6 text-primary" />
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{block.title}</h3>
          {isActive && (
            <p className="text-muted-foreground text-sm">{block.description}</p>
          )}
        </div>
        <Icon className="w-5 h-5" />
      </div>

      {isActive && (
        <div className="space-y-4 animate-fade-in">
          {block.fields.map(field => (
            field.isTextarea ? (
              <Textarea
                key={field.id}
                name={field.id}
                placeholder={field.placeholder}
                value={values[field.id]}
                onChange={e => onChange(field.id, e.target.value)}
                required
              />
            ) : (
              <Input
                key={field.id}
                name={field.id}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={values[field.id]}
                onChange={e => onChange(field.id, e.target.value)}
                required
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

const Create = () => {
  const navigate = useNavigate();
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [form, setForm] = useState<CreatorForm>({
    fullName: "",
    email: "",
    bio: "",
    experience: "",
    artStyle: "",
    portfolio: "",
    socialLinks: "",
    achievements: "",
  });

  const handleChange = (id: keyof CreatorForm, value: string) => {
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application submitted successfully! We'll get back to you soon.");
    navigate('/');
  };

  const isBlockComplete = (block: FormBlock) => {
    const fields = Array.isArray(block.id) ? block.id : [block.id];
    return fields.every(field => form[field].trim().length > 0);
  };

  const handleNext = () => {
    if (activeBlockIndex < formBlocks.length - 1) {
      const currentBlock = formBlocks[activeBlockIndex];
      if (isBlockComplete(currentBlock)) {
        setActiveBlockIndex(prev => prev + 1);
      } else {
        toast.error("Please fill in all required fields");
      }
    }
  };

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {formBlocks.map((block, index) => (
                <InfoBlock
                  key={index}
                  block={block}
                  isActive={index === activeBlockIndex}
                  isCompleted={index < activeBlockIndex}
                  onToggle={() => setActiveBlockIndex(index)}
                  values={form}
                  onChange={handleChange}
                />
              ))}
            </div>

            <div className="flex justify-end pt-6 gap-4">
              {activeBlockIndex < formBlocks.length - 1 ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  size="lg"
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  type="submit"
                  size="lg"
                  className="px-8"
                >
                  <Send className="mr-2" />
                  Submit Application
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
