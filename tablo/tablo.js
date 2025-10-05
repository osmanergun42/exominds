// Gerekli Firebase modüllerini import etme
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Sizin Firebase Konfigürasyonunuz (Lütfen kendi anahtarınızı kullanın!)
const firebaseConfig = {
    apiKey: "AIzaSyBBijNU9NhUENMzYJCUI-VO1l39CLQjquE",
    authDomain: "exominds.firebaseapp.com",
    projectId: "exominds",
    storageBucket: "exominds.firebasestorage.app",
    messagingSenderId: "722172388521",
    appId: "1:722172388521:web:5a4f3201fabcccce2975b8",
    measurementId: "G-5BFMPW9C1T"
};

// Firebase ve Firestore'u Başlatma
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const KOLEKSIYON_ADI = "exoplanets"; 

// HTML elementlerini seçme
const tabloGovdesi = document.getElementById('gezegen-tablo-govdesi');
const yukleniyorMesaji = document.getElementById('yukleniyor-mesaji');
const toplamGezegenSayisi = document.getElementById('toplam-gezegen-sayisi');
const filtreFormu = document.getElementById('filtre-formu');
const gezegenTipiSelect = document.getElementById('gezegen-tipi'); 

// Sayfalama Elementleri
const oncekiSayfaButonu = document.getElementById('onceki-sayfa');
const sonrakiSayfaButonu = document.getElementById('sonraki-sayfa');
const sayfaBilgisi = document.getElementById('sayfa-bilgisi');
const tumunuSecKutusu = document.getElementById('tumunu-sec-kutusu');

// İndir Butonu
const indirButonu = document.getElementById('secili-indir-butonu'); 

// --- SAYFALAMA VE SEÇİM DEĞİŞKENLERİ ---
let mevcutSayfa = 1;
const sayfaBasiGezegenSayisi = 20;
let filtrelenmisGezegenler = []; 
let seciliGezegenIDleri = new Set(); 
// --- SAYFALAMA VE SEÇİM DEĞİŞKENLERİ SONU ---

// --- MODAL ELEMENTLERİ ---
const detayModal = document.getElementById('gezegen-detay-modal');
const kapatButonu = detayModal ? detayModal.querySelector('.kapat-butonu') : null;

// Detay Modal Alanları
const detayAdi = document.getElementById('detay-adi');
// NOT: modalGorselAlani kaldırıldı
const modalAdi = document.getElementById('modal-adi'); 
const modalYildiz = document.getElementById('modal-yildiz');
const modalYontem = document.getElementById('modal-yontem');
const modalYil = document.getElementById('modal-yil');
const modalTesis = document.getElementById('modal-tesis'); 
const modalYaricap = document.getElementById('modal-yaricap');
const modalKutle = document.getElementById('modal-kutle');
const modalYogunluk = document.getElementById('modal-yogunluk');
const modalPeriyot = document.getElementById('modal-periyot');
const modalSicaklik = document.getElementById('modal-sicaklik');
const modalSolutionType = document.getElementById('modal-solution-type');
const modalControversial = document.getElementById('modal-controversial');
const modalTtv = document.getElementById('modal-ttv');
const modalDefaultSet = document.getElementById('modal-default-set');
const modalNumPlanets = document.getElementById('modal-num-planets');
const modalPlanetRef = document.getElementById('modal-planet-ref');
const modalStellarRef = document.getElementById('modal-stellar-ref');
const modalSystemRef = document.getElementById('modal-system-ref');
const modalStellarTemp = document.getElementById('modal-stellar-temp');
const modalStellarRadius = document.getElementById('modal-stellar-radius');
const modalStellarMass = document.getElementById('modal-stellar-mass');
const modalStellarMetallicity = document.getElementById('modal-stellar-metallicity');
const modalStellarGravity = document.getElementById('modal-stellar-gravity');
const modalSpectralType = document.getElementById('modal-spectral-type');
const modalRa = document.getElementById('modal-ra');
const modalDec = document.getElementById('modal-dec');
const modalDistance = document.getElementById('modal-distance');
const modalVmag = document.getElementById('modal-vmag');
const modalKsmag = document.getElementById('modal-ksmag');
const modalGaiamag = document.getElementById('modal-gaiamag');
const modalLastUpdate = document.getElementById('modal-last-update');
const modalReleaseDate = document.getElementById('modal-release-date');
const modalParamPubDate = document.getElementById('modal-param-pub-date');
// --- MODAL ELEMENTLERİ SONU ---

