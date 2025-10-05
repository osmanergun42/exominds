// js/firebase-init.js (DÜZELTİLMİŞ KOD)

// SDK'lar artık HTML'de yüklendiği için import etmeye gerek yok.

// Firebase Proje Yapılandırması 
const firebaseConfig = {
    apiKey: "AIzaSyBBijNU9NhUENMzYJCUI-VO1l39CLQjquE",
    authDomain: "exominds.firebaseapp.com",
    projectId: "exominds",
    storageBucket: "exominds.firebasestorage.app",
    messagingSenderId: "722172388521",
    appId: "1:722172388521:web:5a4f3201fabcccce2975b8",
    measurementId: "G-5BFMPW9C1T"
};

// 1. Firebase'i başlat (firebase global olarak tanımlı)
const app = firebase.initializeApp(firebaseConfig); 

// 2. Firestore servisini al (V8 sözdizimi: app.firestore())
const db = app.firestore(); 

// 3. Koleksiyon referansını tanımla
const planetsCol = db.collection("planets");

// SADECE TANIMLADIĞIMIZ VE DİĞER MODÜLDE İHTİYAÇ DUYULAN DEĞİŞKENLERİ EXPORT EDİYORUZ.
export { db, planetsCol }; // <-- Hata çözüldü! 'firebase' export edilmiyor.