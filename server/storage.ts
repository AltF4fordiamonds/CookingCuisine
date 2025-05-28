import { 
  recipes, 
  contacts, 
  users, 
  type Recipe, 
  type InsertRecipe, 
  type Contact, 
  type InsertContact,
  type User, 
  type InsertUser 
} from "@shared/schema";

export interface IStorage {
  // Recipe methods
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;
  searchRecipes(query: string): Promise<Recipe[]>;
  filterRecipesByCategory(category: string): Promise<Recipe[]>;
  
  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // User methods (existing)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private recipes: Map<number, Recipe>;
  private contacts: Map<number, Contact>;
  private users: Map<number, User>;
  private currentRecipeId: number;
  private currentContactId: number;
  private currentUserId: number;

  constructor() {
    this.recipes = new Map();
    this.contacts = new Map();
    this.users = new Map();
    this.currentRecipeId = 1;
    this.currentContactId = 1;
    this.currentUserId = 1;
    
    // Initialize with sample recipes
    this.initializeSampleRecipes();
  }

  private initializeSampleRecipes() {
    const sampleRecipes = [
      {
        title: "Класическа баница",
        description: "Традиционна българска баница с яйца и сирене, приготвена с домашно тесто",
        category: "main",
        prepTime: 30,
        cookTime: 45,
        servings: 6,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        ingredients: [
          { amount: "500", unit: "г", name: "готови кори за баница" },
          { amount: "4", unit: "бр", name: "яйца" },
          { amount: "300", unit: "г", name: "сирене (настъргано)" },
          { amount: "200", unit: "мл", name: "мляко" },
          { amount: "100", unit: "мл", name: "слънчогледово олио" },
          { amount: "1", unit: "ч.л.", name: "сол" }
        ],
        instructions: [
          { text: "Загрейте фурната до 200°C." },
          { text: "В купа разбийте яйцата с млякото и олиото." },
          { text: "Добавете настърганото сирене и солта." },
          { text: "Намаслете тава за печене." },
          { text: "Подредете корите в тавата, като всяка кора намажете със сместа." },
          { text: "Печете 45 минути до златисто." }
        ]
      },
      {
        title: "Шопска салата",
        description: "Свежа традиционна българска салата с домати, краставици и сирене",
        category: "salads",
        prepTime: 15,
        cookTime: 0,
        servings: 4,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        ingredients: [
          { amount: "4", unit: "бр", name: "домати" },
          { amount: "2", unit: "бр", name: "краставици" },
          { amount: "1", unit: "бр", name: "червен пипер" },
          { amount: "1", unit: "бр", name: "голяма лучена глава" },
          { amount: "200", unit: "г", name: "бяло сирене" },
          { amount: "3", unit: "с.л.", name: "зехтин" },
          { amount: "1", unit: "с.л.", name: "оцет" },
          { amount: "1", unit: "щипка", name: "сол" },
          { amount: "1", unit: "щипка", name: "черен пипер" }
        ],
        instructions: [
          { text: "Нарежете доматите на парченца." },
          { text: "Нарежете краставиците на колелца." },
          { text: "Нарежете червения пипер на ивици." },
          { text: "Нарежете лука на тънки колелца." },
          { text: "Смесете всички зеленчуци в салатиера." },
          { text: "Добавете зехтина, оцета, солта и черния пипер." },
          { text: "Настъргайте сиренето отгоре и сервирайте." }
        ]
      },
      {
        title: "Тиквеник",
        description: "Сладък традиционен десерт с тиква и орехи",
        category: "desserts",
        prepTime: 45,
        cookTime: 40,
        servings: 8,
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        ingredients: [
          { amount: "500", unit: "г", name: "готови кори за баница" },
          { amount: "1", unit: "кг", name: "тиква (настъргана)" },
          { amount: "200", unit: "г", name: "захар" },
          { amount: "100", unit: "г", name: "орехи (смлени)" },
          { amount: "100", unit: "мл", name: "слънчогледово олио" },
          { amount: "2", unit: "ч.л.", name: "канела" },
          { amount: "1", unit: "пакетче", name: "ванилия" }
        ],
        instructions: [
          { text: "Загрейте фурната до 180°C." },
          { text: "Смесете настърганата тиква със захарта и оставете 15 минути." },
          { text: "Добавете орехите, канелата и ванилията." },
          { text: "Намаслете тава за печене." },
          { text: "Подредете корите в тавата, като всяка кора намажете с олио и тиквената смес." },
          { text: "Печете 40 минути до златисто." },
          { text: "Оставете да се охлади преди сервиране." }
        ]
      },
      {
        title: "Пилешка супа с фиде",
        description: "Топла и питателна супа с пилешко месо и фиде",
        category: "soups",
        prepTime: 20,
        cookTime: 60,
        servings: 4,
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        ingredients: [
          { amount: "500", unit: "г", name: "пилешко месо" },
          { amount: "100", unit: "г", name: "фиде" },
          { amount: "2", unit: "бр", name: "моркови" },
          { amount: "1", unit: "бр", name: "лук" },
          { amount: "2", unit: "л", name: "вода" },
          { amount: "2", unit: "с.л.", name: "слънчогледово олио" },
          { amount: "1", unit: "ч.л.", name: "сол" },
          { amount: "1", unit: "щипка", name: "черен пипер" },
          { amount: "1", unit: "с.л.", name: "нарязан магданоз" }
        ],
        instructions: [
          { text: "Сложете пилешкото месо във вода и го варете 40 минути." },
          { text: "Извадете месото и го нарежете на парченца." },
          { text: "Прецедете бульона." },
          { text: "Нарежете лука и морковите на дребно." },
          { text: "Запържете ги в олио до размекване." },
          { text: "Добавете бульона и варете 10 минути." },
          { text: "Добавете фидетата и варете 8-10 минути." },
          { text: "Върнете месото в супата, подправете и поръсете с магданоз." }
        ]
      },
      {
        title: "Кьопоолу",
        description: "Традиционно българско предястие от печени патладжани",
        category: "appetizers",
        prepTime: 30,
        cookTime: 45,
        servings: 6,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
        ingredients: [
          { amount: "3", unit: "бр", name: "едри патладжани" },
          { amount: "2", unit: "бр", name: "червени пиперки" },
          { amount: "4", unit: "скилидки", name: "чесън" },
          { amount: "3", unit: "с.л.", name: "зехтин" },
          { amount: "1", unit: "с.л.", name: "оцет" },
          { amount: "1", unit: "ч.л.", name: "сол" },
          { amount: "1", unit: "с.л.", name: "нарязан магданоз" }
        ],
        instructions: [
          { text: "Загрейте фурната до 200°C." },
          { text: "Пробождете патладжаните с вилица и ги печете 30-40 минути." },
          { text: "Печете пиперките 20 минути." },
          { text: "Оставете да се охладят, след това ги обелете." },
          { text: "Нарежете патладжаните и пиперките на дребно." },
          { text: "Смачкайте чесъна със сол." },
          { text: "Смесете всички продукти с зехтина и оцета." },
          { text: "Поръсете с магданоз и сервирайте." }
        ]
      }
    ];

    sampleRecipes.forEach(recipe => {
      const id = this.currentRecipeId++;
      const fullRecipe: Recipe = { ...recipe, id };
      this.recipes.set(id, fullRecipe);
    });
  }

  // Recipe methods
  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const id = this.currentRecipeId++;
    const recipe: Recipe = { ...insertRecipe, id };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async updateRecipe(id: number, recipeUpdate: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const existingRecipe = this.recipes.get(id);
    if (!existingRecipe) {
      return undefined;
    }
    
    const updatedRecipe: Recipe = { ...existingRecipe, ...recipeUpdate };
    this.recipes.set(id, updatedRecipe);
    return updatedRecipe;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    return this.recipes.delete(id);
  }

  async searchRecipes(query: string): Promise<Recipe[]> {
    const allRecipes = Array.from(this.recipes.values());
    const lowercaseQuery = query.toLowerCase();
    
    return allRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(lowercaseQuery) ||
      recipe.description.toLowerCase().includes(lowercaseQuery) ||
      recipe.ingredients.some(ingredient => 
        ingredient.name.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  async filterRecipesByCategory(category: string): Promise<Recipe[]> {
    const allRecipes = Array.from(this.recipes.values());
    return allRecipes.filter(recipe => recipe.category === category);
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = { ...insertContact, id };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  // User methods (existing)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
