import json

# Correct Turkish translations for offline page with proper Turkish characters
tr_offline_fixed = {
    "offline": {
        "title": "İnternet Bağlantınız Yok",
        "description": "Gaste'yi kullanabilmek için internet bağlantısına ihtiyacınız var. Lütfen bağlantınızı kontrol edip tekrar deneyin.",
        "retry": "Tekrar Dene",
        "tipsTitle": "Deneyebilecekleriniz:",
        "tip1": "Wi-Fi veya mobil verinizin açık olduğundan emin olun",
        "tip2": "Uçak modunun kapalı olduğunu kontrol edin",
        "tip3": "Farklı bir ağa bağlanmayı deneyin"
    }
}

# Update Turkish translations
tr_file = 'src/locales/tr.json'
with open(tr_file, 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

tr_data['offline'] = tr_offline_fixed['offline']

with open(tr_file, 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, ensure_ascii=False, indent=2)

print('Turkish offline translations fixed with proper characters!')
