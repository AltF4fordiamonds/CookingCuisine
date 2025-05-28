import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Users, Search, Plus } from "lucide-react";
import type { Recipe } from "@shared/schema";

export default function HomePage() {
  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const featuredRecipes = recipes?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-warm-orange to-deep-amber text-white">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6 text-[#ed9f66]">
              Добре дошли в{" "}
              <span className="font-dancing text-[#f20202]">ЖиГулИ рецепти</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Открийте невероятни кулинарни рецепти и споделете своите любими ястия с нашата общност
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/recipes">
                <Button size="lg" className="bg-bright-yellow text-gray-800 hover:bg-yellow-400">
                  <Search className="w-5 h-5 mr-2" />
                  Разгледай рецепти
                </Button>
              </Link>
              <Link href="/add-recipe">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-800"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Добави рецепта
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Featured Recipes Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-4">
            Препоръчани рецепти
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Открийте най-популярните и вкусни рецепти от нашата колекция
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : featuredRecipes.length > 0 ? (
            featuredRecipes.map((recipe) => (
              <Link key={recipe.id} href={`/recipe/${recipe.id}`}>
                <Card 
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  {recipe.image && (
                    <img 
                      src={`${recipe.image}?v=${recipe.id}`} 
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-playfair font-semibold mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {recipe.cookTime} мин
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {recipe.servings} порции
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">
                Все още няма добавени рецепти. Бъдете първите, които ще споделят своите кулинарни творения!
              </p>
              <Link href="/add-recipe">
                <Button className="mt-4 bg-warm-orange hover:bg-deep-amber">
                  <Plus className="w-4 h-4 mr-2" />
                  Добави първата рецепта
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* About Section */}
      <div className="bg-warm-gray py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-800 mb-6">
                За ЖиГулИ рецепти
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Нашият сайт е създаден с любов към кулинарията и желанието да споделим 
                страстта си към готвенето. Тук ще намерите разнообразни рецепти - от 
                традиционни български ястия до международни кулинарни изкушения.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Присъединете се към нашата общност и споделете своите любими рецепти. 
                Заедно можем да създадем най-голямата колекция от вкусни и проверени рецепти!
              </p>
              <Link href="/add-recipe">
                <Button className="bg-warm-orange hover:bg-deep-amber">
                  <Plus className="w-4 h-4 mr-2" />
                  Присъедини се
                </Button>
              </Link>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556909114-35f207c8bb1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Готвач в кухня" 
                className="rounded-xl shadow-lg w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-warm-orange">
                    {recipes?.length || 0}+
                  </div>
                  <div className="text-gray-600">Рецепти</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
