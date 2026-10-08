const SITE_DEFAULT = {
  phones: [
    { label: "+7 (932) 601-13-31", tel: "+79326011331" },
    { label: "+7 (343) 361-39-31", tel: "+73433613931" }
  ],
  address: "г. Екатеринбург, ул. Дошкольная, 26",
  mapUrl: "https://yandex.ru/maps/?text=Екатеринбург,+Дошкольная+26",
  maxUrl: "https://max.ru/",
  hours: "",
  socials: [],
  legal: "ИП Ибрагимова Мария Игоревна · ИНН 667354656138 · ОГРНИП 322665800300073"
};

const MENU_DEFAULT = [
  {
    id: "shashlik",
    title: "Шашлыки",
    lead: "Мясо на настоящем мангале по кавказским традициям.",
    script: "Настоящий вкус мангала",
    items: [
      { id: "lamb-ribs", group: "lamb", groupTitle: "Из баранины", name: "Шашлык из баранины — рёбрышки", description: "Сочные бараньи рёбрышки, приготовленные на мангале с ароматными специями по кавказским традициям.", composition: "Баранина (рёбрышки)", weight: "250 г", price: 650, image: "images/dishes/lamb-ribs.jpg" },
      { id: "lamb-pulp", group: "lamb", groupTitle: "Из баранины", name: "Шашлык из баранины — мякоть", description: "Нежная и сочная мякоть баранины, приготовленная на мангале с ароматными специями по кавказским традициям.", composition: "Баранина (мякоть)", weight: "250 г", price: 750, image: "images/dishes/lamb-pulp.jpg" },
      { id: "beef-basturma", group: "beef", groupTitle: "Из говядины", name: "Шашлык из говядины — бастурма", description: "Сочная и ароматная говяжья бастурма, приготовленная на мангале по кавказским традициям.", composition: "Говядина (бастурма)", weight: "250 г", price: 650, image: "images/dishes/beef-basturma.jpg" },
      { id: "pork-neck", group: "pork", groupTitle: "Из свинины", name: "Шашлык из свинины — шейка", description: "Нежная и сочная свиная шейка, приготовленная на мангале по кавказским традициям.", composition: "Свиная шейка", weight: "250 г", price: 450, image: "images/dishes/pork-neck.jpg" },
      { id: "pork-ham", group: "pork", groupTitle: "Из свинины", name: "Шашлык из свинины — окорок", description: "Сочный свиной окорок, приготовленный на мангале по кавказским традициям.", composition: "Свиной окорок", weight: "250 г", price: 350, image: "images/dishes/pork-ham.jpg" },
      { id: "pork-bone", group: "pork", groupTitle: "Из свинины", name: "Шашлык из свинины — на кости", description: "Сочный свиной шашлык на кости, приготовленный на мангале по кавказским традициям.", composition: "Свинина на кости", weight: "250 г", price: 350, image: "images/dishes/pork-bone.jpg" },
      { id: "chicken-fillet", group: "chicken", groupTitle: "Из курицы", name: "Шашлык из курицы — филе", description: "Нежное куриное филе, приготовленное на мангале с ароматными специями по кавказским традициям.", composition: "Куриное филе", weight: "250 г", price: 400, image: "images/dishes/chicken-fillet.jpg" },
      { id: "chicken-bone", group: "chicken", groupTitle: "Из курицы", name: "Шашлык из курицы — на кости", description: "Сочный куриный шашлык на кости, приготовленный на мангале по кавказским традициям.", composition: "Курица на кости", weight: "250 г", price: 300, image: "images/dishes/chicken-bone.jpg" },
      { id: "chicken-wings", group: "chicken", groupTitle: "Из курицы", name: "Шашлык из курицы — крылышки", description: "Сочные куриные крылышки, приготовленные на мангале по кавказским традициям.", composition: "Куриные крылышки", weight: "250 г", price: 300, image: "images/dishes/chicken-wings.jpg" }
    ]
  },
  {
    id: "lyulya",
    title: "Люля-кебаб",
    lead: "Сочный люля-кебаб с мангала.",
    script: "",
    items: [
      { id: "lyulya-beef", name: "Люля-кебаб с мясом", description: "Сочный люля-кебаб из отборной говядины, приготовленный на мангале.", composition: "Говядина", weight: "250 г", price: 400, image: "images/dishes/lyulya-beef.jpg" },
      { id: "lyulya-pork", name: "Люля-кебаб из свинины", description: "Сочный люля-кебаб из отборной свинины, приготовленный на мангале.", composition: "Свинина", weight: "250 г", price: 350, image: "images/dishes/lyulya-pork.jpg" },
      { id: "lyulya-chicken", name: "Люля-кебаб из курицы", description: "Сочный люля-кебаб из нежного куриного мяса, приготовленный на мангале.", composition: "Куриное мясо", weight: "250 г", price: 350, image: "images/dishes/lyulya-chicken.jpg" },
      { id: "lyulya-potato", name: "Люля-кебаб из картофеля", description: "Нежный люля-кебаб из картофеля с ароматными специями, приготовленный на мангале.", composition: "Картофель и специи", weight: "250 г", price: 250, image: "images/dishes/lyulya-potato.jpg" }
    ]
  },
  {
    id: "shawarma",
    title: "Шаурма на мангале",
    lead: "Мясо с мангала, свежие овощи и фирменный соус в ароматном лаваше.",
    script: "Традиции вкуса в каждом кусочке",
    items: [
      { id: "shawarma-beef", name: "Шаурма из говядины", description: "Сочная говядина, приготовленная на мангале, свежие овощи, фирменный соус в ароматном лаваше.", composition: "Говядина на мангале, свежие овощи и фирменный соус, ароматный лаваш", weight: "350 г", price: 290, image: "images/dishes/shawarma-beef.jpg" },
      { id: "shawarma-pork", name: "Шаурма из свинины", description: "Сочная свинина, приготовленная на мангале, свежие овощи, фирменный соус в ароматном лаваше.", composition: "Свинина на мангале, свежие овощи и фирменный соус, ароматный лаваш", weight: "350 г", price: 290, image: "images/dishes/shawarma-pork.jpg" },
      { id: "shawarma-chicken", name: "Шаурма из курицы", description: "Сочная курица, приготовленная на мангале, свежие овощи, фирменный соус в ароматном лаваше.", composition: "Курица на мангале, свежие овощи и фирменный соус, ароматный лаваш", weight: "350 г", price: 290, image: "images/dishes/shawarma-chicken.jpg" }
    ]
  },
  {
    id: "grill",
    title: "На гриле",
    lead: "Овощи, грибы и картофель с мангала.",
    script: "",
    items: [
      { id: "veg-mix", name: "Шашлыки из овощей — ассорти", description: "Свежие овощи, приготовленные на гриле.", composition: "Свежие овощи", weight: "250 г", price: 250, image: "images/dishes/veg-mix.jpg" },
      { id: "mushrooms", name: "Шампиньоны на гриле", description: "Сочные шампиньоны, приготовленные на мангале с ароматными специями.", composition: "Шампиньоны на гриле", weight: "100 г", price: 250, image: "images/dishes/mushrooms.jpg" },
      { id: "potato-grill", name: "Картофель на гриле", description: "Ароматный картофель, приготовленный на гриле с ароматными специями.", composition: "Картофель на гриле", weight: "100 г", price: 150, image: "images/dishes/potato-grill.jpg" }
    ]
  },
  {
    id: "boxes",
    title: "Боксы",
    lead: "Ассорти из шашлыка и овощей на компанию.",
    script: "Идеально для компании",
    highlight: true,
    items: [
      { id: "box-1", name: "Бокс №1", description: "Бокс на 4 человека: ассорти из шашлыка и овощей с мангала.", composition: "Бараньи рёбра, свинина, шашлык из бастурмы, шашлык из куриного филе, люля-кебаб, картофель на гриле, овощи на гриле", weight: "на 4 человека", price: 3990, image: "images/dishes/box-1.jpg" },
      { id: "box-2", name: "Бокс №2", description: "Бокс на 6 человек: ассорти из шашлыка и овощей с мангала.", composition: "Бараньи рёбра, свинина, шашлык из бастурмы, шашлык из куриного филе, люля-кебаб, картофель на гриле, овощи на гриле", weight: "на 6 человек", price: 5990, image: "images/dishes/box-2.jpg" },
      { id: "box-3", name: "Бокс №3", description: "Бокс на 8 человек: ассорти из шашлыка и овощей с мангала.", composition: "Бараньи рёбра, свинина, шашлык из бастурмы, шашлык из куриного филе, люля-кебаб, картофель на гриле, овощи на гриле", weight: "на 8 человек", price: 7990, image: "images/dishes/box-3.jpg" }
    ]
  },
  {
    id: "hot",
    title: "Горячие блюда",
    lead: "Бакинские горячие блюда к шашлыку.",
    script: "",
    items: [
      { id: "gutab", name: "Гутаб по-бакински", description: "Гутаб с зеленью и сыром.", composition: "Зелень и сыр", weight: "", price: 150, image: "images/dishes/gutab.jpg" },
      { id: "plov", name: "Плов с мясом", description: "Ароматный плов из говядины с рассыпчатым рисом, морковью и специями.", composition: "Говядина, рис, морковь, специи", weight: "360 г", price: 350, image: "images/dishes/plov.jpg" },
      { id: "buglama", name: "Буглама бакинская", description: "Нежная баранина, томлёная с овощами по традиционному бакинскому рецепту.", composition: "Баранина с овощами", weight: "400 г", price: 500, image: "images/dishes/buglama.jpg" },
      { id: "dolma", name: "Долма по-бакински", description: "Нежные виноградные листья с ароматной начинкой из говядины, риса и специй по традиционному бакинскому рецепту.", composition: "Виноградные листья, говядина, рис, специи", weight: "360 г", price: 400, image: "images/dishes/dolma.jpg" }
    ]
  },
  {
    id: "salads",
    title: "Салаты",
    lead: "Свежие салаты к мясу с мангала.",
    script: "",
    items: [
      { id: "salad-greek", name: "Салат греческий", description: "Лёгкий салат из бакинских томатов, огурцов, сладкого перца и красного лука с сыром «Брынза».", composition: "Бакинские томаты, огурцы, сладкий перец, красный лук, сыр «Брынза»", weight: "250 г", price: 350, image: "images/dishes/salad-greek.jpg" },
      { id: "salad-mangal", name: "Мангал салат", description: "Баклажан, помидор, перец и красный лук, заправленные оливковым маслом и свежей зеленью.", composition: "Баклажан, помидор, перец, красный лук, оливковое масло, свежая зелень", weight: "220 г", price: 300, image: "images/dishes/salad-mangal.jpg" }
    ]
  },
  {
    id: "cold",
    title: "Холодные закуски",
    lead: "Свежие овощи и зелень к столу.",
    script: "",
    items: [
      { id: "veg-bouquet", name: "Овощной букет", description: "Свежая нарезка овощей, сыра и зелени.", composition: "Помидор, огурцы, перец, редиска, сыр, кинза, петрушка, укроп, лук зелёный", weight: "420 г", price: 500, image: "images/dishes/veg-bouquet.jpg" }
    ]
  }
];

function buildDefaultState() {
  return {
    savedAt: 0,
    settings: JSON.parse(JSON.stringify(SITE_DEFAULT)),
    categories: JSON.parse(JSON.stringify(MENU_DEFAULT))
  };
}
