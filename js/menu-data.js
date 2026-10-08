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
    lead: "Мясо на настоящем мангале: дымок, корочка и сок внутри.",
    script: "Настоящий вкус мангала",
    items: [
      { id: "lamb-ribs", group: "lamb", groupTitle: "Из баранины", name: "Шашлык из баранины — рёбрышки", description: "Сочные бараньи рёбрышки, приготовленные на настоящем мангале.", composition: "Баранина на кости, соль, специи", weight: "250 г", price: 650, image: "images/lamb-ribs.jpg" },
      { id: "lamb-pulp", group: "lamb", groupTitle: "Из баранины", name: "Шашлык из баранины — мякоть", description: "Мягкая мякоть баранины с ароматом дымка и открытого огня.", composition: "Мякоть баранины, соль, специи", weight: "250 г", price: 750, image: "images/lamb.jpg" },
      { id: "beef-basturma", group: "beef", groupTitle: "Из говядины", name: "Шашлык из говядины — бастурма", description: "Плотная говяжья бастурма на углях, с пряной корочкой.", composition: "Говядина, соль, специи", weight: "250 г", price: 650, image: "images/beef.jpg" },
      { id: "pork-neck", group: "pork", groupTitle: "Из свинины", name: "Шашлык из свинины — шейка", description: "Сочная свиная шейка на мангале, с мягким жирком и дымком.", composition: "Свиная шейка, соль, специи", weight: "250 г", price: 450, image: "images/pork.jpg" },
      { id: "pork-ham", group: "pork", groupTitle: "Из свинины", name: "Шашлык из свинины — окорок", description: "Окорок на углях: плотное мясо и ровная прожарка.", composition: "Свиной окорок, соль, специи", weight: "250 г", price: 350, image: "images/grill-meat.jpg" },
      { id: "pork-bone", group: "pork", groupTitle: "Из свинины", name: "Шашлык из свинины — на кости", description: "Мясо на кости, приготовленное на открытом огне.", composition: "Свинина на кости, соль, специи", weight: "250 г", price: 350, image: "images/pork-bone.jpg" },
      { id: "chicken-fillet", group: "chicken", groupTitle: "Из курицы", name: "Шашлык из курицы — филе", description: "Нежное куриное филе с лёгким ароматом мангала.", composition: "Куриное филе, соль, специи", weight: "250 г", price: 400, image: "images/chicken.jpg" },
      { id: "chicken-bone", group: "chicken", groupTitle: "Из курицы", name: "Шашлык из курицы — на кости", description: "Курица на кости: сочная внутри и румяная снаружи.", composition: "Курица на кости, соль, специи", weight: "250 г", price: 300, image: "images/grill-meat.jpg" },
      { id: "chicken-wings", group: "chicken", groupTitle: "Из курицы", name: "Шашлык из курицы — крылышки", description: "Румяные крылышки, приготовленные на мангале.", composition: "Куриные крылья, соль, специи", weight: "250 г", price: 300, image: "images/wings.jpg" },
      { id: "chicken-lavash", group: "grill", groupTitle: "Кура гриль в лаваше", name: "Кура гриль в лаваше", description: "Курица гриль в мягком лаваше. Вес и стоимость сообщим при заказе.", composition: "Курица гриль, лаваш", weight: "уточняется", price: null, image: "images/wrap-3.jpg" }
    ]
  },
  {
    id: "lyulya",
    title: "Люля-кебаб",
    lead: "Сочный фарш на мангале — говядина, свинина, курица и картофель.",
    script: "",
    items: [
      { id: "lyulya-beef", name: "Люля-кебаб из говядины", description: "Сочный люля-кебаб из говядины, приготовленный на мангале.", composition: "Говядина, лук, специи", weight: "250 г", price: 400, image: "images/beef.jpg" },
      { id: "lyulya-pork", name: "Люля-кебаб из свинины", description: "Ароматный люля-кебаб из свинины с дымком мангала.", composition: "Свинина, лук, специи", weight: "250 г", price: 350, image: "images/pork.jpg" },
      { id: "lyulya-chicken", name: "Люля-кебаб из курицы", description: "Нежный куриный люля-кебаб, приготовленный на углях.", composition: "Курица, лук, специи", weight: "250 г", price: 350, image: "images/chicken.jpg" },
      { id: "lyulya-potato", name: "Люля-кебаб из картофеля", description: "Картофельный люля-кебаб с мангала — сытный и ароматный.", composition: "Картофель, специи", weight: "200 г", price: 200, image: "images/potato.jpg" }
    ]
  },
  {
    id: "lyulya-lavash",
    title: "Люля-кебаб в лаваше",
    lead: "Люля-кебаб в мягком лаваше, со свежими овощами, зеленью и двумя соусами.",
    script: "",
    items: [
      { id: "ll-beef", name: "Люля-кебаб в лаваше из говядины", description: "Сочный люля-кебаб из говядины в мягком лаваше со свежими овощами, ароматной зеленью и фирменными соусами.", composition: "Люля-кебаб из говядины, свежие помидоры, огурцы, репчатый лук с зеленью, красный и белый соусы, лаваш", weight: "уточняется", price: 350, image: "images/wrap-1.jpg" },
      { id: "ll-chicken", name: "Люля-кебаб в лаваше из курицы", description: "Нежный куриный люля-кебаб, завёрнутый в мягкий лаваш со свежими овощами, зеленью и двумя соусами.", composition: "Люля-кебаб из курицы, свежие помидоры, огурцы, репчатый лук с зеленью, красный и белый соусы, лаваш", weight: "уточняется", price: 300, image: "images/wrap-3.jpg" },
      { id: "ll-pork", name: "Люля-кебаб в лаваше из свинины", description: "Ароматный люля-кебаб из свинины в мягком лаваше со свежими овощами, зеленью и фирменными соусами.", composition: "Люля-кебаб из свинины, свежие помидоры, огурцы, репчатый лук с зеленью, красный и белый соусы, лаваш", weight: "уточняется", price: 300, image: "images/wrap-2.jpg" }
    ]
  },
  {
    id: "boxes",
    title: "САМ·АМ! Боксы",
    lead: "Наборы для компаний, семейных встреч и мероприятий. В составе — блюда из ассортимента: шашлыки, люля-кебаб, шаурма, картофель и овощи. Точный состав каждого бокса сообщим при подтверждении заказа.",
    script: "Для компании и хорошего настроения!",
    highlight: true,
    items: [
      { id: "box-1", name: "САМ·АМ! Бокс №1", description: "Набор для компании. Шашлыки, люля-кебаб, шаурма, картофель и овощи — соберём и подтвердим состав.", composition: "Блюда из ассортимента заведения: шашлыки, люля-кебаб, шаурма, картофель и овощи", weight: "на 4 человека", price: 3990, image: "images/box-1.jpg" },
      { id: "box-2", name: "САМ·АМ! Бокс №2", description: "Большой набор к столу, когда собирается компания. Состав подтвердим перед доставкой.", composition: "Блюда из ассортимента заведения: шашлыки, люля-кебаб, шаурма, картофель и овощи", weight: "на 6 человек", price: 5990, image: "images/box-2.jpg" },
      { id: "box-3", name: "САМ·АМ! Бокс №3", description: "Самый большой бокс — для праздника и длинного стола. Состав согласуем при заказе.", composition: "Блюда из ассортимента заведения: шашлыки, люля-кебаб, шаурма, картофель и овощи", weight: "на 8 человек", price: 7990, image: "images/box-3.jpg" }
    ]
  },
  {
    id: "shawarma",
    title: "Шаурма на мангале",
    lead: "Подрумяниваем на мангале до аппетитного хруста: горячий лаваш, сочное мясо, свежие овощи и два фирменных соуса. Настоящий аромат дымка, который разжигает аппетит.",
    script: "Традиции вкуса в каждом кусочке",
    items: [
      { id: "shawarma-beef", name: "Шаурма из говядины", description: "Горячий лаваш, сочная говядина, свежие овощи и два фирменных соуса.", composition: "Говядина, помидоры, огурцы, морковь, капуста, лук, белый и красный соусы", weight: "350 г", price: 290, image: "images/wrap-1.jpg" },
      { id: "shawarma-pork", name: "Шаурма из свинины", description: "Подрумяненный лаваш, сочная свинина, овощи и два соуса.", composition: "Свинина, помидоры, огурцы, морковь, капуста, лук, белый и красный соусы", weight: "350 г", price: 290, image: "images/wrap-5.jpg" },
      { id: "shawarma-chicken", name: "Шаурма из курицы", description: "Хрустящий лаваш, нежная курица, свежие овощи и фирменные соусы.", composition: "Курица, помидоры, огурцы, морковь, капуста, лук, белый и красный соусы", weight: "350 г", price: 290, image: "images/wrap-2.jpg" }
    ]
  },
  {
    id: "vegetables",
    title: "Овощи на углях",
    lead: "Ароматные овощи, приготовленные на мангале.",
    script: "",
    items: [
      { id: "veg-mix", name: "Овощи ассорти", description: "Болгарский перец, кабачок, помидор и баклажан с дымком мангала.", composition: "Болгарский перец, кабачок, помидор, баклажан", weight: "250 г", price: 250, image: "images/veg.jpg" },
      { id: "mushrooms", name: "Шампиньоны", description: "Шампиньоны, приготовленные на углях.", composition: "Шампиньоны", weight: "100 г", price: 200, image: "images/mushrooms.jpg" },
      { id: "potato-grill", name: "Картофель на углях", description: "Картофель с мангала — к шашлыку и шаурме.", composition: "Картофель", weight: "100 г", price: 150, image: "images/potato.jpg" }
    ]
  },
  {
    id: "hot",
    title: "Горячие блюда",
    lead: "Сытные блюда для настоящего гурмана. Список и цены этого раздела добавляются через панель меню.",
    script: "",
    items: []
  },
  {
    id: "snacks-hot",
    title: "Горячие закуски",
    lead: "Традиционные закуски с мангала.",
    script: "",
    items: [
      { id: "kutab", name: "Кутаб по-бакински с зеленью и сыром", description: "Традиционный бакинский кутаб из тонкого теста с ароматной зеленью и сыром. Подаётся горячим.", composition: "Тонкое тесто, свежая зелень, сыр", weight: "1 шт", price: 150, image: "images/bread.jpg" }
    ]
  },
  {
    id: "snacks-cold",
    title: "Холодные закуски",
    lead: "Свежие овощи и салаты по-бакински.",
    script: "",
    items: [
      { id: "veg-baku", name: "Овощное ассорти по-бакински", description: "Традиционное овощное ассорти по-бакински. Сочные свежие овощи, ароматная зелень и сыр — дополнение к шашлыку.", composition: "Помидоры, огурцы, сладкий перец, редис, сыр, кинза, петрушка, укроп, зелёный лук", weight: "420 г", price: 500, image: "images/salad.jpg" },
      { id: "mangal-salad", name: "Мангал-салат", description: "Ароматный салат из овощей, приготовленных на мангале, с красным луком, свежей зеленью и заправкой из оливкового масла.", composition: "Баклажаны, помидоры, сладкий перец, красный лук, оливковое масло, свежая зелень", weight: "220 г", price: 300, image: "images/salad-2.jpg" },
      { id: "greek", name: "Греческий салат с бакинскими томатами", description: "Лёгкий и освежающий салат с сочными бакинскими томатами, свежими овощами, нежной брынзой и оливковым маслом.", composition: "Бакинские помидоры, свежие огурцы, сладкий перец, сыр брынза, оливки, красный лук, оливковое масло", weight: "250 г", price: 350, image: "images/greek.jpg" }
    ]
  },
  {
    id: "sides",
    title: "Гарниры",
    lead: "К мясу и шаурме. Новые гарниры добавляются через панель меню.",
    script: "",
    items: [
      { id: "fries", name: "Картофель фри", description: "Хрустящий картофель фри к шашлыку и шаурме.", composition: "Картофель", weight: "100 г", price: 150, image: "images/fries.jpg" }
    ]
  },
  {
    id: "extras",
    title: "Дополнительно",
    lead: "Соусы, лаваш и овощи — чтобы собрать заказ как на мангале.",
    script: "Собираем вкусные компании",
    items: [
      { id: "sauce-white", group: "sauces", groupTitle: "Соусы", name: "Соус белый", description: "Фирменный белый соус к мясу, шаурме и овощам.", composition: "Фирменный белый соус", weight: "порция", price: 50, image: "images/sauce-w.jpg" },
      { id: "sauce-red", group: "sauces", groupTitle: "Соусы", name: "Соус красный", description: "Фирменный красный соус с характером.", composition: "Фирменный красный соус", weight: "порция", price: 50, image: "images/sauce-r.jpg" },
      { id: "lavash", name: "Лаваш", description: "Мягкий лаваш к шашлыку и люля-кебаб.", composition: "Лаваш", weight: "порция", price: 50, image: "images/lavash.jpg" },
      { id: "veg-plate", name: "Овощная тарелка", description: "Свежие овощи и зелень к горячему.", composition: "Свежие овощи и зелень", weight: "порция", price: 150, image: "images/salad.jpg" }
    ]
  },
  {
    id: "drinks",
    title: "Напитки",
    lead: "Морсы, компот, лимонады и энергетики. Объём и производителя можно добавить отдельной позицией в панели меню.",
    script: "",
    items: [
      { id: "mors", name: "Морс", description: "Ягодный морс. Объём и стоимость уточним при заказе.", composition: "Морс", weight: "объём уточняется", price: null, image: "images/mors.jpg" },
      { id: "kompot", name: "Компот", description: "Домашний компот к шашлыку.", composition: "Компот", weight: "250 мл", price: 80, image: "images/kompot.jpg" },
      { id: "tarkhun", group: "lemonade", groupTitle: "Лимонады", name: "Лимонад «Тархун»", description: "Лимонад «Тархун». Объём уточним при заказе.", composition: "Лимонад «Тархун»", weight: "объём уточняется", price: 100, image: "images/tarkhun.jpg" },
      { id: "pear", group: "lemonade", groupTitle: "Лимонады", name: "Лимонад «Груша»", description: "Лимонад «Груша». Объём уточним при заказе.", composition: "Лимонад «Груша»", weight: "объём уточняется", price: 100, image: "images/pear.jpg" },
      { id: "energy", name: "Энергетические напитки", description: "Энергетик из ассортимента. Объём и стоимость уточним при заказе.", composition: "Энергетический напиток", weight: "объём уточняется", price: null, image: "images/energy.jpg" }
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
