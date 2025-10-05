// otegezegen.js - Gezegen Tipi Sınıflandırma Kartları Oluşturma ve Modal Mantığı

// ==========================================================
// otegezegen.js - Gezegen Tipi Sınıflandırma Kartları Oluşturma ve Modal Mantığı

// ==========================================================
// 1. FIREBASE BAĞLANTI AYARLARI (Lütfen KENDİ VERİLERİNİZLE DEĞİŞTİRİN)
// ==========================================================
const firebaseConfig = {
apiKey: "YOUR_API_KEY", 
authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
projectId: "YOUR_PROJECT_ID",
// Diğer ayarlar...
};

// Uygulamayı başlat
if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}
// Firestore'a erişim (Bu örnekte sadece başlatma için gerekli, kartlar statik)
const db = firebase.firestore(); 
// ----------------------------------------------------


// ==========================================================
// 2. KART VE MODAL VERİLERİ (TÜM 4 SINIFLANDIRMA DOLDURULDU)
// ==========================================================
const planetTypesData = [
{
name: "Gas Giants",
number: "01",
image: "images/gas_giants_placeholder.jpg", 
filterKey: "Gaz Devi",
modalContent: {
description: `Gaz devleri, büyük boyutları ve yoğun gaz atmosferleriyle öne çıkan gezegenlerdir. Genellikle katı bir yüzeyi yoktur ve çoğunlukla hidrojen ve helyum gibi hafif gazlardan oluşurlar. Gaz devleri, büyük kütleleri nedeniyle genellikle güçlü bir kütle çekim kuvvetine sahiptir ve genellikle çok sayıda uyduya sahiptirler.`,
examples: [
{
name: "HD 209458 b (Osiris)",
info: `Jüpiter büyüklüğünde bir gaz devi olan gezegen, yıldızının yörüngesinde dönerken atmosferinin önemli bir kısmını kaybediyor.`,
discovery: `Osiris olarak da bilinen HD 209458 b, 1999 yılında Kilodegree Extremely Little Telescope (KELT) tarafından keşfedilen bir dış gezegendir.`,
// link: "..." - KALDIRILDI
},
{
name: "WASP-121 b",
info: `Son derece yüksek sıcaklıklara sahip "ultra sıcak Jüpiter"dir. Atmosferindeki gazların çoğu, yıldızından gelen yoğun radyasyon nedeniyle buharlaşmaktadır.`,
discovery: `WASP -121 b, yer tabanlı bir teleskop olan Geniş Açılı Gezegen Araştırması (WASP) kullanılarak keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "HD 189733 b",
info: `2005 yılında keşfedilen bu gezegenin atmosferinde aşırı rüzgar hızları ve yüksek sıcaklıklar bulunuyor ve bu da onu Dünya'dan oldukça farklı kılıyor.`,
discovery: `HD 189733 b adlı ötegezegen, 2005 yılında Haute-Provence Gözlemevi'nde bulunan bir teleskop kullanılarak keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "KELT-9 b",
info: `Bilinen en sıcak dış gezegenlerden biri olan bu gezegen, aşırı sıcaklıkları nedeniyle birçok molekülün kaybolduğu bir ortama sahip.`,
discovery: `KELT -9 b, 2017 yılında Kilodegree Extremely Little Telescope (KELT) tarafından keşfedildi.`,
// link: "..." - KALDIRILDI
}
]
}
},
{
name: "Terrestrial Planets",
number: "02",
image: "images/terrestrial_planets_placeholder.png",
filterKey: "Karasal",
modalContent: { 
description: `Karasal gezegenler, katı bir yüzeye sahip ve çoğunlukla kayalık ve metalik bileşenlerden oluşan gezegenlerdir. Bu gezegenler genellikle dört ana bileşenden oluşur: çekirdek, manto, kabuk ve yüzey. Karasal gezegenler arasında Güneş sistemimizin bir parçası olan Merkür, Venüs, Dünya ve Mars bulunur.`, 
examples: [
{
name: "Kepler-186f",
info: `Yaklaşık 500 ışık yılı uzaklıkta bulunan bu gezegen, yaşama elverişli bölgede yer alıyor ve Dünya benzeri özelliklere sahip karasal bir gezegen olarak kabul ediliyor.`,
discovery: `Kepler -186f, 2014 yılında Kepler Uzay Teleskobu tarafından keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "TRAPPIST-1 d",
info: `Bu gezegen TRAPPIST-1 sisteminde yer alıyor ve yaşanabilir bölgede bulunuyor. Üç kayalık gezegen içeriyor ve potansiyel olarak su barındırıyor olabilir.`,
discovery: `TRAPPIST -1 d, 2016 yılında Spitzer Uzay Teleskobu ve Kepler Uzay Teleskobu kullanılarak keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "Proxima Centauri b",
info: `Bu gezegen, Proxima Centauri'nin yörüngesinde yer alır ve yaklaşık 4,24 ışık yılı uzaklıkta, yaşanabilir bölgede bulunur. Dünya benzeri bir karasal gezegen olarak sınıflandırılır.`,
discovery: `Proxima Centauri b, 2016 yılında Avrupa Güney Gözlemevi (ESO) tarafından keşfedilmiştir.`,
// link: "..." - KALDIRILDI
},
{
name: "LHS 1140 b",
info: `Bu gezegenin kütlesi Dünya'nın kütlesinin 1,4 katıdır ve yaşanabilir bölgede yer alır, bu da onu ilginç bir karasal plan vb. yapar.`,
discovery: `LHS 1140 b, 2017 yılında MEarth projesinin bir parçası olarak keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "K2-72e",
info: `K2-72 sisteminde bulunan bu gezegen, Dünya'dan 1,6 kat daha büyük ve yaşama elverişli bölgede yer alıyor; bu da onu ilgi çekici bir karasal gezegen yapıyor.`,
discovery: `K2-72e , 2017 yılında Kepler Uzay Teleskobu kullanılarak keşfedildi.`,
// link: "..." - KALDIRILDI
}
] 
}
},
{
name: "Neptunian Planets",
number: "03",
image: "images/neptunian_planets_placeholder.jpg",
filterKey: "Neptün Benzeri",
modalContent: { 
description: `Neptün gezegenleri, Neptün'e benzer özelliklere sahip gezegenlerdir. Neptün gezegenleri, su, amonyak ve metan gibi donmuş gazlar (buzlar) içeren bir atmosferle çevrilidir. Genellikle daha küçüktürler ve Jüpiter ve Satürn gibi gaz devlerinden daha az kütleye sahiptirler. Neptün gezegenlerinin soğuk ve yoğun atmosferleri olma eğilimi vardır.`, 
examples: [
{
name: "GJ 436 b",
info: `Neptün gezegeni olarak tanımlanan bu gezegen, 2004 yılında keşfedildi ve yaklaşık 22 ışık yılı uzaklıkta yer alıyor. Atmosferinde su buharı tespit edildi.`,
discovery: `GJ 436 b, 2007 yılında Harvard-Smithsonian Astrofizik Gözlemevi tarafından keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "HAT-P-11 b",
info: `Yaklaşık 120 ışık yılı uzaklıkta bulunan bu gezegen, Neptün özelliklerine sahip bir "mini Neptün" olarak sınıflandırılıyor. Atmosferinde su buharı ve diğer bileşenler tespit edildi.`,
discovery: `HAT-P-11 b, 2010 yılında Keck Gözlemevi ve Harvard-Smithsonian Astrofizik Gözlemevi'nin işbirliğiyle keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "HD 149026 b",
info: `Bu gezegen, yıldızından önemli miktarda enerji emen sıcak bir Neptün gezegenidir. Atmosferinde ağır elementler bulunduğu düşünülmektedir.`,
discovery: `HD 149026 b, 2005 yılında Keck Gözlemevi ve Hubble Uzay Teleskobu kullanılarak keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "WASP-107 b",
info: `Bu gezegenin yoğunluğu düşük ve atmosferi geniştir. Atmosferinde su buharı tespit edilmiştir.`,
discovery: `WASP -107 b, 2017 yılında Geniş Açı Gezegen Araştırması (WASP) projesinin bir parçası olarak keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "K2-18 b",
info: `Daha önce bahsi geçen bu gezegen, yaşama elverişli bölgede yer alıyor ve atmosferinde su buharı bulunduğu tespit edildi.`,
discovery: `K2-18 b, 2015 yılında Kepler Uzay Teleskobu tarafından keşfedildi.`,
// link: "..." - KALDIRILDI
}
] 
}
},
{
name: "Super-Earth",
number: "04",
image: "images/super_earth_placeholder.png",
filterKey: "Süper Dünya",
modalContent: { 
description: `Süper Dünyalar, Dünya'dan büyük ancak Uranüs ve Neptün'den küçük olan ötegezegenlerdir. Genellikle Dünya'nın 1,5 ila 4 katı kütleye sahiptirler. Süper Dünyalar, farklı atmosfer ve yüzey koşullarına sahip olabilir ve bu da onları potansiyel yaşanabilirlikleriyle öne çıkarır.`, 
examples: [
{
name: "51 Pegasi b",
info: `1995 yılında keşfedilen bu gezegen, Süper Dünya olarak kabul ediliyor ve yıldızına çok yakın bir yörüngede dönüyor.`,
discovery: `51 Pegasi b, 1995 yılında La Silla Gözlemevi'ndeki Keck Gözlemevi kullanılarak keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "Kepler-22 b",
info: `Yaklaşık 600 ışık yılı uzaklıkta bulunan bu gezegen, yaşanabilir bölgede yer alıyor ve su içerme potansiyeline sahip olabilir.`,
discovery: `Kepler-22 b, 2011 yılında Kepler Uzay Teleskobu tarafından keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "GJ 1214 b",
info: `2009 yılında keşfedilen bu gezegen, Dünya'dan 6,5 kat daha büyüktür. Atmosferinin su buharı içerdiği düşünülmektedir.`,
discovery: `GJ 1214 b, 2009 yılında Harvard-Smithsonian Astrofizik Gözlemevi tarafından keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "LHS 1140 b",
info: `Yaklaşık 40 ışık yılı uzaklıkta bulunan bu gezegen, Dünya'nın kütlesinin 1,4 katı büyüklüğündeki Süper Dünya olarak sınıflandırılıyor.`,
discovery: `LHS 1140 b, 2017 yılında MEarth Projesi kapsamında keşfedildi.`,
// link: "..." - KALDIRILDI
},
{
name: "K2-18 b",
info: `Daha önce de belirttiğimiz gibi bu gezegen yaşanabilir bölgede yer alıyor ve atmosferinde su buharı tespit edildi.`,
discovery: `K2-18 b, 2015 yılında Kepler Uzay Teleskobu tarafından keşfedildi.`,
// link: "..." - KALDIRILDI
}
] 
}
}
];


