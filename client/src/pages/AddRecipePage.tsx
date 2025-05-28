import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertRecipeSchema } from "@shared/schema";

const formSchema = insertRecipeSchema.extend({
  prepTime: z.coerce.number().min(0).optional(),
  cookTime: z.coerce.number().min(1, "Времето за готвене е задължително"),
  servings: z.coerce.number().min(1, "Броят порции трябва да бъде поне 1"),
});

type FormData = z.infer<typeof formSchema>;

interface Ingredient {
  amount: string;
  unit: string;
  name: string;
}

interface Instruction {
  text: string;
}

export default function AddRecipePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { amount: "", unit: "", name: "" }
  ]);
  const [instructions, setInstructions] = useState<Instruction[]>([
    { text: "" }
  ]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      prepTime: undefined,
      cookTime: undefined,
      servings: undefined,
      image: "",
      ingredients: [],
      instructions: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Filter out empty ingredients and instructions
      const validIngredients = ingredients.filter(ing => 
        ing.name.trim() && ing.amount.trim()
      );
      const validInstructions = instructions.filter(inst => 
        inst.text.trim()
      );

      if (validIngredients.length === 0) {
        throw new Error("Добавете поне една съставка");
      }
      if (validInstructions.length === 0) {
        throw new Error("Добавете поне една стъпка за приготвяне");
      }

      const recipeData = {
        ...data,
        ingredients: validIngredients,
        instructions: validInstructions,
      };

      return apiRequest("POST", "/api/recipes", recipeData);
    },
    onSuccess: () => {
      toast({
        title: "Успех!",
        description: "Рецептата беше добавена успешно.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
      form.reset();
      setIngredients([{ amount: "", unit: "", name: "" }]);
      setInstructions([{ text: "" }]);
    },
    onError: (error: Error) => {
      toast({
        title: "Грешка",
        description: error.message || "Възникна грешка при добавянето на рецептата.",
        variant: "destructive",
      });
    },
  });

  const addIngredient = () => {
    setIngredients([...ingredients, { amount: "", unit: "", name: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, { text: "" }]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = { text: value };
    setInstructions(newInstructions);
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const categories = [
    { value: "main", label: "Основни ястия" },
    { value: "salads", label: "Салати" },
    { value: "desserts", label: "Десерти" },
    { value: "soups", label: "Супи" },
    { value: "appetizers", label: "Предястия" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-4">
          Добави нова рецепта
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Споделете своята любима рецепта с нашата общност от любители на кулинарията
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-playfair">Основна информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Име на рецептата *</FormLabel>
                      <FormControl>
                        <Input placeholder="Например: Домашна баница" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Категория *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Изберете категория" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Време за подготовка (мин)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cookTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Време за готвене (мин) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Брой порции *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Кратко описание *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Опишете накратко рецептата..." 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-playfair">Снимка на ястието</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-warm-orange transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg text-gray-600 mb-2">URL на снимката</p>
                        <Input 
                          placeholder="https://example.com/recipe-image.jpg" 
                          {...field} 
                          className="max-w-md mx-auto"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Въведете URL адрес на снимка от интернет
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-playfair">Съставки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    placeholder="Количество"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                    className="w-24"
                  />
                  <Input
                    placeholder="Мерна единица"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                    className="w-32"
                  />
                  <Input
                    placeholder="Съставка"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={addIngredient}
                className="text-warm-orange hover:text-deep-amber"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добави съставка
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-playfair">Стъпки за приготвяне</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-warm-orange text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <Textarea
                    placeholder="Опишете стъпката за приготвяне..."
                    value={instruction.text}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    rows={2}
                    className="flex-1 resize-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInstruction(index)}
                    disabled={instructions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={addInstruction}
                className="text-warm-orange hover:text-deep-amber"
              >
                <Plus className="h-4 w-4 mr-2" />
                Добави стъпка
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg"
              className="bg-warm-orange hover:bg-deep-amber px-8"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Публикуване..." : "Публикувай рецептата"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