let tumGezegenler = [];

// ==========================================
//           MODAL VE TİP İŞLEVLERİ 
// ==========================================

function detaylariGoster(g) {
    if (!detayModal) return;

    detayAdi.textContent = g.adi; 
    
    // GÖRSELLEŞTİRME KISMI KALDIRILDI
    
    // Gezegen ve Keşif Detayları
    modalAdi.textContent = g.adi;
    modalYildiz.textContent = g.yildizSistemi;
    modalYontem.textContent = g.kesifYontemi;
    modalYil.textContent = g.kesifYili;
    modalTesis.textContent = g.kesifTesis; 
    modalSolutionType.textContent = g.solutionType;
    modalControversial.textContent = g.controversialFlag === '1' ? 'Evet' : 'Hayır';
    modalTtv.textContent = g.ttv === '1' ? 'Evet' : 'Hayır';
    modalDefaultSet.textContent = g.defaultSet;
    modalNumPlanets.textContent = g.numPlanets;

    // Fiziksel / Orbital Özellikler
    modalYaricap.textContent = g.yaricap + (g.yaricap !== 'N/A' ? ' R⊕' : '');
    modalKutle.textContent = g.kutle + (g.kutle !== 'N/A' ? ' M⊕' : '');
    modalYogunluk.textContent = g.yogunluk + (g.yogunluk !== 'N/A' ? ' g/cm³' : '');
    modalPeriyot.textContent = g.periyot + (g.periyot !== 'N/A' ? ' gün' : '');
    modalSicaklik.textContent = g.sicaklik + (g.sicaklik !== 'N/A' ? ' K' : '');
    
    // Koordinatlar ve Uzaklık
    modalRa.textContent = g.ra;
    modalDec.textContent = g.dec;
    modalDistance.textContent = g.distance + (g.distance !== 'N/A' ? ' pc' : '');
    
    // Yıldız Özellikleri
    modalSpectralType.textContent = g.spectralType;
    modalStellarTemp.textContent = g.stellarTemp + (g.stellarTemp !== 'N/A' ? ' K' : '');
    modalStellarRadius.textContent = g.stellarRadius + (g.stellarRadius !== 'N/A' ? ' R⊙' : '');
    modalStellarMass.textContent = g.stellarMass + (g.stellarMass !== 'N/A' ? ' M⊙' : '');
    modalStellarMetallicity.textContent = g.stellarMetallicity + (g.stellarMetallicity !== 'N/A' ? ' [dex]' : '');
    modalStellarGravity.textContent = g.stellarGravity + (g.stellarGravity !== 'N/A' ? ' [log10(cm/s²)]' : '');
    modalVmag.textContent = g.vMag;
    modalKsmag.textContent = g.ksMag;
    modalGaiamag.textContent = g.gaiaMag;
    
    // Kaynaklar ve Tarihler
    modalPlanetRef.textContent = g.planetRef;
    modalStellarRef.textContent = g.stellarRef;
    modalSystemRef.textContent = g.systemRef;
    modalLastUpdate.textContent = g.lastUpdate;
    modalReleaseDate.textContent = g.releaseDate;
    modalParamPubDate.textContent = g.paramPubDate;
    
    detayModal.style.display = "block";
}

if (kapatButonu) {
    kapatButonu.onclick = function() {
        detayModal.style.display = "none";
    }
}
window.onclick = function(event) {
    if (detayModal && event.target == detayModal) {
        detayModal.style.display = "none";
    }
}