// ==========================================================
// 3. MODAL DEĞİŞKENLERİ VE FONKSİYONLARI
// ==========================================================
const modal = document.getElementById('planet-modal');
const closeModalButton = document.querySelector('.close-button');


/**
* Modal pencereyi açar ve içeriğini doldurur.
* @param {object} content - Gezegen tipinin modalContent objesi.
* @param {string} title - Modal başlığı.
*/
function openModal(content, title) {
document.getElementById('modal-title').textContent = title;

let htmlContent = `<p class="lead-text" style="font-size: 1.1em; color: var(--color-text-light); margin-bottom: 30px;">${content.description}</p>`;

// Örnek gezegenleri HTML'e dönüştür
if (content.examples && content.examples.length > 0) {
htmlContent += `<h4>Ötegezegen Örnekleri:</h4><hr style="border-color: var(--color-text-muted); margin: 10px 0;">`;

content.examples.forEach(example => {
// NOT: İstek üzerine link satırı (a etiketi) kaldırıldı
htmlContent += `
<div class="planet-example">
<h4>${example.name}:</h4>
<p>${example.info}</p>
<p class="discovery-info">
${example.discovery}
</p>
</div>
`;
});
} else {
htmlContent += `<p style="font-style: italic;">Bu gezegen türü için detaylı örnek veri henüz yüklenmedi.</p>`;
}

document.getElementById('modal-content-area').innerHTML = htmlContent;

// Modalı görünür yap
modal.style.display = 'flex';
modal.setAttribute('aria-hidden', 'false');
document.body.style.overflow = 'hidden'; // Arka plan kaydırmasını engelle
}

