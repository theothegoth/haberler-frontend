import json

# Turkish translations
tr_pwa = {
    "pwa": {
        "install": {
            "title": "Gaste'yi Yükle",
            "description": "Uygulamayı cihazınıza yükleyerek daha hızlı erişim sağlayın ve çevrimdışı kullanın.",
            "button": "Yükle",
            "later": "Daha Sonra"
        }
    }
}

# English translations
en_pwa = {
    "pwa": {
        "install": {
            "title": "Install Gaste",
            "description": "Install the app on your device for faster access and offline use.",
            "button": "Install",
            "later": "Later"
        }
    }
}

# Update Turkish
with open('src/locales/tr.json', 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

tr_data['pwa'] = tr_pwa['pwa']

with open('src/locales/tr.json', 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, ensure_ascii=False, indent=2)

print('Turkish translations updated')

# Update English
with open('src/locales/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

en_data['pwa'] = en_pwa['pwa']

with open('src/locales/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

print('English translations updated')
print('PWA translations added successfully!')