function gezegenTipiBelirle(yaricapStr) {
    const yaricap = parseFloat(yaricapStr);
    if (isNaN(yaricap) || yaricapStr === 'N/A') {
        return "Bilinmiyor";
    }
    if (yaricap >= 0.5 && yaricap < 1.25) {
        return "DunyaBenzeri"; 
    } else if (yaricap >= 1.25 && yaricap < 2.0) { 
        return "SüperDunya"; 
    } else if (yaricap >= 2.0 && yaricap <= 4.0) {
        return "MiniNeptün"; 
    } else if (yaricap > 4.0) {
        return "GazDevi"; 
    } else {
        return "Bilinmiyor"; 
    }
}

function gezegenTipiSelectiDoldur() {
    gezegenTipiSelect.innerHTML = '<option value="">Tüm Tipler</option>';
    
    const tipler = {
        "DunyaBenzeri": "Dünya Benzeri (0.5 - 1.25 R⊕)",
        "SüperDunya": "Süper Dünya (1.25 - 2.0 R⊕)",
        "MiniNeptün": "Mini Neptün (2.0 - 4.0 R⊕)",
        "GazDevi": "Gaz Devi (> 4.0 R⊕)",
        "Bilinmiyor": "Bilinmiyor (N/A veya < 0.5 R⊕)"
    };

    for (const [key, value] of Object.entries(tipler)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value;
        gezegenTipiSelect.appendChild(option);
    }
    
    gezegenTipiSelect.disabled = false;
    
    $('#gezegen-tipi').select2({
        theme: "classic"
    }).on('change', dinamikFiltrelemeYap);
}

// ==========================================
//           SEÇİM VE İNDİRME İŞLEVLERİ 
// ==========================================

function indirmeButonuDurumunuGuncelle() {
    indirButonu.disabled = seciliGezegenIDleri.size === 0;
}

function gezegenSeciminiGuncelle(gezegenUniqueId, secildi) {
    if (secildi) {
        seciliGezegenIDleri.add(gezegenUniqueId);
    } else {
        seciliGezegenIDleri.delete(gezegenUniqueId);
    }
    indirmeButonuDurumunuGuncelle();
}