/**
* Modal pencereyi kapatır.
*/
function closeModal() {
modal.style.display = 'none';
modal.setAttribute('aria-hidden', 'true');
document.body.style.overflow = 'auto'; // Arka plan kaydırmasını etkinleştir
}

/**
* Kart tıklama olayını yakalar ve modalı açar.
* @param {Event} event - Tıklama olayı.
* @param {string} filterKey - Tıklanan kartın gezegen tipi anahtarı.
*/
function handleCardClick(event, filterKey) {
event.stopPropagation(); // Olayın daha fazla yayılmasını engelle

const planetType = planetTypesData.find(p => p.filterKey === filterKey);

if (planetType && planetType.modalContent) {
openModal(planetType.modalContent, planetType.name);
}
}


// ==========================================================
// 4. KARTLARA TILT (PARALAKS) ETKİSİ EKLEME
// ==========================================================

/**
 * Tek bir kart için tilt/paralaks efekti ekler.
 * @param {HTMLElement} card - Üzerine efekt eklenecek kart DOM elementi.
 */
function addTiltEffect(card) {
    const bg = card.querySelector('.type-card-bg');
    const content = card.querySelector('.card-overlay-content');
    
    const TILT_MAX = 5; 
    const PARALLAX_BG = 5; 
    const PARALLAX_CONTENT = 10; 
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        
        const tiltY = x * TILT_MAX;
        const tiltX = -y * TILT_MAX;
        
        card.style.transform = `translateY(-5px) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        const bgTranslateX = x * PARALLAX_BG;
        const bgTranslateY = y * PARALLAX_BG;
        bg.style.transform = `translate3d(${-bgTranslateX}px, ${-bgTranslateY}px, 20px)`; 
        
        const contentTranslateX = x * PARALLAX_CONTENT;
        const contentTranslateY = y * PARALLAX_CONTENT;
        content.style.transform = `translate3d(${contentTranslateX}px, ${contentTranslateY}px, 50px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-5px)'; 
        
        bg.style.transform = 'translate3d(0, 0, 0)';
        content.style.transform = 'translate3d(0, 0, 0)';
    });
}


