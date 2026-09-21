// ── Vacancy Data Architecture & Repository Layer ──────────────────
// Single Source of Truth for JobMe vacancies
// Supports active, inactive, expired states, stable slugs, and future API/Supabase integration.

export const RAW_VACANCIES = [
  {
    id: 'paczkomaty-nowa-ruda',
    slug: 'pracownik-produkcji-paczkomatow-nowa-ruda',
    status: 'active', // 'active' | 'inactive' | 'expired'
    datePosted: '2025-01-15',
    category: 'Produkcja',
    city: 'Nowa Ruda',
    voivodeship: 'Dolny Śląsk',
    locationSummary: 'Nowa Ruda / Kłodzko (Dolny Śląsk)',
    postalCode: '57-400',
    salaryHourlyNet: 25.0,
    salaryHourlyGrossStudent: 31.4,
    salaryMonthlyEstMin: 4200,
    salaryMonthlyEstMax: 5500,
    salaryDisplay: '25,00 zł / godz. netto',
    salarySubDisplay: '(dla studentów: 31,40 zł / godz. brutto). Możliwość zaliczek co tydzień.',
    currency: 'PLN',
    contractType: 'Umowa zlecenie z pełnym ZUS',
    shiftsType: '2-zmianowy (6:00-14:00, 14:00-22:00), pn.–pt.',
    housingType: 'free', // 'free' | 'paid' | 'none'
    housingPrice: 0,
    housingDescription: 'Darmowe zakwaterowanie o wysokim standardzie w pokojach 2-4 osobowych blisko zakładu pracy.',
    advances: 'weekly', // 'weekly' | 'monthly' | 'none'
    advanceDescription: 'Cotygodniowe zaliczki po przepracowaniu pierwszych 5 dni.',
    couplesWelcome: true,
    languageRequired: 'brak', // 'brak' | 'podstawowy' | 'komunikatywny'
    languageDescription: 'Brak wymogu języka polskiego — polskojęzyczny koordynator na miejscu.',
    translations: {
      pl: {
        jobTitle: 'Pracownik produkcji paczkomatów (Nowa Ruda / Kłodzko)',
        location: 'Nowa Ruda / Kłodzko (Dolny Śląsk)',
        salary: '25,00 zł / godz. netto',
        salarySub: '(dla studentów: 31,40 zł / godz. brutto). Możliwość zaliczek.',
        contract: 'Umowa zlecenie ze składkami ZUS. Praca w pełni legalna.',
        shifts: 'Praca w systemie 2-zmianowym (6:00-14:00, 14:00-22:00), od poniedziałku do piątku.',
        housing: 'Darmowe zakwaterowanie o wysokim standardzie w pokojach 2-4 osobowych blisko zakładu pracy.',
        tasks: [
          'Montaż elementów konstrukcyjnych paczkomatów',
          'Obsługa prostych narzędzi produkcyjnych',
          'Kontrola jakości gotowego produktu',
        ],
        perks: 'Zapewniamy dojazd do pracy, odzież roboczą, kawę i herbatę bez limitu oraz dostęp do darmowych kursów UDT / SEP po 3 miesiącach.',
      },
      ua: {
        jobTitle: 'Працівник виробництва поштоматів (Нова Руда / Клодзко)',
        location: 'Нова Руда / Клодзко (Нижня Сілезія)',
        salary: '25,00 zł / год. нетто',
        salarySub: '(для студентів: 31,40 zł / год. брутто). Можливість авансів.',
        contract: 'Договір злеценя зі сплатою внесків ZUS. Повністю легальна робота.',
        shifts: 'Робота у 2-змінному графіку (6:00-14:00, 14:00-22:00), з понеділка по п’ятницю.',
        housing: 'Безкоштовне житло високого стандарту в кімнатах на 2-4 особи поруч із роботою.',
        tasks: [
          'Монтаж конструктивних елементів поштоматів',
          'Робота з простими виробничими інструментами',
          'Контроль якості готової продукції',
        ],
        perks: 'Забезпечуємо доїзд до роботи, робочий одяг, необмежену каву й чай та доступ до безкоштовних курсів UDT / SEP через 3 місяці.',
      },
      en: {
        jobTitle: 'Parcel Locker Production Worker (Nowa Ruda / Kłodzko)',
        location: 'Nowa Ruda / Kłodzko (Lower Silesia)',
        salary: '25.00 PLN / hr net',
        salarySub: '(for students: 31.40 PLN / hr gross). Weekly advance payments available.',
        contract: 'Mandate contract (umowa zlecenie) with full ZUS contributions.',
        shifts: '2-shift system (6:00-14:00, 14:00-22:00), Monday to Friday.',
        housing: 'Free high-standard accommodation in rooms for 2-4 people near the workplace.',
        tasks: [
          'Assembly of parcel locker structural components',
          'Operation of basic production tools',
          'Quality control of finished products',
        ],
        perks: 'Free transport to work, work clothing provided, unlimited coffee and tea, free UDT/SEP certification courses after 3 months.',
      },
    },
  },
  {
    id: 'butle-gazowe-sosnowiec',
    slug: 'pracownik-produkcji-butli-gazowych-sosnowiec',
    status: 'active',
    datePosted: '2025-01-20',
    category: 'Produkcja',
    city: 'Sosnowiec',
    voivodeship: 'Śląsk',
    locationSummary: 'Sosnowiec (Śląsk)',
    postalCode: '41-200',
    salaryHourlyNet: 25.0,
    salaryHourlyGrossStudent: 31.4,
    salaryMonthlyEstMin: 4400,
    salaryMonthlyEstMax: 6000,
    salaryDisplay: '25,00 zł / godz. netto',
    salarySubDisplay: '(dla studentów: 31,40 zł / godz. brutto). Możliwość zaliczek co tydzień.',
    currency: 'PLN',
    contractType: 'Umowa zlecenie z pełnym ZUS',
    shiftsType: '8-12 godz. w systemie 3-zmianowym (6:00-14:00, 14:00-22:00, 22:00-06:00)',
    housingType: 'free',
    housingPrice: 0,
    housingDescription: 'Zapewnione bezpłatne zakwaterowanie w pokojach 2-3 osobowych.',
    advances: 'weekly',
    advanceDescription: 'Cotygodniowe zaliczki na start.',
    couplesWelcome: true,
    languageRequired: 'podstawowy',
    languageDescription: 'Wymagany podstawowy język polski lub zrozumienie poleceń przełożonego.',
    translations: {
      pl: {
        jobTitle: 'Pracownik produkcji butli gazowych (Sosnowiec)',
        location: 'Sosnowiec (Śląsk)',
        salary: '25,00 zł / godz. netto',
        salarySub: '(dla studentów: 31,40 zł / godz. brutto). Możliwość zaliczek.',
        contract: 'Umowa zlecenie ze składkami ZUS. Pełne wsparcie dokumentacyjne, możliwość złożenia wniosku o kartę pobytu.',
        shifts: '8-12 godz. w systemie 3-zmianowym (6:00-14:00, 14:00-22:00, 22:00-06:00), dni powszednie (soboty w razie potrzeby).',
        housing: 'Zapewnione zakwaterowanie (pokoje 2-3 osobowe).',
        tasks: [
          'Wkładanie elementów do maszyny (proces gięcia)',
          'Układanie gotowych elementów na paletach',
          'Używanie prostych przyrządów pomiarowych',
          'Utrzymanie czystości miejsca pracy',
        ],
        perks: 'Darmowa odzież robocza, badania lekarskie na koszt pracodawcy, terminowe wypłaty na konto bankowe do 15. dnia miesiąca, pomoc w dokumentacji zezwolenia na pobyt czasowy.',
      },
      ua: {
        jobTitle: 'Працівник виробництва газових балонів (Сосновець)',
        location: 'Сосновець (Сілезія)',
        salary: '25,00 zł / год. нетто',
        salarySub: '(для студентів: 31,40 zł / год. брутто). Можливість авансів.',
        contract: 'Договір злеценя зі сплатою ZUS. Повний документальний супровід, подача на карту побиту.',
        shifts: '8-12 годин у 3-змінному графіку (6:00-14:00, 14:00-22:00, 22:00-06:00), будні (суботи за потреби).',
        housing: 'Надається безкоштовне проживання (кімнати на 2-3 особи).',
        tasks: [
          'Вкладання деталей у станок (процес гнуття)',
          'Складання готових деталей на піддони',
          'Використання простих вимірювальних приладів',
          'Підтримка чистоти на робочому місці',
        ],
        perks: 'Безкоштовний робочий одяг, медогляд коштом роботодавця, своєчасні виплати до 15 числа на карту, допомога з картою побиту.',
      },
      en: {
        jobTitle: 'Gas Cylinder Production Worker (Sosnowiec)',
        location: 'Sosnowiec (Silesia)',
        salary: '25.00 PLN / hr net',
        salarySub: '(for students: 31.40 PLN / hr gross). Weekly advance payments available.',
        contract: 'Mandate contract with ZUS contributions. Residence card application support.',
        shifts: '8-12 hours in a 3-shift system (6:00-14:00, 14:00-22:00, 22:00-06:00), weekdays (Saturdays as needed).',
        housing: 'Provided accommodation (rooms for 2-3 people).',
        tasks: [
          'Loading components into the machine (bending process)',
          'Stacking finished elements onto pallets',
          'Using basic measuring instruments',
          'Maintaining a clean workspace',
        ],
        perks: 'Free work clothing, medical examinations covered, on-time bank payments by the 15th, temporary residence permit assistance.',
      },
    },
  },
  {
    id: 'slodycze-swiebodzice',
    slug: 'pracownik-zakladu-produkcji-slodyczy-swiebodzice',
    status: 'active',
    datePosted: '2025-02-01',
    category: 'Produkcja',
    city: 'Świebodzice',
    voivodeship: 'Dolny Śląsk',
    locationSummary: 'Świebodzice (60 km od Wrocławia, Dolny Śląsk)',
    postalCode: '58-160',
    salaryHourlyNet: 25.0,
    salaryHourlyGrossStudent: 31.4,
    salaryMonthlyEstMin: 4200,
    salaryMonthlyEstMax: 5800,
    salaryDisplay: '25,00 zł / godz. netto',
    salarySubDisplay: '(dla studentów: 31,40 zł / godz. brutto). Zaliczka raz w miesiącu.',
    currency: 'PLN',
    contractType: 'Umowa zlecenie z pełnym ZUS',
    shiftsType: '12 godz. w systemie 1- lub 2-zmianowym (06:00–18:00, 18:00–06:00)',
    housingType: 'paid', // 550 zł / mies. potrącane z wypłaty
    housingPrice: 550,
    housingDescription: 'Zakwaterowanie w pobliżu zakładu (550 zł / mies., potrącane z wypłaty).',
    advances: 'monthly', // zaliczka raz w miesiącu
    advanceDescription: 'Możliwość zaliczki raz w miesiącu.',
    couplesWelcome: true,
    languageRequired: 'brak',
    languageDescription: 'Brak wymogu języka polskiego — koordynator na miejscu.',
    translations: {
      pl: {
        jobTitle: 'Pracownik zakładu produkcji słodyczy (Świebodzice)',
        location: 'Świebodzice (60 km od Wrocławia, Dolny Śląsk)',
        salary: '25,00 zł / godz. netto',
        salarySub: '(dla studentów: 31,40 zł / godz. brutto). Możliwość zaliczki raz w miesiącu.',
        contract: 'Umowa zlecenie ze składkami ZUS. Pełna legalność, pomoc w dokumentach i możliwość złożenia wniosku o kartę pobytu.',
        shifts: '12 godz. w systemie 1- lub 2-zmianowym (06:00–18:00, 18:00–06:00). Praca w weekendy za dopłatą — opcjonalnie.',
        housing: 'Zakwaterowanie w pobliżu zakładu (550 zł / mies., potrącane z wypłaty).',
        tasks: [
          'Praca przy linii produkcyjnej słodyczy',
          'Ręczne pakowanie i kontrola jakości gotowych wyrobów',
          'Utrzymanie czystości na stanowisku pracy',
        ],
        perks: 'Bezpłatna odzież robocza, terminowe wypłaty do 15. dnia miesiąca, pełne wsparcie w dokumentach legalizacyjnych, możliwość wnioskowania o kartę pobytu.',
      },
      ua: {
        jobTitle: 'Працівник на виробництві солодощів (Свебодзіце)',
        location: 'Свебодзіце (60 км від Вроцлава, Нижня Сілезія)',
        salary: '25,00 zł / год. нетто',
        salarySub: '(для студентів: 31,40 zł / год. брутто). Можливість авансу один раз на місяць.',
        contract: 'Договір злеценя зі сплатою ZUS. Легальність, допомога з документами та подача на карту побиту.',
        shifts: '12 годин у 1- або 2-змінному графіку (06:00–18:00, 18:00–06:00). Вихідні за доплату — опціонально.',
        housing: 'Житло неподалік підприємства (550 zł / міс., утримується із зарплати).',
        tasks: [
          'Робота на виробничій лінії солодощів',
          'Ручне пакування та контроль якості готових виробів',
          'Підтримка чистоти на робочому місці',
        ],
        perks: 'Безкоштовний робочий одяг, своєчасні виплати до 15 числа, повна підтримка з легалізацією, можливість отримання карти побиту.',
      },
      en: {
        jobTitle: 'Confectionery Production Worker (Świebodzice)',
        location: 'Świebodzice (60 km from Wrocław, Lower Silesia)',
        salary: '25.00 PLN / hr net',
        salarySub: '(for students: 31.40 PLN / hr gross). Monthly advance payment available.',
        contract: 'Mandate contract with ZUS contributions. Residence card application support.',
        shifts: '12 hours in a 1- or 2-shift system (06:00–18:00, 18:00–06:00). Weekend shifts optional with extra pay.',
        housing: 'Accommodation near the plant (550 PLN / month, deducted from salary).',
        tasks: [
          'Work on confectionery production lines',
          'Manual packaging and quality inspection of finished sweets',
          'Workstation cleanliness maintenance',
        ],
        perks: 'Free workwear, timely salary payments by the 15th, full legalization support, temporary residence permit assistance.',
      },
    },
  },
];

