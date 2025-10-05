// js/main.js (SON VE KESİN ÇÖZÜM KODU)

// ADIM 1: Firebase SDK'larını direk burada (type="module" kullanarak) import et
// Bu, hem CORS sorununu (Live Server'da) hem de 'firebase is not defined' hatasını çözer.
import { initializeApp } from "https://www.gstatic.com/firebase/app.js";
import { getFirestore, collection } from "https://www.gstatic.com/firebase/firestore.js";
import { query, getDocs, orderBy } from "https://www.gstatic.com/firebase/firestore.js";

// ==========================================================
// GLOBAL DEĞİŞKENLER VE DOM REFERANSLARI
// ==========================================================

let db; // Firestore referansı
let planetsCol; // Koleksiyon referansı
let allPlanetsData = []; 
const cardsContainer = document.getElementById('planet-cards-container'); 
const tableBody = document.getElementById('exoplanet-table-body'); 
const planetCountSpan = document.getElementById('planet-count'); 
const loadingMessageDiscover = document.getElementById('loading-message-discover'); 

// ==========================================================
// YARDIMCI VE BAŞLATMA FONKSİYONLARI
// ==========================================================

// Firebase'i başlat ve referansları tanımla
function initializeFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyBBijNU9NhUENMzYJCUI-VO1l39CLQjquE",
        authDomain: "exominds.firebaseapp.com",
        projectId: "exominds",
        storageBucket: "exominds.firebasestorage.app",
        messagingSenderId: "722172388521",
        appId: "1:722172388521:web:5a4f3201fabcccce2975b8",
        measurementId: "G-5BFMPW9C1T"
    };

    const app = initializeApp(firebaseConfig); 
    db = getFirestore(app);
    planetsCol = collection(db, "planets");
    console.log("Firebase ve Firestore başlatıldı.");
}

function determinePlanetType(radius) {
    if (!radius) return 'Belirsiz';
    const R_EARTH = 1; 
    if (radius < 1.25 * R_EARTH) return 'Dünya Benzeri';
    if (radius <= 2.0 * R_EARTH) return 'Süper Dünya';
    if (radius > 2.0 * R_EARTH) return 'Gaz Devi';
    return 'Diğer Kayaç/Gaz';
}

function getScoreClass(score) {
    if (typeof score !== 'number' || isNaN(score)) return 'score-low';
    if (score >= 0.8) return 'score-high';
    if (score >= 0.6) return 'score-medium';
    return 'score-low';
}

function createPlanetCard(planet) {
    const score = planet.habitableScore || 0.7; 
    const scoreClass = getScoreClass(score);

    return `
        <div class="planet-card">
            <div class="planet-image-placeholder">
                <img src="${planet.imageUrl || 'images/default-exoplanet.jpg'}" alt="${planet.name}" loading="lazy">
            </div>
            <div class="planet-info">
                <div class="${scoreClass} score-badge">
                    Yaşanabilirlik Skoru: <span>${score.toFixed(2)}</span>
                </div>
                <h3>${planet.name}</h3>
                <p><strong>Yıldız:</strong> ${planet.starName}</p>
                <p><strong>Yarıçap (R⊕):</strong> ${planet.earthRadius ? planet.earthRadius.toFixed(2) : 'N/A'}</p>
                <p><strong>Tipi:</strong> ${planet.type}</p>
                <a href="#discover-section" class="card-detail-button" data-planet-name="${planet.name}">Detaylı İncele</a>
            </div>
        </div>
    `;
}

function createPlanetTableRow(planet) {
    return `
        <tr>
            <td>${planet.name}</td>
            <td>${planet.starName}</td>
            <td>${planet.earthRadius ? planet.earthRadius.toFixed(2) : 'N/A'}</td>
            <td>${planet.earthMass ? planet.earthMass.toFixed(2) : 'N/A'}</td>
            <td>${planet.discoveryYear || 'N/A'}</td>
            <td><a href="#" data-planet-name="${planet.name}" class="table-detail-link">Görüntüle</a></td>
        </tr>
    `;
}

// ==========================================================
// VERİ ÇEKME VE YÜKLEME (FIREBASE V9 MODÜL SÖZDİZİMİ)
// ==========================================================

