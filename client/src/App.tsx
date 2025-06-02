import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
// import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import RecipesPage from "@/pages/RecipesPage";
import AddRecipePage from "@/pages/AddRecipePage";
import ContactPage from "@/pages/ContactPage";
import RecipeDetailPage from "@/pages/RecipeDetailPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/recipes" component={RecipesPage} />
      <Route path="/recipe/:id" component={RecipeDetailPage} />
      <Route path="/add-recipe" component={AddRecipePage} />
      <Route path="/contact" component={ContactPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// const apolloClient = new ApolloClient({
//   uri: '/graphql',
//   cache: new InMemoryCache(),
// });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
  );
}

export default App;