function gezegenleriIndir() {
    if (seciliGezegenIDleri.size === 0) {
        alert("Lütfen indirmek için en az bir gezegen seçin.");
        return;
    }
    
    const seciliHeaders = [
        "adi",              
        "yildizSistemi",    
        "kesifYili",        
        "yaricap",          
        "kutle",            
        "kesifYontemi",     
        "periyot",
        "sicaklik",
        "distance",
        "stellarTemp",
        "stellarMass",
        "ra",
        "dec",
        "yogunluk"
    ];

    const csvBasliklar = [
        "Gezegen Adı", 
        "Yıldız Sistemi", 
        "Keşif Yılı", 
        "Yarıçap (R⊕)", 
        "Kütle (M⊕)", 
        "Keşif Yöntemi",
        "Yörünge Periyodu (Gün)",
        "Denge Sıcaklığı (K)",
        "Uzaklık (pc)",
        "Yıldız Sıcaklığı (K)",
        "Yıldız Kütlesi (M⊙)",
        "Sağ Açıklık (RA)",
        "Yükselim (Dec)",
        "Yoğunluk (g/cm³)"
    ];

    const csvBaslik = csvBasliklar.join(',');
    
    const indirilecekVeriler = tumGezegenler.filter(gezegen => 
        seciliGezegenIDleri.has(gezegen.uniqueId) 
    );
    
    if (indirilecekVeriler.length === 0) {
         alert("Seçilen gezegenlere ait detaylı veri bulunamadı.");
         return;
    }
    
    const csvSatirlar = indirilecekVeriler.map(gezegen => {
        return seciliHeaders.map(header => {
            let value = gezegen[header];
            
            if (value === 'N/A' || value === undefined || value === null) {
                value = '';
            } else {
                value = String(value).replace(/"/g, '""');
                value = `"${value}"`;
            }
            return value;
        }).join(',');
    });
    
    const csvContent = csvBaslik + '\n' + csvSatirlar.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ExoMinds_SeciliVeriler_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden'; 
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// ==========================================
//          SAYFALAMA VE FİLTRELEME İŞLEVLERİ 
// ==========================================

function sayfalamaKontrolleriniGuncelle(gezegenListesi) {
    const toplamSayfa = Math.ceil(gezegenListesi.length / sayfaBasiGezegenSayisi);
    
    sayfaBilgisi.textContent = `Sayfa ${mevcutSayfa} / ${toplamSayfa}`;
    
    oncekiSayfaButonu.disabled = mevcutSayfa === 1;
    sonrakiSayfaButonu.disabled = mevcutSayfa === toplamSayfa || toplamSayfa === 0;

    const kontroller = document.getElementById('sayfalama-kontrolleri');
    if (kontroller) {
        kontroller.style.display = gezegenListesi.length > 0 ? 'flex' : 'none';
    }
}

function sayfaDegistir(delta) {
    const toplamSayfa = Math.ceil(filtrelenmisGezegenler.length / sayfaBasiGezegenSayisi);
    
    mevcutSayfa = mevcutSayfa + delta;
    
    if (mevcutSayfa < 1) mevcutSayfa = 1;
    if (mevcutSayfa > toplamSayfa) mevcutSayfa = toplamSayfa;
    
    tabloyuDoldur(filtrelenmisGezegenler);
}

function filtreleVeri() {
    const aramaKutusu = document.getElementById('arama-kutusu').value.toLowerCase().trim();
    const yontem = $('#kesif-yontemi').val() || ''; 
    const gezegenTipi = $('#gezegen-tipi').val() || ''; 

    const yaricapMin = parseFloat(document.getElementById('yaricap-min').value) || 0;
    const yaricapMax = parseFloat(document.getElementById('yaricap-max').value) || Infinity; 
    const kutleMin = parseFloat(document.getElementById('kutle-min').value) || 0;
    const kutleMax = parseFloat(document.getElementById('kutle-max').value) || Infinity; 
    const periyotMin = parseFloat(document.getElementById('periyot-min').value) || 0;
    const periyotMax = parseFloat(document.getElementById('periyot-max').value) || Infinity; 

    let filtrelenmisListe = tumGezegenler.filter(gezegen => {
        const adEslesme = gezegen.adi.toLowerCase().includes(aramaKutusu); 
        const yildizEslesme = gezegen.yildizSistemi.toLowerCase().includes(aramaKutusu);
        if (!(adEslesme || yildizEslesme)) return false;

        if (yontem && gezegen.kesifYontemi !== yontem) return false;
        
        if (gezegenTipi) {
            const mevcutTip = gezegenTipiBelirle(gezegen.yaricap);
            if (mevcutTip !== gezegenTipi) {
                return false;
            }
        }

        const aralikKontrol = (deger, min, max) => {
            const val = parseFloat(deger);
            if (deger === 'N/A' || isNaN(val)) return min === 0; 
            return val >= min && val <= max;
        };

        if (!aralikKontrol(gezegen.yaricap, yaricapMin, yaricapMax)) return false;
        if (!aralikKontrol(gezegen.kutle, kutleMin, kutleMax)) return false;
        if (!aralikKontrol(gezegen.periyot, periyotMin, periyotMax)) return false;

        return true; 
    });

    return filtrelenmisListe;
}


// ==========================================
//          TABLOYU DOLDURMA 
// ==========================================

function tabloyuDoldur(gezegenListesi) {
    tabloGovdesi.innerHTML = '';
    
    if (tumunuSecKutusu) {
        tumunuSecKutusu.checked = false; 
    }

    const baslangicIndeksi = (mevcutSayfa - 1) * sayfaBasiGezegenSayisi;
    const bitisIndeksi = baslangicIndeksi + sayfaBasiGezegenSayisi;

    const gosterilecekVeri = gezegenListesi.slice(baslangicIndeksi, bitisIndeksi); 

    if (gezegenListesi.length === 0) {
        tabloGovdesi.innerHTML = `<tr><td colspan="7" style="text-align: center;">Filtrelere uygun ötegezegen bulunamadı.</td></tr>`;
        toplamGezegenSayisi.textContent = '0';
        sayfalamaKontrolleriniGuncelle([]); 
        indirmeButonuDurumunuGuncelle(); 
        return;
    }

    gosterilecekVeri.forEach((gezegen) => {
        const satir = tabloGovdesi.insertRow();
        
        // Seçim Kutusu Hücresi (0. sütun)
        const secimHucresi = satir.insertCell(0);
        const secimKutusu = document.createElement('input');
        secimKutusu.type = 'checkbox';
        secimKutusu.className = 'gezegen-secim-kutusu'; 
        secimKutusu.value = gezegen.uniqueId; 
        
        secimKutusu.checked = seciliGezegenIDleri.has(gezegen.uniqueId);

        secimKutusu.addEventListener('change', (e) => {
            gezegenSeciminiGuncelle(gezegen.uniqueId, e.target.checked);
        });

        secimHucresi.appendChild(secimKutusu);
        
        // Tablo Sütunları (HTML başlıklarına uygun)
        satir.insertCell(1).textContent = gezegen.adi; 
        satir.insertCell(2).textContent = gezegen.yildizSistemi; 
        satir.insertCell(3).textContent = gezegen.yaricap !== 'N/A' ? gezegen.yaricap + ' R⊕' : 'N/A';
        satir.insertCell(4).textContent = gezegen.kutle !== 'N/A' ? gezegen.kutle + ' M⊕' : 'N/A';
        satir.insertCell(5).textContent = gezegen.kesifYili; 
        
        const detayHucresi = satir.insertCell(6); 
        const detayButonu = document.createElement('button');
        detayButonu.textContent = 'Detay Gör';
        detayButonu.className = 'detay-button';
        detayButonu.onclick = () => detaylariGoster(gezegen); 
        detayHucresi.appendChild(detayButonu);
    });
    
    const tumSecimKutulari = document.querySelectorAll('.gezegen-secim-kutusu');
    const tumuSeciliMi = tumSecimKutulari.length > 0 && Array.from(tumSecimKutulari).every(kutu => kutu.checked);
    if (tumunuSecKutusu) {
        tumunuSecKutusu.checked = tumuSeciliMi;
    }
    
    toplamGezegenSayisi.textContent = gezegenListesi.length;
    sayfalamaKontrolleriniGuncelle(gezegenListesi); 
    indirmeButonuDurumunuGuncelle(); 
}

function dinamikFiltrelemeYap() {
    filtrelenmisGezegenler = filtreleVeri(); 
    mevcutSayfa = 1; 
    tabloyuDoldur(filtrelenmisGezegenler);
}


// ==========================================
//          VERİ ÇEKME İŞLEVİ 
// ==========================================

async function gezegenVerileriniCek() {
    yukleniyorMesaji.style.display = 'block';
    
    try {
        const gezegenlerRef = collection(db, KOLEKSIYON_ADI);
        const sorguSonucu = await getDocs(gezegenlerRef);
        
        const islenmisVeri = [];

        sorguSonucu.forEach((doc) => {
            const data = doc.data();
            const parsedData = data.__parsed_extra;
            
            const uniqueId = doc.id; 

            if (parsedData && parsedData.length > 0) {
                islenmisVeri.push({
                    uniqueId: uniqueId, 
                    adi: parsedData[6] || doc.id,         
                    yildizSistemi: parsedData[0] || 'N/A', 
                    defaultSet: parsedData[1] || 'N/A',    
                    numPlanets: parsedData[3] || 'N/A',    
                    kesifYontemi: parsedData[4] || 'N/A',  
                    kesifYili: parsedData[5] || 'N/A',     
                    kesifTesis: parsedData[7] || 'N/A',    
                    solutionType: parsedData[8] || 'N/A',  
                    controversialFlag: parsedData[9] || 'N/A', 
                    planetRef: parsedData[10] || 'N/A',    
                    periyot: parsedData[2] || 'N/A',       
                    yaricap: parsedData[54] || 'N/A',      
                    kutle: parsedData[67] || 'N/A',        
                    yogunluk: parsedData[65] || 'N/A',     
                    sicaklik: parsedData[58] || 'N/A',     
                    ttv: parsedData[59] || 'N/A',          
                    stellarRef: parsedData[82] || 'N/A',   
                    spectralType: parsedData[84] || 'N/A', 
                    stellarTemp: parsedData[85] || 'N/A',  
                    stellarRadius: parsedData[86] || 'N/A',
                    stellarMass: parsedData[87] || 'N/A',  
                    stellarMetallicity: parsedData[88] || 'N/A', 
                    stellarMetallicityRatio: parsedData[89] || 'N/A', 
                    stellarGravity: parsedData[90] || 'N/A', 
                    systemRef: parsedData[91] || 'N/A',    
                    ra: parsedData[92] || 'N/A',           
                    dec: parsedData[93] || 'N/A',          
                    distance: parsedData[94] || 'N/A',     
                    vMag: parsedData[95] || 'N/A',         
                    ksMag: parsedData[96] || 'N/A',        
                    gaiaMag: parsedData[97] || 'N/A',      
                    lastUpdate: parsedData[98] || 'N/A',   
                    paramPubDate: parsedData[99] || 'N/A', 
                    releaseDate: parsedData[100] || 'N/A', 
                });
            }
        });
        
        tumGezegenler = islenmisVeri;
        filtrelenmisGezegenler = tumGezegenler; 
        tabloyuDoldur(filtrelenmisGezegenler); 
        gezegenTipiSelectiDoldur(); 
        
    } catch (hata) {
        console.error("Veri çekilirken hata oluştu: ", hata);
        tabloGovdesi.innerHTML = `<tr><td colspan="7" style="color: red; text-align: center;">Veriler yüklenemedi. Detaylar için konsolu kontrol edin.</td></tr>`; 
    } finally {
        yukleniyorMesaji.style.display = 'none';
    }
}

// ==========================================
//       OLAY DİNLEYİCİLERİ VE BAŞLATMA 
// ==========================================

if (filtreFormu) {
    filtreFormu.addEventListener('submit', (e) => {
        e.preventDefault(); 
        dinamikFiltrelemeYap();
    });
}

// Sayfalama Butonları İçin Olay Dinleyicileri
if (oncekiSayfaButonu) oncekiSayfaButonu.addEventListener('click', () => sayfaDegistir(-1));
if (sonrakiSayfaButonu) sonrakiSayfaButonu.addEventListener('click', () => sayfaDegistir(1));

// "Tümünü Seç" Olay Dinleyicisi
if (tumunuSecKutusu) {
    tumunuSecKutusu.addEventListener('change', function() {
        const tumSecimKutulari = document.querySelectorAll('.gezegen-secim-kutusu');
        const secildi = this.checked;
        
        tumSecimKutulari.forEach(kutu => {
            kutu.checked = secildi;
            gezegenSeciminiGuncelle(kutu.value, secildi); 
        });
    });
}

// İndir Butonu Olay Dinleyicisi
if (indirButonu) {
    indirButonu.addEventListener('click', gezegenleriIndir);
}


$(document).ready(function() {
    // Select2 Başlatma
    $('#kesif-yontemi').select2({
        theme: "classic" 
    }).on('change', dinamikFiltrelemeYap); 
});

// Diğer input'lar için olay dinleyicileri (Input değiştiğinde filtrele)
if (document.getElementById('arama-kutusu')) {
    document.getElementById('arama-kutusu').addEventListener('input', () => {
        clearTimeout(window.aramaTimer);
        window.aramaTimer = setTimeout(dinamikFiltrelemeYap, 300);
    });
}

const filtreInputlari = ['yaricap-min', 'yaricap-max', 'kutle-min', 'kutle-max', 'periyot-min', 'periyot-max'];
filtreInputlari.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', dinamikFiltrelemeYap);
});


// Uygulamayı Başlat
gezegenVerileriniCek();