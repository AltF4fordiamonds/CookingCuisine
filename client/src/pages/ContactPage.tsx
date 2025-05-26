import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactSchema } from "@shared/schema";

const formSchema = insertContactSchema;
type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Успех!",
        description: "Съобщението беше изпратено успешно. Ще се свържем с вас скоро.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Възникна грешка при изпращането на съобщението.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const subjects = [
    { value: "general", label: "Общ въпрос" },
    { value: "recipe", label: "Въпрос за рецепта" },
    { value: "technical", label: "Техническа поддръжка" },
    { value: "suggestion", label: "Предложение" },
    { value: "partnership", label: "Партньорство" },
  ];

  const teamMembers = [
    {
      name: "Мария Петрова",
      role: "Главен готвач и основател",
      experience: "15+ години опит в кулинарията",
      image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Петър Иванов", 
      role: "Кулинарен експерт",
      experience: "Специалист по традиционни рецепти",
      image: "https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Елена Георгиева",
      role: "Фотограф на храни", 
      experience: "Визуализация и стилизиране",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
          Свържете се с нас
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Имате въпроси, предложения или искате да споделите нещо с нас? 
          Ще се радваме да чуем от вас!
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-playfair">Изпратете съобщение</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Име *</FormLabel>
                        <FormControl>
                          <Input placeholder="Вашето име" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имейл *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="вашия@имейл.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тема *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете тема" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject.value} value={subject.value}>
                              {subject.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Съобщение *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Напишете вашето съобщение тук..." 
                          rows={6}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-warm-orange hover:bg-deep-amber"
                  disabled={mutation.isPending}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {mutation.isPending ? "Изпраща се..." : "Изпрати съобщение"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Contact Information & Team */}
        <div className="space-y-8">
          {/* Contact Info */}
          <Card className="bg-warm-gray">
            <CardHeader>
              <CardTitle className="text-2xl font-playfair">Как да ни намерите</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-warm-orange text-white rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Имейл</p>
                  <p className="text-gray-800 font-medium">info@zhiguli-recepti.bg</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-warm-orange text-white rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Телефон</p>
                  <p className="text-gray-800 font-medium">+359 888 123 456</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 bg-warm-orange text-white rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Работно време</p>
                  <p className="text-gray-800 font-medium">Пн-Пт: 9:00-18:00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-playfair">Нашият екип</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {member.name}
                    </h3>
                    <p className="text-gray-600">{member.role}</p>
                    <p className="text-sm text-gray-500">{member.experience}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-playfair">Последвайте ни</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-warm-orange text-white rounded-full flex items-center justify-center hover:bg-deep-amber transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-warm-orange text-white rounded-full flex items-center justify-center hover:bg-deep-amber transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.85 14.724 3.85 12.78 5.126 11.504c1.276-1.276 3.22-1.276 4.496 0 1.276 1.276 1.276 3.22 0 4.496-.875.807-2.026 1.297-3.323 1.297-.648 0-1.297-.162-1.945-.486zm7.569 0c-1.297 0-2.448-.49-3.323-1.297-1.276-1.276-1.276-3.22 0-4.496 1.276-1.276 3.22-1.276 4.496 0 1.276 1.276 1.276 3.22 0 4.496-.875.807-2.026 1.297-3.323 1.297-.648 0-1.297-.162-1.945-.486z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-warm-orange text-white rounded-full flex items-center justify-center hover:bg-deep-amber transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-warm-orange text-white rounded-full flex items-center justify-center hover:bg-deep-amber transition-colors"
                  aria-label="Pinterest"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.219.085.338-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.766-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012 0z.001"/>
                  </svg>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