// ==========================================================
// 5. KARTLARI OLUŞTURMA VE HTML'E YERLEŞTİRME FONKSİYONU
// ==========================================================
/**
* Gezegen türü kartlarını HTML'e basar ve olay dinleyicilerini ekler.
*/
function renderPlanetTypeCards() {
const gridElement = document.getElementById('planet-type-grid');

gridElement.innerHTML = ''; 

if (planetTypesData.length === 0) {
gridElement.innerHTML = `<p class="error-message" style="grid-column: 1 / -1;">Gezegen türü verisi yüklenemedi.</p>`;
return;
}

const allCardsHTML = planetTypesData.map(item => `
<div class="type-card" data-filter-key="${item.filterKey}">
<img 
src="${item.image}" 
alt="${item.name} Sınıflandırması" 
class="type-card-bg"
loading="lazy"
>
<div class="card-overlay-content">
<span class="type-card-number">${item.number}</span>
<h3 class="type-card-title">${item.name}</h3>
<button class="type-card-explore explore-button">Keşfet</button>
</div>
</div>
`).join('');

gridElement.innerHTML = allCardsHTML;

attachCardListeners();
}


// ==========================================================
// 6. OLAY DİNLEYİCİLERİNİ BAĞLAMA FONKSİYONU
// ==========================================================
/**
* Kartlara ve Modal'a olay dinleyicilerini bağlar.
*/
function attachCardListeners() {
document.querySelectorAll('.type-card').forEach(card => {
const filterKey = card.getAttribute('data-filter-key');

// Modal açma
card.addEventListener('click', (e) => {
if (e.target.tagName !== 'A') { 
handleCardClick(e, filterKey);
}
});

// Tilt efektini uygula
addTiltEffect(card);
});

// Modal kapatma olayları
closeModalButton.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
if (e.target === modal) {
closeModal();
}
});

document.addEventListener('keydown', (e) => {
if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
closeModal();
}
});
}


// ==========================================================
// 7. SAYFA YÜKLENDİĞİNDE BAŞLATMA
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
renderPlanetTypeCards();
});