async function loadAllPlanets() {
    loadingMessageDiscover.style.display = 'block';
    
    // V9 Modül Sözdizimi: query(collectionRef, orderBy...) ve getDocs(query)
    const q = query(planetsCol, orderBy("pl_name")); 
    
    try {
        const querySnapshot = await getDocs(q); 
        allPlanetsData = [];

        querySnapshot.forEach((doc) => {
            const planetData = doc.data();
            
            const earthRadius = parseFloat(planetData.pl_rade);
            const earthMass = parseFloat(planetData.pl_masse);

            allPlanetsData.push({
                name: planetData.pl_name || 'N/A',
                starName: planetData.hostname || 'N/A',
                discoveryMethod: planetData.discoverymethod || 'N/A',
                discoveryYear: planetData.disc_year || (planetData.__parsed_extra ? planetData.__parsed_extra[5] : 'N/A'), 
                earthRadius: earthRadius,
                earthMass: earthMass,
                type: determinePlanetType(earthRadius),
                habitableScore: Math.random() * 0.4 + 0.6 
            });
        });
        
        renderDiscoverTable(allPlanetsData);

    } catch (e) {
        console.error("Tüm gezegenler yüklenirken hata:", e);
        // Hata durumunda kullanıcıya bilgilendirme (Genellikle Firestore Güvenlik Kuralı hatasıdır)
        tableBody.innerHTML = '<tr><td colspan="6" class="error-message">Veritabanına erişilemedi. Güvenlik kurallarını kontrol edin. Hata: ' + e.message + '</td></tr>';
    } finally {
        loadingMessageDiscover.style.display = 'none';
    }
}

function loadFeaturedPlanets() {
    if (allPlanetsData.length > 0) {
        const featuredPlanets = allPlanetsData.slice(0, 6);
        let html = '';
        featuredPlanets.forEach((planet) => {
            html += createPlanetCard(planet);
        });
        cardsContainer.innerHTML = html;
    } else {
         cardsContainer.innerHTML = '<p class="loading-message">Öne çıkan gezegen verileri yükleniyor...</p>';
    }
}

// ==========================================================
// KEŞFET BÖLÜMÜ YÖNETİMİ VE FİLTRELEME
// ==========================================================

function renderDiscoverTable(planets) {
    if (planets.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6">Aradığınız kriterlere uygun gezegen bulunamadı.</td></tr>';
    } else {
        let html = '';
        planets.forEach(planet => {
            html += createPlanetTableRow(planet);
        });
        tableBody.innerHTML = html;
    }
    planetCountSpan.textContent = planets.length;
}

function applyFilters() {
    const searchInput = document.getElementById('search-input').value.toLowerCase().trim();
    const method = document.getElementById('discovery-method').value;
    const type = document.getElementById('planet-type').value;
    const minRadius = parseFloat(document.getElementById('min-radius').value);
    const maxRadius = parseFloat(document.getElementById('max-radius').value);

    let filteredData = allPlanetsData.filter(planet => {
        // Filtreleme mantığı (önceki adımlarla aynı)
        if (searchInput && 
            !(planet.name.toLowerCase().includes(searchInput) || 
              planet.starName.toLowerCase().includes(searchInput))) {
            return false;
        }

        if (method && planet.discoveryMethod !== method) {
            return false;
        }

        if (type && planet.type !== type) {
            return false;
        }

        const radius = planet.earthRadius;
        if (!isNaN(radius)) {
            if (minRadius && radius < minRadius) {
                return false;
            }
            if (maxRadius && radius > maxRadius) {
                return false;
            }
        } else if (minRadius || maxRadius) {
             return false;
        }
        return true;
    });

    renderDiscoverTable(filteredData);
}

// ==========================================================
// OLAY DİNLEYİCİLERİ VE BAŞLANGIÇ
// ==========================================================

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Firebase'i başlat (Modül içinde çağrıldığı için 'firebase is not defined' hatası almaz)
    initializeFirebase();

    // 2. Verileri çekmeye çalış
    await loadAllPlanets(); 
    
    // 3. Veriler çekildikten sonra Ana Sayfa Kartlarını Yükle
    loadFeaturedPlanets(); 

    // 4. Filtreleme Dinleyicileri
    document.getElementById('apply-filters').addEventListener('click', applyFilters);

    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyFilters();
        }
    });
});