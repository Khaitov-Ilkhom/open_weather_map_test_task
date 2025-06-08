# Interactive Weather Dashboard Widget

Bu frontend dasturchilari uchun texnik imtihon doirasida yaratilgan interaktiv ob-havo vidjeti. U React, Vite, Context API va `useReducer` hookidan foydalangan holda qurilgan.

## Asosiy Xususiyatlar

-   Bir necha shahar uchun ob-havo ma'lumotlarini ko'rsatish.
-   Hozirgi ob-havo, 5 kunlik prognoz va harorat statistikasi (SVG grafik).
-   Qidiruv funksiyasiga ega shaharlarni tanlash menyusi.
-   API so'rovlari uchun Mock-server va real OpenWeatherMap API integratsiyasi.
-   Qorong'u va yorug' rejim (Dark/Light mode).
-   Harorat birliklarini o'zgartirish (Celsius/Fahrenheit).
-   API so'rovlari uchun `throttle` va qidiruv uchun `debounce` funksiyalari.
-   Komponent darajasidagi xatoliklarni ushlash uchun `ErrorBoundary`.
-   Vitest va React Testing Library yordamida yozilgan testlar.

## Loyihani Ishga Tushurish

1.  **Omborni klonlash (nusxalash):**
    ```bash
    git clone <repository_url>
    cd open_weather_map_test_task
    ```

2.  **Bog'liqliklarni o'rnatish:**
    ```bash
    npm install
    ```

3.  **API Kalitini Sozlash:**
    Loyiha papkasida `.env` nomli fayl yarating. Keyin [OpenWeatherMap](https://openweathermap.org/api) saytidan bepul API kalitini oling va faylga quyidagicha qo'shing:
    ```
    VITE_OWM_API_KEY=SIZNING_API_KALITINGIZ
    ```

4.  **Ishga tushurish (Development rejimida):**
    ```bash
    npm run dev
    ```
    Ilova `http://localhost:5173` manzilida ochiladi.

## Loyiha Arxitekturasi

Loyiha quyidagi asosiy komponentlar va mantiqiy qismlardan iborat:

-   `WeatherWidget`: Asosiy konteyner komponenti. Barcha boshqa qismlarni o'z ichiga oladi va umumiy holatni boshqaradi.
-   `CitySelector`: Foydalanuvchiga shaharni tanlash yoki qidirish imkonini beradi.
-   `WeatherDisplay`: Tanlangan shahar uchun joriy ob-havo ma'lumotlarini ko'rsatadi.
-   `ForecastList`: 5 kunlik prognozni kartochkalar ko'rinishida namoyish etadi.
-   `DataVisualization`: Harorat o'zgarishini ko'rsatuvchi SVG grafikni (kutubxonalarsiz) chizadi.
-   `SettingsPanel`: Mavzu (theme) va harorat birliklarini (units) o'zgartirish uchun panel.
-   `ErrorBoundary`: Ilovadagi render xatolarini ushlaydi va foydalanuvchiga xato xabarini ko'rsatadi.

### Ma'lumotlar Oqimi (Data Flow)

1.  `WeatherWidget` komponenti `useWeatherData` custom hook'ini chaqiradi.
2.  `useWeatherData` `weatherReducer` yordamida holatni (state) boshqaradi.
3.  Foydalanuvchi shaharni o'zgartirganda (`CitySelector`), `changeCity` funksiyasi chaqiriladi.
4.  Bu `weatherReducer`ga `CHANGE_CITY` action'ini yuboradi va state'dagi `city` o'zgaradi.
5.  `useWeatherData`dagi `useEffect` state'dagi `city` o'zgarishini kuzatib, `fetchData` funksiyasini chaqiradi.
6.  `fetchData` (throttled) API'dan ma'lumotlarni olib keladi (`mock` yoki `real`).
7.  Muvaffaqiyatli javobdan so'ng, ma'lumotlar `transformWeatherData` yordamida qayta ishlanadi va `FETCH_SUCCESS` action'i bilan state'ga saqlanadi.
8.  State yangilangach, komponentlar yangi ma'lumotlar bilan qayta render bo'ladi.

### Custom Hooks

-   `useWeatherData`: Barcha API so'rovlari, ma'lumotlarni transformatsiya qilish va state boshqaruvi uchun mas'ul markaziy hook.
-   `useDebounce`: Qidiruv maydoniga yozishdagi ortiqcha so'rovlarni oldini olish uchun ishlatiladi.

### Ishlash Samaradorligini Optimizatsiya Qilish (Performance Optimization)

-   **Throttling:** API so'rovlari 5 sekundda bir martadan ko'p yuborilmasligini ta'minlash uchun `throttle` funksiyasi qo'llanilgan.
-   **Debouncing:** Shahar qidiruvida foydalanuvchi yozishni to'xtatgandan keyingina (300ms) qidiruv ishga tushadi.
-   **Memoization:** `useMemo` va `useCallback` hook'lari keraksiz qayta hisoblashlar va renderlarning oldini olish uchun ishlatilgan (masalan, `CitySelector`da filtrlangan shaharlar ro'yxati).
-   **CSS Transitions:** Shaharlar o'rtasida almashinishda silliq `fade-in/fade-out` animatsiyasi uchun CSS `transition`lardan foydalanilgan.
