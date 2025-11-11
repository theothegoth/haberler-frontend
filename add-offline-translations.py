import json
import os

# Turkish translations for offline page
tr_offline = {
    "offline": {
        "title": "Internet Baglantiniz Yok",
        "description": "Gaste'yi kullanabilmek icin internet baglantisina ihtiyaciniz var. Lutfen baglantinizi kontrol edip tekrar deneyin.",
        "retry": "Tekrar Dene",
        "tipsTitle": "Deneyebilecekleriniz:",
        "tip1": "Wi-Fi veya mobil verinizin acik oldugu'ndan emin olun",
        "tip2": "Ucak modunun kapali oldugunu kontrol edin",
        "tip3": "Farkli bir aga baglanmayi deneyin"
    }
}

# English translations for offline page
en_offline = {
    "offline": {
        "title": "No Internet Connection",
        "description": "You need an internet connection to use Gaste. Please check your connection and try again.",
        "retry": "Try Again",
        "tipsTitle": "Things to try:",
        "tip1": "Make sure your Wi-Fi or mobile data is turned on",
        "tip2": "Check that airplane mode is off",
        "tip3": "Try connecting to a different network"
    }
}

# Update Turkish translations
tr_file = 'src/locales/tr.json'
with open(tr_file, 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

tr_data.update(tr_offline)

with open(tr_file, 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, ensure_ascii=False, indent=2)

print('Turkish translations updated')

# Update English translations
en_file = 'src/locales/en.json'
with open(en_file, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

en_data.update(en_offline)

with open(en_file, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print('English translations updated')
print('Offline page translations added successfully!')
