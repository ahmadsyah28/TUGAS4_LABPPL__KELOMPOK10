# Sistem API Sederhana

## Deskripsi Proyek
Anime Collection Manager adalah aplikasi berbasis web yang memungkinkan pengguna untuk menambahkan, mencari, dan mengelola koleksi anime mereka. Aplikasi ini menyediakan fitur untuk menampilkan statistik koleksi anime seperti jumlah total anime, rata-rata jumlah episode, dan rata-rata rating.

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
```{
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
```{
    "id": 1,
    "title": "Naruto",
    "genre": "Action",
    "rating": 8.5
}
```

### 3. Menambahkan Anime Baru (POST /anime)
Menambahkan anime baru ke database dengan data dalam format JSON.

#### Contoh Permintaan:
```{
    "title": "Attack on Titan",
    "genre": "Fantasy",
    "rating": 9.2
}
```

#### Contoh Respons:
```{
    "message": "Anime berhasil ditambahkan",
    "data": {
        "id": 3,
        "title": "Attack on Titan",
        "genre": "Fantasy",
        "rating": 9.2
    }
}
```

## Fitur Tambahan
Selain fitur utama, API ini juga menyediakan:
Mengupdate data anime (PUT /anime/:id)
Menghapus anime dari database (DELETE /anime/:id)

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

