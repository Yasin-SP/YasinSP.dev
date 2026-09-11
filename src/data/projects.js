import NomaPoster from "../assets/projects/Noma-poster.webp";
import NomaHome from "../assets/projects/Noma-home.webp";
import NomaMenu from "../assets/projects/Noma-menu.webp";
import NomaMobile from "../assets/projects/Noma-mobile.webp";
import NabzCrypto1 from "../assets/projects/nabzCrypto1.webp";
import NabzCrypto2 from "../assets/projects/nabzCrypto2.webp";
import NabzCrypto3 from "../assets/projects/nabzCrypto3.webp";
import NabzCrypto4 from "../assets/projects/nabzCrypto4.webp";
import MemoryCard1 from "../assets/projects/MemoryCard-poster.webp";
import MemoryCard2 from "../assets/projects/MemoryCard1.webp";
import MemoryCard3 from "../assets/projects/MemoryCard2.webp";
import OstadSanj1 from "../assets/projects/Ostadsanj1.webp";
import OstadSanj2 from "../assets/projects/Ostadsanj2.webp";
import OstadSanj3 from "../assets/projects/Ostadsanj3.webp";

// These entries are transparent concept studies, not commissioned client work.
// Add external links only when a real repository or published case study exists.
export const projects = [
  {
    id: "noma-restaurant",
    title: "NOMA",
    category: "Restaurant Website",
    year: "2026",
    description:
      "A Persian RTL restaurant website with a rich responsive interface, dynamic menu pricing, interactive food cards, and a polished mobile-first experience.",
    fullDescription:
      "NOMA is a Persian RTL restaurant website built with React, TypeScript, and Vite. The project combines a visual food-focused landing page with a structured menu experience, animated item details, responsive layouts, discount sections, guest comments, FAQ content, and location information. Menu prices can adapt to the current USD/Toman rate using a live data source with rounding and fallback logic, while the map layer is prepared for Neshan with a Google Maps fallback.",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "React Router",
      "Neshan Web SDK",
    ],
    features: [
      "Fully Persian RTL restaurant experience",
      "Responsive desktop and mobile layouts",
      "Structured multi-category food menu",
      "Animated food cards and item detail modal",
      "Dynamic USD/Toman-based menu pricing",
      "Rounded price calculation with cached fallback rate",
      "Discount and bestseller sections",
      "Guest comments and FAQ sections",
      "Neshan map integration with Google Maps fallback",
      "Production deployment on Vercel",
    ],
    challenges:
      "The main challenge was balancing a highly visual restaurant interface with a large amount of menu content while keeping the experience fast, readable, and consistent across desktop and mobile. The project also required reliable dynamic pricing based on an external exchange-rate source, graceful fallbacks for pricing and maps, and careful RTL layout work across interactive cards, modals, navigation, and long menu sections.",
    github: "https://github.com/Yasin-SP/Noma",
    demo: "https://noma-iota-flame.vercel.app/",
    images: [NomaPoster, NomaHome, NomaMenu, NomaMobile],

    fa: {
      title: "نوما",
      category: "وب‌سایت رستوران",
      description:
        "یک وب‌سایت فارسی و راست‌چین برای رستوران با رابطی ریسپانسیو، منوی پویا، کارت‌های تعاملی غذا و تجربه‌ای کامل در موبایل و دسکتاپ.",
      fullDescription:
        "نوما یک وب‌سایت فارسی و راست‌چین برای رستوران است که با React، TypeScript و Vite ساخته شده. پروژه یک لندینگ بصری و غذا‌محور را با منوی دسته‌بندی‌شده، جزئیات متحرک آیتم‌ها، طراحی ریسپانسیو، بخش تخفیف‌ها، نظرات مهمان‌ها، سوالات متداول و اطلاعات موقعیت ترکیب می‌کند. قیمت آیتم‌های منو می‌تواند با نرخ روز دلار به تومان به‌صورت پویا تغییر کند و با منطق رند کردن و نرخ جایگزین، حتی در صورت قطع منبع قیمت نیز پایدار بماند. بخش نقشه نیز برای نشان آماده شده و در نبود کلید API به Google Maps برمی‌گردد.",
      features: [
        "رابط کاربری کاملاً فارسی و راست‌چین",
        "طراحی ریسپانسیو برای دسکتاپ و موبایل",
        "منوی ساختاریافته با چند دسته غذایی",
        "کارت‌های متحرک غذا و مودال جزئیات آیتم",
        "قیمت‌گذاری پویا بر اساس نرخ دلار به تومان",
        "رند کردن قیمت‌ها و استفاده از نرخ کش‌شده در حالت جایگزین",
        "بخش تخفیف‌ها و آیتم‌های محبوب",
        "بخش نظرات مهمان‌ها و سوالات متداول",
        "آماده برای نقشه نشان با fallback گوگل مپ",
        "استقرار نسخه Production روی Vercel",
      ],
      challenges:
        "چالش اصلی پروژه ایجاد تعادل بین یک رابط بسیار بصری و حجم زیاد محتوای منو بود؛ بدون اینکه تجربه در موبایل و دسکتاپ شلوغ یا کند شود. پیاده‌سازی قیمت‌گذاری پویا با منبع خارجی نرخ ارز، طراحی fallback برای قیمت و نقشه، و حفظ یکپارچگی کامل RTL در کارت‌ها، مودال‌ها، ناوبری و سکشن‌های طولانی منو نیز از بخش‌های مهم فنی پروژه بودند.",
    },
  },
  {
    id: "nabz-crypto",
    title: "Nabz Crypto",
    category: "Crypto Dashboard",
    year: "2026",
    description:
      "A Persian RTL cryptocurrency dashboard for exploring market prices, trends, and detailed coin data through a responsive interface.",
    fullDescription:
      "Nabz Crypto is a Persian RTL cryptocurrency dashboard built with React and Vite. The application uses CoinGecko data to provide real-time market information, searchable assets, filtering and sorting, personalized watchlists, interactive price charts, and detailed market statistics. The project also includes a server-side API proxy prepared for deployment on Vercel.",
    stack: [
      "React",
      "Vite",
      "React Router",
      "Recharts",
      "CoinGecko API",
      "Vercel Serverless Functions",
    ],
    features: [
      "Real-time cryptocurrency market data",
      "Persian and English cryptocurrency search",
      "Market filtering and sorting",
      "Persistent watchlist with LocalStorage",
      "Interactive price charts",
      "Multiple chart time ranges",
      "Detailed market statistics and trading volume",
      "Fully Persian RTL interface",
      "Responsive light-mode design",
      "Server-side API proxy for Vercel deployment",
    ],
    challenges:
      "The main challenge was building a complete Persian RTL financial dashboard while keeping the interface clear and responsive. The project also required handling external market data, search normalization for Persian cryptocurrency names, interactive charts, persistent watchlists, and a server-side proxy to safely manage API requests and avoid CORS issues.",
    github: "https://github.com/Yasin-SP/nabz-crypto",
    demo: "https://nabz-crypto.vercel.app/",
    images: [NabzCrypto1, NabzCrypto2, NabzCrypto3, NabzCrypto4],

    fa: {
      title: "نبض کریپتو",
      category: "داشبورد ارز دیجیتال",
      description:
        "یک داشبورد فارسی و راست‌چین برای بررسی قیمت، وضعیت بازار و اطلاعات دقیق ارزهای دیجیتال با رابطی ریسپانسیو و کاربردی.",
      fullDescription:
        "نبض کریپتو یک داشبورد فارسی و راست‌چین برای بررسی بازار ارزهای دیجیتال است که با React و Vite ساخته شده است. این پروژه با استفاده از داده‌های CoinGecko امکان مشاهده قیمت‌ها، جستجو و فیلتر ارزها، ساخت واچ‌لیست شخصی، مشاهده نمودارهای تعاملی و بررسی اطلاعات مختلف بازار را فراهم می‌کند. پروژه همچنین دارای API Proxy سمت سرور است و برای استقرار روی Vercel آماده شده است.",
      features: [
        "نمایش اطلاعات و قیمت ارزهای دیجیتال",
        "جستجوی ارزها با نام فارسی، انگلیسی و نماد",
        "فیلتر و مرتب‌سازی بازار",
        "واچ‌لیست و علاقه‌مندی‌های ذخیره‌شده با LocalStorage",
        "نمودار تعاملی قیمت ارزها",
        "بازه‌های زمانی مختلف برای نمودار",
        "نمایش حجم معاملات، ارزش بازار و اطلاعات عرضه",
        "رابط کاربری کاملاً فارسی و راست‌چین",
        "طراحی ریسپانسیو برای موبایل و دسکتاپ",
        "API Proxy سمت سرور برای deployment روی Vercel",
      ],
      challenges:
        "چالش اصلی پروژه طراحی یک داشبورد مالی کامل با رابط فارسی و راست‌چین بود؛ به شکلی که اطلاعات زیاد همچنان خوانا و قابل استفاده باقی بماند. مدیریت داده‌های بازار، جستجوی هوشمند نام‌های فارسی ارزها، نمودارهای تعاملی، واچ‌لیست و پیاده‌سازی API Proxy سمت سرور نیز بخش مهمی از چالش‌های فنی پروژه بودند.",
    },
  },
  {
    id: "memory-quest",
    title: "Memory Quest",
    category: "Mini Game",
    year: "2025",
    description:
      "A fast-paced memory matching game focused on responsive interaction, score progression, and a playful game experience.",
    fullDescription:
      "Memory Quest is a responsive memory card game built with React and Vite. Players can choose between four difficulty levels, match cards, build combo streaks, and compete against their best scores. The project focuses on creating a polished game experience with real-time statistics, lightweight sound effects, accessibility, and responsive layouts across desktop and mobile devices.",
    stack: ["React", "Vite", "JavaScript", "CSS", "Web Audio API"],
    features: [
      "4 difficulty levels from Easy to Expert",
      "Combo-based scoring and streak multiplier",
      "Real-time timer, moves, mistakes, and score tracking",
      "Best score persistence with LocalStorage",
      "Lightweight sound effects using Web Audio API",
      "Responsive layouts for desktop and mobile",
      "Keyboard navigation and accessible interactive elements",
    ],
    challenges:
      "This was one of my first projects after learning React. The main challenge was balancing game logic, responsive layouts, and visual feedback while keeping interactions fast and intuitive. The project also required handling card matching, combo scoring, game states, persistent scores, and mobile-specific layouts without making the interface feel cluttered.",
    github: "https://github.com/Yasin-SP/Memory-Game",
    demo: "https://memory-game-zeta-beryl.vercel.app/",
    images: [MemoryCard1, MemoryCard2, MemoryCard3],
    fa: {
      title: "بازی حافظه Memory Quest",
      category: "مینی گیم",
      description:
        "یک بازی سریع و تعاملی برای تقویت حافظه با تمرکز بر تجربه کاربری، امتیازدهی و عملکرد روان در موبایل و دسکتاپ.",
      fullDescription:
        "Memory Quest یک بازی تطبیق کارت است که با React و Vite ساخته شده است. بازیکن می‌تواند از بین چهار سطح دشواری انتخاب کند، کارت‌ها را پیدا کند، با ایجاد زنجیره‌های متوالی امتیاز بیشتری بگیرد و رکورد خود را بهبود دهد. تمرکز اصلی پروژه روی ایجاد یک تجربه بازی روان و جذاب، همراه با آمار لحظه‌ای، صداهای سبک، دسترس‌پذیری و طراحی ریسپانسیو برای موبایل و دسکتاپ بوده است.",
      features: [
        "۴ سطح دشواری از Easy تا Expert",
        "سیستم امتیازدهی مبتنی بر Combo و Streak",
        "نمایش لحظه‌ای زمان، تعداد حرکت، اشتباهات و امتیاز",
        "ذخیره رکورد بهترین امتیاز با LocalStorage",
        "افکت‌های صوتی سبک با Web Audio API",
        "طراحی کاملاً ریسپانسیو برای موبایل و دسکتاپ",
        "پشتیبانی از کیبورد و المان‌های تعاملی دسترس‌پذیر",
      ],
      challenges:
        "این پروژه جزو اولین پروژه های من بعد از یادگیری ریکت بود .چالش اصلی پروژه ایجاد تعادل بین منطق بازی، طراحی ریسپانسیو و بازخوردهای بصری بود؛ به‌خصوص در مدیریت وضعیت کارت‌ها، سیستم امتیازدهی و Combo، ذخیره رکوردها و طراحی رابط مناسب برای صفحه‌های کوچک.",
    },
  },
  {
    id: "ostad-sanaj",
    title: "Ostad Sanaj",
    category: "Student Team Project",
    year: "2023",
    description:
      "A student team project developed as an early real-world web development experience, focused on building a practical platform with a collaborative development workflow.",
    fullDescription:
      "Ostad Sanaj was my first team-based web development project, created as part of a student team. The project gave me practical experience working within a development team, contributing to a shared codebase, and turning a real project idea into a functional web platform. The project was developed collaboratively, and the entire implementation should not be attributed solely to me.",
    stack: ["JavaScript", "HTML", "CSS", "jQuery"],
    features: [
      "Collaborative student development",
      "Real-world project workflow",
      "Responsive web interface",
      "Structured and reusable UI sections",
      "Team-based development and code integration",
    ],
    challenges:
      "As my first team-based project, one of the main challenges was learning how to work effectively within a shared development process while contributing to an existing codebase. The project helped me gain practical experience with collaboration, coordinating changes, and translating requirements into a working web interface.",
    github: null,
    demo: "https://www.ostadsanaj.ir/",
    images: [OstadSanj1, OstadSanj2, OstadSanj3],

    fa: {
      title: "استادسنج",
      category: "پروژه دانشجویی تیمی",
      description:
        "اولین تجربه من در توسعه یک پروژه وب تیمی که در قالب یک تیم دانشجویی و با هدف ساخت یک پلتفرم کاربردی انجام شد.",
      fullDescription:
        "استادسنج اولین تجربه من در توسعه یک پروژه وب به‌صورت تیمی بود که در قالب یک تیم دانشجویی روی آن کار کردیم. این پروژه فرصت خوبی برای تجربه کار روی یک کدبیس مشترک، هماهنگی با اعضای تیم و تبدیل یک ایده واقعی به یک پلتفرم قابل استفاده بود. توسعه این پروژه به‌صورت تیمی انجام شده و پیاده‌سازی کامل آن متعلق به من نیست.",
      features: [
        "توسعه به‌صورت تیم دانشجویی",
        "تجربه کار روی یک پروژه واقعی",
        "طراحی رابط کاربری ریسپانسیو",
        "ساختاردهی و استفاده مجدد از بخش‌های رابط کاربری",
        "تجربه همکاری و هماهنگی در توسعه پروژه",
      ],
      challenges:
        "به‌عنوان اولین تجربه من در یک پروژه تیمی، یکی از چالش‌های اصلی یادگیری نحوه کار مؤثر روی یک پروژه مشترک و هماهنگی تغییرات با سایر اعضای تیم بود. این پروژه تجربه عملی ارزشمندی در زمینه همکاری تیمی، کار با کدبیس مشترک و تبدیل نیازمندی‌ها به یک محصول وب قابل استفاده برای من ایجاد کرد.",
    },
  },
];
