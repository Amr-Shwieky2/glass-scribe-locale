export interface TestimonialData {
  id: string;
  name: string;
  location: { en: string; he: string; ar: string; ru: string };
  rating: number;
  text: { en: string; he: string; ar: string; ru: string };
  project: { en: string; he: string; ar: string; ru: string };
}

export const TESTIMONIALS: TestimonialData[] = [
  {
    id: '1',
    name: 'David Cohen',
    location: {
      en: 'Tel Aviv',
      he: 'תל אביב',
      ar: 'تل أبيب',
      ru: 'Тель-Авив',
    },
    rating: 5,
    text: {
      en: 'Exceptional quality and professionalism. The shower enclosure they installed transformed our bathroom completely. Highly recommended!',
      he: 'איכות ומקצועיות יוצאי דופן. מארז המקלחת שהתקינו שינה את חדר האמבטיה שלנו לחלוטין. ממליץ בחום!',
      ar: 'جودة واحترافية استثنائية. حاوية الدش التي قاموا بتركيبها حولت حمامنا بالكامل. موصى به بشدة!',
      ru: 'Исключительное качество и профессионализм. Душевая кабина полностью преобразила нашу ванную. Очень рекомендую!',
    },
    project: {
      en: 'Frameless Shower Installation',
      he: 'התקנת מקלחון ללא מסגרת',
      ar: 'تركيب دش بدون إطار',
      ru: 'Установка безрамной душевой кабины',
    },
  },
  {
    id: '2',
    name: 'Sarah Levy',
    location: {
      en: 'Jerusalem',
      he: 'ירושלים',
      ar: 'القدس',
      ru: 'Иерусалим',
    },
    rating: 5,
    text: {
      en: 'The glass railing on our balcony is absolutely stunning. Great attention to detail and the team was very professional throughout the process.',
      he: 'מעקה הזכוכית במרפסת שלנו פשוט מדהים. תשומת לב רבה לפרטים והצוות היה מקצועי מאוד לאורך כל התהליך.',
      ar: 'الدرابزين الزجاجي على شرفتنا مذهل تماماً. اهتمام كبير بالتفاصيل وكان الفريق محترفاً للغاية طوال العملية.',
      ru: 'Стеклянное ограждение на нашем балконе просто потрясающее. Отличное внимание к деталям, очень профессиональная команда.',
    },
    project: {
      en: 'Balcony Glass Railing',
      he: 'מעקה זכוכית למרפסת',
      ar: 'درابزين زجاجي للشرفة',
      ru: 'Стеклянное ограждение балкона',
    },
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    location: {
      en: 'Haifa',
      he: 'חיפה',
      ar: 'حيفا',
      ru: 'Хайфа',
    },
    rating: 5,
    text: {
      en: 'They did an amazing job with our office glass partitions. The space looks modern and the team was respectful of our work schedule.',
      he: 'הם עשו עבודה מדהימה עם מחיצות הזכוכית במשרד שלנו. המרחב נראה מודרני והצוות כיבד את לוח הזמנים שלנו.',
      ar: 'قاموا بعمل رائع مع الفواصل الزجاجية في مكتبنا. تبدو المساحة حديثة وكان الفريق يحترم جدول عملنا.',
      ru: 'Они проделали потрясающую работу со стеклянными перегородками в нашем офисе. Пространство выглядит современно, и команда уважала наш график.',
    },
    project: {
      en: 'Office Glass Partitions',
      he: 'מחיצות זכוכית למשרד',
      ar: 'فواصل زجاجية للمكتب',
      ru: 'Офисные стеклянные перегородки',
    },
  },
  {
    id: '4',
    name: 'Rachel Ben-David',
    location: {
      en: 'Ramat Gan',
      he: 'רמת גן',
      ar: 'رمات غان',
      ru: 'Рамат-Ган',
    },
    rating: 5,
    text: {
      en: 'From measurement to installation, everything was seamless. The custom mirror they made for our living room is exactly what we envisioned.',
      he: 'מהמדידה ועד ההתקנה, הכל היה חלק. המראה המותאמת שהכינו לסלון שלנו היא בדיוק מה שדמיינו.',
      ar: 'من القياس إلى التثبيت، كل شيء كان سلساً. المرآة المخصصة التي صنعوها لغرفة المعيشة هي بالضبط ما تصورناه.',
      ru: 'От замера до установки — всё было безупречно. Зеркало на заказ для нашей гостиной — именно то, что мы представляли.',
    },
    project: {
      en: 'Custom Wall Mirror',
      he: 'מראה קיר מותאמת',
      ar: 'مرآة حائط مخصصة',
      ru: 'Настенное зеркало на заказ',
    },
  },
];
