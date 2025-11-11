import json

# Read the manifest file
with open('public/manifest.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

# Update manifest with enhanced PWA configuration
manifest['description'] = 'YouTube kanallarından haber takibi yapın, kendiniz haber yazın ve topluluğa katılın'
manifest['start_url'] = '/'
manifest['scope'] = '/'
manifest['orientation'] = 'portrait-primary'
manifest['theme_color'] = '#3b82f6'
manifest['categories'] = ['news', 'social']
manifest['lang'] = 'tr'
manifest['dir'] = 'ltr'

# Update icons with purpose
for icon in manifest['icons']:
    if icon['src'] in ['logo192.png', 'logo512.png']:
        icon['purpose'] = 'any maskable'

# Write back
with open('public/manifest.json', 'w', encoding='utf-8') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)

print('Manifest updated successfully!')