/**
 * Format a raw vacancy item into a language-specific object with all top-level properties
 */
function formatVacancyForLang(item, lang = 'pl') {
  const trans = item.translations[lang] || item.translations.pl;
  return {
    ...item,
    jobTitle: trans.jobTitle,
    location: trans.location,
    salary: trans.salary,
    salarySub: trans.salarySub,
    contract: trans.contract,
    shifts: trans.shifts,
    housing: trans.housing,
    tasks: trans.tasks,
    perks: trans.perks,
  };
}

/**
 * Repository interface: get all vacancies for a given language
 * @param {string} lang - 'pl' | 'ua' | 'en'
 * @param {object} options - { activeOnly: boolean }
 */
export function getVacancies(lang = 'pl', options = { activeOnly: true }) {
  const list = options.activeOnly
    ? RAW_VACANCIES.filter((v) => v.status === 'active')
    : RAW_VACANCIES;
  return list.map((item) => formatVacancyForLang(item, lang));
}

/**
 * Repository interface: find a single vacancy by stable URL slug
 * @param {string} slug
 * @param {string} lang
 */
export function getVacancyBySlug(slug, lang = 'pl') {
  if (!slug) return null;
  const normalized = slug.trim().toLowerCase();
  const found = RAW_VACANCIES.find((v) => v.slug.toLowerCase() === normalized);
  if (!found) return null;
  return formatVacancyForLang(found, lang);
}

/**
 * Repository interface: find a single vacancy by internal ID
 * @param {string} id
 * @param {string} lang
 */
export function getVacancyById(id, lang = 'pl') {
  if (!id) return null;
  const found = RAW_VACANCIES.find((v) => v.id === id);
  if (!found) return null;
  return formatVacancyForLang(found, lang);
}

/**
 * Get all stable slugs for sitemaps / routing
 */
export function getAllVacancySlugs() {
  return RAW_VACANCIES.map((v) => ({
    slug: v.slug,
    status: v.status,
  }));
}

/**
 * Future API / Supabase integration layer.
 * Currently falls back directly to the local verified repository.
 * Note: External Supabase 'jobs' table requires database schema and service role configuration.
 */
export async function fetchVacanciesFromApi(lang = 'pl') {
  // In production, when Supabase jobs table is deployed:
  // const { data, error } = await supabase.from('jobs').select('*').eq('status', 'active');
  // if (!error && data && data.length > 0) return data;
  return getVacancies(lang);
}
