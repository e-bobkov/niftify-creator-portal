
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Brush, Globe2, Camera, Link2, Award, Send } from "lucide-react";
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

const InfoBlock = ({ 
  icon: Icon, 
  title, 
  children 
}: { 
  icon: typeof Palette;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Icon className="w-6 h-6 text-primary" />
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    {children}
  </div>
);

const Create = () => {
  const navigate = useNavigate();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь будет отправка данных на сервер
    toast.success("Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.");
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Стать Креатором</h1>
            <p className="text-muted-foreground text-lg">
              Расскажите нам о себе и своем творчестве
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <InfoBlock icon={Palette} title="Основная информация">
                <Input
                  name="fullName"
                  placeholder="Ваше имя"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  name="bio"
                  placeholder="Расскажите о себе"
                  value={form.bio}
                  onChange={handleChange}
                  required
                />
              </InfoBlock>

              <InfoBlock icon={Brush} title="Творческий опыт">
                <Textarea
                  name="experience"
                  placeholder="Опыт в создании цифрового искусства"
                  value={form.experience}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="artStyle"
                  placeholder="Предпочитаемые стили"
                  value={form.artStyle}
                  onChange={handleChange}
                  required
                />
              </InfoBlock>

              <InfoBlock icon={Globe2} title="Онлайн присутствие">
                <Input
                  name="portfolio"
                  placeholder="Ссылка на портфолио"
                  value={form.portfolio}
                  onChange={handleChange}
                />
                <Input
                  name="socialLinks"
                  placeholder="Ссылки на соц. сети"
                  value={form.socialLinks}
                  onChange={handleChange}
                />
              </InfoBlock>

              <InfoBlock icon={Award} title="Достижения">
                <Textarea
                  name="achievements"
                  placeholder="Ваши достижения в сфере искусства"
                  value={form.achievements}
                  onChange={handleChange}
                />
              </InfoBlock>
            </div>

            <div className="flex justify-center pt-6">
              <Button size="lg" className="px-8" type="submit">
                <Send className="mr-2" />
                Отправить заявку
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
