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
        title: "Баница",
        description: "Баница с яйца и сирене, приготвена с домашно тесто",
        category: "main",
        prepTime: 30,
        cookTime: 45,
        servings: 6,
        image: "https://recepti.gotvach.bg/files/lib/600x350/puhkava-banica-izvara-sirene.webp",
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
        image: "https://recepti.gotvach.bg/files/lib/600x350/shopska-salata-original.webp",
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
        image: "https://recepti.gotvach.bg/files/lib/600x350/klasikatikvenik.webp",
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
        image: "https://recepti.gotvach.bg/files/lib/600x350/pilsupafidezastroika.webp",
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
        image: "https://recepti.gotvach.bg/files/lib/600x350/kiopoolu-chesan.webp",
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
      },
      {
        title: "Спагети Болонезе",
        description: "Класическа италианска паста с богат месен сос",
        category: "main",
        prepTime: 20,
        cookTime: 60,
        servings: 5,
        image: "https://recepti.gotvach.bg/files/lib/600x350/spagetkiboloneze.webp",
        ingredients: [
          { amount: "600", unit: "г", name: "мляно месо" },
          { amount: "1", unit: "пакет", name: "спагети италиански" },
          { amount: "3", unit: "с.л.", name: "зехтин" },
          { amount: "1", unit: "бр", name: "лук" },
          { amount: "1", unit: "бр", name: "морков" },
          { amount: "3", unit: "скилидки", name: "чесън" },
          { amount: "600", unit: "г", name: "домати (консерва или доматено пюре)" },
          { amount: "100", unit: "г", name: "пармезан" },
          { amount: "1", unit: "ч.л.", name: "сол" },
          { amount: "1", unit: "ч.л.", name: "риган" },
          { amount: "1", unit: "ч.л.", name: "босилек" },
          { amount: "1", unit: "щипка", name: "черен пипер" },
          { amount: "1", unit: "щипка", name: "червен пипер" },
          { amount: "1", unit: "щипка", name: "къри" }
        ],
        instructions: [
          { text: "Нарязваме на кубчета лука и моркова, задушаваме на тиган в зехтин." },
          { text: "Добавяме каймата от мляно месо и разбъркваме до нейното наситняване и запичане." },
          { text: "Поръсваме с черен пипер, къри и червен пипер, бъркаме." },
          { text: "Добавяме доматите и стриваме 2-3 скилидки чесън, поръсваме с босилек и риган." },
          { text: "Оставяме да къкри на бавен огън 30-40 минути." },
          { text: "В тенджера слагаме вода до над половината на съда и я довеждаме до кипене." },
          { text: "Добавяме малко зехтин във водата и една супена лъжица сол." },
          { text: "Слагаме спагетите, без да ги чупим, огъваме и ги оставяме да се спуснат във врящата вода." },
          { text: "Варим 6-8 минути според указанието на пакета." },
          { text: "Изцеждаме пастата и сервираме в дълбоки чинии." },
          { text: "Поливаме със сос Болонезе и настъргваме пармезан едро отгоре." }
        ]
      },
      {
        title: "Царски сладки",
        description: "Елегантни домашни сладки с орехи и меден сироп",
        category: "desserts",
        prepTime: 35,
        cookTime: 25,
        servings: 12,
        image: "https://recepti.gotvach.bg/files/lib/600x350/carskisaldki.webp",
        ingredients: [
          { amount: "500", unit: "г", name: "брашно" },
          { amount: "250", unit: "г", name: "масло" },
          { amount: "150", unit: "г", name: "пудра захар" },
          { amount: "3", unit: "бр", name: "яйца" },
          { amount: "200", unit: "г", name: "орехи (смлени)" },
          { amount: "100", unit: "г", name: "мед" },
          { amount: "2", unit: "с.л.", name: "ром или коняк" },
          { amount: "1", unit: "ч.л.", name: "ванилия" },
          { amount: "1", unit: "щипка", name: "сол" },
          { amount: "200", unit: "г", name: "шоколад за топене" },
          { amount: "50", unit: "г", name: "масло за глазура" }
        ],
        instructions: [
          { text: "Размекваме маслото и го разбиваме с пудра захарта до кремообразна консистенция." },
          { text: "Добавяме яйцата едно по едно, ванилията и солта." },
          { text: "Постепенно добавяме брашното и замесваме тесто." },
          { text: "Разделяме тестото на две части - една по-голяма за основата." },
          { text: "Разточваме по-голямата част в намаслена тава." },
          { text: "Смесваме орехите с меда и рома за плънката." },
          { text: "Разпределяме плънката върху тестото в тавата." },
          { text: "Разточваме останалото тесто и го поставяме отгоре." },
          { text: "Печем във фурна на 180°C за 25 минути до златисто." },
          { text: "Оставяме да се охлади напълно." },
          { text: "Топим шоколада с маслото и поливаме сладкишите." },
          { text: "Нарязваме на квадратчета и сервираме." }
        ]
      },
      {
        title: "Хумус със зеленчуци",
        description: "Здравословно и вкусно предястие с нахут и печени зеленчуци",
        category: "appetizers",
        prepTime: 25,
        cookTime: 30,
        servings: 4,
        image: "https://recepti.gotvach.bg/files/lib/600x350/kupichki-sosove.webp",
        ingredients: [
          { amount: "300", unit: "г", name: "нахут" },
          { amount: "2", unit: "бр", name: "червени пиперки (за печене)" },
          { amount: "1", unit: "бр", name: "патладжан" },
          { amount: "1", unit: "малка", name: "тиквичка" },
          { amount: "3", unit: "скилидки", name: "чесън" },
          { amount: "1/2", unit: "бр", name: "лимон (сок)" },
          { amount: "1", unit: "ч.л.", name: "червен пипер" },
          { amount: "на вкус", unit: "", name: "сол" },
          { amount: "3", unit: "стръка", name: "магданоз" },
          { amount: "3", unit: "с.л.", name: "зехтин" }
        ],
        instructions: [
          { text: "Накиснете нахута от предната вечер във вода." },
          { text: "На следващата сутрин го отцедете и го сложете с нова вода да се свари напълно." },
          { text: "По желание отделете люспите на нахута, но може и да ги оставите." },
          { text: "Докато нахутът се вари, сложете целия патладжан и тиквичката да се изпекат в тава, застлана с алуминиево фолио." },
          { text: "Обелете патладжана и заедно с почистената тиквичка ги нарежете на парчета." },
          { text: "Пиперките също опечете, обелете и почистете от дръжки и семки." },
          { text: "В подходящ съд пасирайте смесените нахут, чушки, патладжан, тиквички с около 1 ч.ч. бульон от варенето на нахута." },
          { text: "Ако искате да направите хумусът по-гъст, сложете по-малко количество течност." },
          { text: "Към пасираната смес добавете скълцания чесън, лимоновия сок, зехтина и подправките на вкус." },
          { text: "Отново пасирайте още веднъж, докато всичко се хомогенизира." },
          { text: "Сервирайте с арабски питки, брускети, препечени филийки или като гарнитура към месо." }
        ]
      },
      {
        title: "Пролетна супа със спанак и ориз",
        description: "Лека и питателна пролетна супа със свеж спанак и ориз",
        category: "soups",
        prepTime: 5,
        cookTime: 30,
        servings: 6,
        image: "https://recepti.gotvach.bg/files/lib/600x350/supa-spanak-oriz234.webp",
        ingredients: [
          { amount: "400", unit: "г", name: "спанак" },
          { amount: "1", unit: "ч.ч.", name: "ориз" },
          { amount: "4", unit: "л", name: "вода" },
          { amount: "2", unit: "глави", name: "кромид лук" },
          { amount: "1", unit: "бр", name: "морков" },
          { amount: "3", unit: "с.л.", name: "олио" },
          { amount: "2", unit: "бр", name: "домати" },
          { amount: "1", unit: "с.л.", name: "червен пипер" },
          { amount: "1", unit: "с.л.", name: "сол" },
          { amount: "на вкус", unit: "", name: "черен пипер" },
          { amount: "400", unit: "г", name: "домати консерва" },
          { amount: "1/2", unit: "ч.л.", name: "захар" },
          { amount: "1", unit: "ч.л.", name: "чубрица" },
          { amount: "1", unit: "ч.л.", name: "джоджен" },
          { amount: "на вкус", unit: "", name: "кисело мляко (по желание)" },
          { amount: "на вкус", unit: "", name: "лют пипер (по желание)" }
        ],
        instructions: [
          { text: "Почистете и нарежете зеленчуците - лукът и доматите на дребно, морковите може да настържете." },
          { text: "В тенджера сипете олиото, поставете на котлона и загрейте." },
          { text: "Сложете лука и моркова, запържете за минута-две, добавете доматите, разбъркайте." },
          { text: "Сипете червения пипер и пържете още минута." },
          { text: "Измийте ориза и го добавете към зеленчуците." },
          { text: "Разбъркайте и запържете, докато стане прозрачен." },
          { text: "Сипете поне 4 литра вода и оставете да кипне." },
          { text: "Гответе след завиране около 15 минути до омекване на ориза, като междувременно отпенвате образувалата се пяна." },
          { text: "Когато оризът омекне, добавете консерва домати, подправете с малко захар, чубрица и джоджен." },
          { text: "Ако е необходимо, добавете сол на вкус." },
          { text: "Измийте, почистете и накъсайте листата спанак." },
          { text: "Сложете половината количество в тенджерата, разбъркайте, изчакайте минута да омекне и намали обема си." },
          { text: "Добавете и останалото количество спанак." },
          { text: "Разбъркайте, гответе още 5-10 мин и махнете от котлона." },
          { text: "При поднасяне по желание гарнирайте с лъжица кисело мляко и лют пипер." }
        ]
      },
      {
        title: "Салата цезар",
        description: "Класическа салата цезар с пилешко месо и крутони",
        category: "salads",
        prepTime: 15,
        cookTime: 30,
        servings: 3,
        image: "https://recepti.gotvach.bg/files/lib/600x350/salatacesarpile.webp",
        ingredients: [
          { amount: "2", unit: "бр", name: "пилешки гърди" },
          { amount: "1", unit: "глава", name: "айсберг" },
          { amount: "200", unit: "г", name: "чери домати" },
          { amount: "1", unit: "бр", name: "краставица" },
          { amount: "3", unit: "с.л.", name: "майонеза" },
          { amount: "3", unit: "с.л.", name: "кисело мляко" },
          { amount: "на вкус", unit: "", name: "черен пипер" },
          { amount: "на вкус", unit: "", name: "червен пипер" },
          { amount: "на вкус", unit: "", name: "сол" },
          { amount: "2", unit: "с.л.", name: "лимонов сок" },
          { amount: "2", unit: "с.л.", name: "зехтин" },
          { amount: "100", unit: "г", name: "крутони" },
          { amount: "50", unit: "г", name: "пармезан (настърган)" }
        ],
        instructions: [
          { text: "Пилешките гърди се овкусяват със сол и черен пипер и се изпичат на скара или оребрен тиган." },
          { text: "След като изстинат се нарязват на хапки." },
          { text: "Салатата се почиства, измива се и се накъсва." },
          { text: "Прибавят се нарязаните краставица и чери доматки." },
          { text: "Добавят се пилешките късчета и крутоните." },
          { text: "В отделен съд се смесват киселото мляко, майонезата и лимоновия сок." },
          { text: "Овкусява се с черен и червен пипер и сол." },
          { text: "С готовия сос се овкусява салатата Цезар." },
          { text: "Най-отгоре се настъргва пармезан." }
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
