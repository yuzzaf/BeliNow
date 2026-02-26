# BeliNow

E-commerce mini app berbasis **Node.js + Express + EJS + Sequelize (PostgreSQL)**.

## Fitur Utama

- Authentication: register, login, logout (session-based)
- Role-based access:
  - `admin`: kelola product & category
  - `buyer`: belanja, cart, checkout, history
- Product:
  - list, detail, search, filter category
  - CRUD (admin)
- Cart & Order:
  - add to cart, update qty, remove item
  - checkout via Stripe
  - history order paid
- Profile:
  - lihat & edit profile
- Helper format Rupiah + model validations + hooks bcrypt

## Tech Stack

- Node.js, Express
- EJS + express-ejs-layouts
- Sequelize + PostgreSQL (`pg`)
- express-session
- bcrypt
- Stripe Checkout

## Struktur Singkat

- `app.js` - app bootstrap, session, locals, middleware global
- `controllers/controller.js` - business logic utama
- `routes/` - routing per domain
- `models/` - Sequelize models + associations
- `migrations/`, `seeders/`
- `views/` - EJS pages + partials
- `helpers/formatRupiah.js`

## Prasyarat

- Node.js 18+ (disarankan)
- PostgreSQL aktif

## Setup Lokal

1. Install dependency

```bash
npm install
```

2. Buat file `.env` (contoh)

```env
SESSION_SECRET=your_session_secret
BASE_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

3. Konfigurasi DB di `config/config.json` (environment `development`)

4. Jalankan migration + seeder

```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

5. Jalankan app

```bash
npm run dev
```

App berjalan di `http://localhost:3000`

## Akun & Role

- Buyer:
  - akses product, cart, checkout, history, profile
- Admin:
  - akses kelola product & category
  - tidak menampilkan cart icon di navbar

> Role diset dari data user saat register/login.

## Stripe Testing

Mode test card:

- Card: `4242 4242 4242 4242`
- Exp: bebas masa depan (contoh `12/34`)
- CVC: `123`

## Routing Utama

- Auth:
  - `GET /login`, `POST /login`
  - `GET /register`, `POST /register`
  - `GET /logout`
- Products:
  - `GET /products`, `GET /products/:id`
  - Admin only: add/edit/delete
- Orders:
  - `GET /orders`
  - `POST /orders/create/:productId`
  - `POST /orders/:id/checkout`
  - `GET /orders/checkout/success`, `GET /orders/checkout/cancel`
  - `GET /orders/history`
- Profiles:
  - `GET /profiles/:username`
  - `GET/POST /profiles/:username/edit`
