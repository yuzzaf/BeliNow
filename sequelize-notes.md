# 📦 Setup Project Express + Sequelize

## 1️⃣ Inisialisasi Project

``` bash
npm init -y
npm install pg express ejs sequelize
npm install -D sequelize-cli
touch .gitignore
```

------------------------------------------------------------------------

## 2️⃣ Setup Sequelize

### Inisialisasi Konfigurasi Sequelize

``` bash
npx sequelize init
```

### Buat Database

``` bash
npx sequelize db:create
```

------------------------------------------------------------------------

## 3️⃣ Membuat Model + Migration

### Format Command

``` bash
npx sequelize model:create --name <NamaModel> --attributes <field:type>
```

> ⚠️ Nama model harus singular (karena ini class).

### Contoh

``` bash
npx sequelize model:create --name Student --attributes name:string,gender:string,dateOfBirth:date,phase:integer
```

------------------------------------------------------------------------

## 4️⃣ Menjalankan Migration

### Jalankan migration yang belum dijalankan

``` bash
npx sequelize db:migrate
```

### Undo semua migration

``` bash
npx sequelize db:migrate:undo:all
```

------------------------------------------------------------------------

## 5️⃣ Custom Migration

### Membuat File Migration Baru

``` bash
npx sequelize migration:create --name <nama-file>
```

### Contoh

``` bash
npx sequelize migration:create --name add_isActive-to-Students
```

> ⚠️ Setelah membuat custom migration, pastikan model juga ikut di-edit
> (rename / tambah field).

------------------------------------------------------------------------

## 6️⃣ Seeding

### Membuat File Seeder

``` bash
npx sequelize seed:create --name <nama-file>
```

### Contoh

``` bash
npx sequelize seed:create --name seed-Students
```

------------------------------------------------------------------------

### Menjalankan Seeder

#### Jalankan 1 file saja

``` bash
npx sequelize db:seed --seed 20260219030817-seed-Students
```

#### Jalankan semua seeder

``` bash
npx sequelize db:seed:all
```

------------------------------------------------------------------------

## 7️⃣ Reset Database (Full Reset)

``` bash
npx sequelize db:migrate:undo:all
npx sequelize db:migrate
npx sequelize db:seed:all
```
