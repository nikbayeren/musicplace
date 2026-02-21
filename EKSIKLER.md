# MUSICSHARE — Şu An Eksikler

Bu dosya, projenin şu anki durumuna göre **eksik kalan** özellik ve altyapıyı listeler.

---

## 1. Backend & Veri

| Eksik | Açıklama |
|-------|----------|
| **Veritabanı** | Hiç backend yok; tüm veri `mockData.ts` ile sabit. Gerçek kullanıcı, paylaşım, yorum kaydı yok. |
| **Kimlik doğrulama** | Giriş / kayıt yok. Herkes aynı “Sen” kullanıcısı gibi davranıyor. |
| **API katmanı** | Paylaşım oluşturma, listeleme, yorum, yankı vb. için REST veya GraphQL API yok. |
| **Dosya depolama** | Fotoğraf/video yükleme sadece tarayıcıda önizleme. Sunucuya upload ve kalıcı depolama (S3, Cloudinary vb.) yok. |

**Öneri:** Supabase, Firebase veya Next.js API routes + PostgreSQL gibi bir backend + auth + storage seçilebilir.

---

## 2. Entegrasyonlar

| Eksik | Açıklama |
|-------|----------|
| **Spotify API** | Şarkı arama, kapak/albüm bilgisi otomatik doldurma, “Spotify’da dinle” linki otomatik yok. `.env.example` var ama kod tarafında kullanılmıyor. |
| **Apple Music API** | Aynı şekilde entegrasyon yok. |
| **Şarkı çalma** | Uygulama içinde ses çalma yok; sadece Spotify linkine gidiliyor. İstersen Spotify Web Playback SDK ile “uygulama içinde çal” eklenebilir. |

---

## 3. Sosyal Özellikler

| Eksik | Açıklama |
|-------|----------|
| **Takip sistemi** | Kullanıcı takip etme / takipçi yok. Akış “takip ettiklerim” olamıyor. |
| **Gerçek yankı (resonance)** | Yankı / Kaydet / Taşı butonları sadece arayüz; sayı artmıyor, veriye yazılmıyor. |
| **Yorumlar** | “Yorum” butonu var ama yorum listesi ve yorum yazma/veritabanı yok. |
| **Bildirimler** | Bildirim altyapısı ve ekranı yok. |
| **Profil sayfaları** | Profil tek mock kullanıcı (Ayşe). Gerçek kullanıcıya göre dinamik profil ve “başka kullanıcıya git” yok. |

---

## 4. Keşif & Arama

| Eksik | Açıklama |
|-------|----------|
| **Arama** | Keşfet’teki arama kutusu sadece UI; şarkı/sanatçı/kullanıcı araması çalışmıyor. |
| **Mikro sahne filtreleme** | Sahne seçimi paylaşımları filtrelemiyor; veri sahne bilgisi taşımıyor. |
| **Akış sıralaması** | “Takip ettiklerim” veya “keşfet” için gerçek sıralama/algoritma yok. |

---

## 5. Ürün / Kullanıcı Yolculuğu

| Eksik | Açıklama |
|-------|----------|
| **Davet sistemi** | Vizyon “davetli model” demişti; davet kodu / kapalı kayıt akışı yok. |
| **Onboarding** | İlk girişte “hoş geldin”, tercih toplama vb. yok. |
| **Profil düzenleme** | Bio, isim, kullanıcı adı değiştirme ekranı yok. |
| **Şifre / hesap** | Şifre sıfırlama, e-posta doğrulama vb. yok (auth ile birlikte düşünülmeli). |

---

## 6. Medya & Video

| Eksik | Açıklama |
|-------|----------|
| **Video sesi = şarkı** | Arayüzde “Ses: [şarkı]” yazıyor ama videonun sesi gerçekte paylaşılan şarkıya bağlı değil; teknik entegrasyon (video + Spotify/audio sync) yok. |
| **Upload limitleri** | Dosya boyutu / süre limiti ve validasyon yok (backend + storage gelince eklenmeli). |

---

## 7. Teknik & Kalite

| Eksik | Açıklama |
|-------|----------|
| **Hata yönetimi** | Global error boundary, API hata mesajları, form validasyonu sınırlı. |
| **Erişilebilirlik** | Klavye navigasyonu, ARIA, ekran okuyucu için iyileştirmeler tam değil. |
| **Test** | Birim / entegrasyon / E2E test yok. |
| **SEO** | Dinamik meta etiketleri, Open Graph vb. paylaşım sayfaları için yapılmadı. |
| **Mobil uygulama** | Sadece web var; “sonra app’e çeviririz” denmişti, mobil app henüz yok. |

---

## Öncelik Önerisi (Kısa Vadede)

1. **Backend + Auth + Veritabanı** — Gerçek kullanıcı ve paylaşım.
2. **Dosya yükleme** — Foto/video’nun sunucuda saklanması.
3. **Spotify (veya Apple Music) entegrasyonu** — Şarkı arama ve link/kapak.
4. **Takip + gerçek akış** — Akışın “takip ettiklerim”e göre gelmesi.
5. **Yankı + yorum** — Butonların veriye yazması ve yorum thread’i.

Bu liste, projeyi “canlı bir sosyal ürün”e taşımak için gereken eksikleri özetliyor; mevcut kod ise ağırlıklı olarak **frontend ve akış/profil/keşfet UI’ı** için.
