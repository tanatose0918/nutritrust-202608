# NutriTrust Frontend (Next.js) - Journey Implementation Tasks (v1.0)
**Project Stage:** Incubation Pivot (Post IP Management Workshop)
**Stack:** Next.js 15+ (App Router), TypeScript (Strict), Tailwind CSS

---

## 🗺️ Journey Alignment Context
To transition NutriTrust from a simple directory into a defensive, high-utility **Trust Layer**, the frontend must implement a **3-Tier Progressive Disclosure** layout. This ensures everyday users get instant value, while advanced health-hackers and business clients can unlock deep analytics without cluttering the UI. Additionally, we must enforce **strict copyright and liability protection** (relying on text-only/self-drawn assets and bulletproof disclaimers) to avoid lawsuit risks discussed during our IP Management workshop.

---

## 🎨 Epic 1: Dynamic 3-Tier Progressive Disclosure UI
**Goal:** Restructure the Product Detail Page (`app/products/[slug]/page.tsx` & `ProductDetailView.tsx`) to show tiered information according to user persona and needs, ensuring we don't overwhelm ordinary users while satisfying analytical buyers.

### 📋 Tasks:
- [x] **Task 1.1: Develop Normal Tier Component (Everyday Consumer)**
  - **Description:** Implement the default, non-scary view at the top of the product page (Above the Fold).
  - **Technical Requirements:**
    - Render a prominent **NutriTrust Score badge** (e.g., 4.5/5) with a soft green radial glow (`bg-emerald-500/30 blur-2xl`).
    - Build a **Quick Summary Card** showing "เหมาะสำหรับ" (Who is this for), "จุดเด่น" (Pros), and "ข้อควรพิจารณา" (Neutral considerations - avoiding the word "ข้อเสีย" to maintain academic neutrality).
    - Render a clean **Merchant Price Table** displaying the lowest found price, unit price (Price per tablet/serving), and active outbound affiliate links utilizing Lucide's `ExternalLink` icon.
- [x] **Task 1.2: Develop Health Tier Component (The Deep Science & Safety Hub)**
  - **Description:** Create an interactive, expandable tab/accordion interface below the fold for health-conscious users and caregivers.
  - **Technical Requirements:**
    - Render the **Ingredients & Upstream Traceability Table** showcasing active ingredient volume per serving (not per tablet) and the name of verified upstream raw material providers (e.g. DSM Nutritional Products).
    - Render the **3-Tier Scientific Evidence Matrix** (`EvidenceMatrix.tsx`) using the strict green badge hierarchy matching PubMed confidence levels:
      - 🟢 High Level: `bg-emerald-800 text-emerald-50 border-emerald-700`
      - 🟢 Moderate Level: `bg-emerald-600 text-white border-emerald-500`
      - 🟢 Low Level: `bg-emerald-100 text-emerald-950 border-emerald-300`
    - Add an **Elderly & Active Fitness Drug Interaction Alert** banner. If the user's profile lists common prescription medications (e.g., blood thinners), render warning alerts highlighting potential negative interactions with supplement ingredients (e.g., Fish Oil/Omega-3).
- [x] **Task 1.3: Develop Business Tier Component (B2B Marketplace & OEM Insights)**
  - **Description:** Build a gated subscription modal/dashboard that renders market analytics for supplement brands and OEM manufacturers.
  - **Technical Requirements:**
    - Render a multi-axis **Spider Chart** (`SpiderChart.tsx`) displaying market metrics: authenticity score, repurchasing rate, price value index, search volume trend, and merchant reliability.
    - Implement a clean **Market Trend Line Chart** (`MarketTrendChart.tsx`) showing historical price fluctuations over 30/90 days to visualize retail price volatility.

---

## 🔍 Epic 2: Intelligent Search & Personalization UI
**Goal:** Build a highly responsive, conversational search interface inspired by Leonardo.ai that pre-filters suggestions based on user demographic data without sacrificing privacy.

### 📋 Tasks:
- [x] **Task 2.1: Develop Leonardo-Style Typeahead Search Bar**
  - **Description:** Upgrade the Hero Search bar (`components/features/home/HeroSection.tsx`) to act as an instant Suggestion Box.
  - **Technical Requirements:**
    - As the user types, fire debounced queries to Fastify's `/api/search?q={query}`.
    - Group suggestions on the fly into categorised dropdown rows: "Products", "Brands", and "Active Ingredients".
    - Apply glassmorphism styling (`backdrop-blur-md bg-white/85 border border-slate-200/70 shadow-2xl`) to the dropdown panel.
- [x] **Task 2.2: Implement Localized Metadata Bias**
  - **Description:** Allow anonymized user characteristics (age, gender, health goals) to silently bias search suggestions.
  - **Technical Requirements:**
    - Check for existing health profile keys in `sessionStorage` (saved from the anonymous survey).
    - If a user is registered as a "Caregiver" or "Active Fitness/Aerobics" persona, append corresponding bias tags to the search request parameters (e.g., boosting joint protection or energy metabolism items in the results).

---

## 🛡️ Epic 3: IP Protection & Legal Compliance Safeguards
**Goal:** Implement strict technical measures on the frontend to mitigate copyright infringement liability (brand imagery) and medical malpractice claims.

### 📋 Tasks:
- [x] **Task 3.1: Enforce Text-Only Brand Representation**
  - **Description:** Remove any scraped brand logos or trademarked horizontal banners to avoid image copyright issues identified in the IP Management class.
  - **Technical Requirements:**
    - If a product does not have a self-taken, original photo, replace the brand's logo with a highly stylized, text-only typographic wordmark (SVG/CSS styled with custom Tailwind gradients) that represents the brand neutrally.
    - Set up a fallback placeholder card displaying our custom, verified circular sticker logo (`nutritrust_icon.jpg` style) to represent the NutriTrust validation layer.
- [x] **Task 3.2: Implement Strict Medical Disclaimers & Consent Checkboxes**
  - **Description:** Guard against legal liability by ensuring the user explicitly acknowledges that NutriTrust is not a medical diagnostic service.
  - **Technical Requirements:**
    - Place a non-obtrusive, sticky **Medical Disclaimer Banner** at the bottom of the Product Detail and Product Comparison pages.
    - In the Anonymous Survey registration flow (`app/survey/page.tsx`), mandate a checkbox verification step: *"I understand that NutriTrust compiles public research for educational purposes and does not replace medical advice from doctors or pharmacists."*
