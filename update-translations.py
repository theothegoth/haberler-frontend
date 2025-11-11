import json

# Read Turkish translations
with open('src/locales/tr.json', 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

# Add blocked users translations
tr_data['settings']['tabs']['blocked'] = 'Engellenen Kullanıcılar'
tr_data['settings']['blocked'] = {
    "title": "Engellenen Kullanıcılar",
    "description": "Engellediğiniz kullanıcıları buradan yönetebilirsiniz",
    "userCount": "kullanıcı",
    "noBlocked": "Henüz hiç kullanıcı engellemediniz",
    "noBlockedMessage": "Engellemek istediğiniz kullanıcıların profillerinden veya içeriklerinden engelleme yapabilirsiniz",
    "unblock": "Engeli Kaldır",
    "unblocking": "Engel kaldırılıyor...",
    "blockedDate": "Engellenme tarihi",
    "confirmUnblock": "Bu kullanıcının engelini kaldırmak istediğinizden emin misiniz?",
    "unblockSuccess": "Kullanıcının engeli kaldırıldı",
    "unblockError": "Engel kaldırılırken bir hata oluştu",
    "infoTitle": "Engelleme hakkında",
    "info1": "Engellediğiniz kullanıcıların içerikleri haber akışınızda görünmez",
    "info2": "Engellediğiniz kullanıcıların yorumları gizlenir",
    "info3": "Engelleme işlemi gizlidir, karşı taraf haberdar olmaz",
    "info4": "İstediğiniz zaman engeli kaldırabilirsiniz"
}

# Write back Turkish translations
with open('src/locales/tr.json', 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, ensure_ascii=False, indent=2)

print("Turkish translations updated successfully!")
