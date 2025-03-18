# Sistem API Sederhana

## Deskripsi Proyek
Proyek ini merupakan API sederhana yang dibuat menggunakan Express.js untuk mengelola data anime. API ini memungkinkan pengguna untuk melihat daftar anime, mendapatkan detail anime tertentu, serta menambahkan anime baru ke dalam database JSON. Selain backend, proyek ini juga memiliki frontend sederhana untuk menampilkan dan mengelola data anime.

## Struktur Proyek

### Backend (server)
```
server/
├── data/
│   └── anime.json       # File JSON database
├── routes/
│   └── animeRoutes.js   # File routing untuk API anime
├── app.js               # File entry point aplikasi
└── package.json         # File konfigurasi package
```

### Frontend (client)
```
client/
├── index.html           # Halaman utama frontend
├── script.js            # File JavaScript untuk interaksi dengan API
└── styles.css           # File CSS untuk tampilan
```

## Fitur API

### 1. Mendapatkan Semua Anime (GET /anime)
Mengembalikan daftar semua anime yang tersedia di database.

#### Contoh Respons:
```json
{
    "data": [
        {
            "id": 1,
            "title": "Naruto",
            "genre": "Action",
            "rating": 8.5
        },
        {
            "id": 2,
            "title": "One Piece",
            "genre": "Adventure",
            "rating": 9.0
        }
    ]
}
```

### 2. Mendapatkan Satu Anime Berdasarkan ID (GET /anime/:id)
Mengembalikan detail anime berdasarkan ID yang diberikan.

#### Contoh Respons:
```json
{
    "id": 1,
    "title": "Naruto",
    "genre": "Action",
    "rating": 8.5
}
```

### 3. Menambahkan Anime Baru (POST /anime)
Menambahkan anime baru ke database dengan data dalam format JSON.

#### Contoh Permintaan:
```json
{
    "title": "Attack on Titan",
    "genre": "Fantasy",
    "rating": 9.2
}
```

#### Contoh Respons:
```json
{
    "message": "Anime berhasil ditambahkan",
    "data": {
        "id": 3,
        "title": "Attack on Titan",
        "genre": "Fantasy",
        "rating": 9.2
    }
}
```

## Nilai Tambahan
Selain fitur wajib, API ini juga memiliki fitur tambahan seperti:
- Mengupdate data anime (PUT /anime/:id)
- Menghapus anime dari database (DELETE /anime/:id)

## Cara Menjalankan Backend
1. Pastikan Node.js telah terinstal di sistem.
2. Masuk ke direktori `server` dan jalankan perintah berikut untuk menginstal dependensi:
   ```bash
   npm install
   ```
3. Jalankan server dengan perintah:
   ```bash
   node app.js
   ```
4. API akan berjalan di `http://localhost:3000`.

## Cara Menjalankan Frontend
1. Buka file `index.html` di browser atau gunakan live server jika menggunakan VS Code.
2. Frontend akan menampilkan daftar anime dan memiliki fitur untuk menambahkan anime baru.

## Teknologi yang Digunakan
- Backend: Node.js, Express.js
- Database: JSON file (`anime.json`)
- Frontend: HTML, CSS, JavaScript

