const fs = require('fs');
const path = require('path');

// Folders to combine
const folders = [
    { key: 'chaos_stat', folder: 'mmorpg_affixes/chaos_stat' },
    { key: 'crafted_jewel_unique', folder: 'mmorpg_affixes/crafted_jewel_unique' },
    { key: 'enchant', folder: 'mmorpg_affixes/enchant' },
    { key: 'implicit', folder: 'mmorpg_affixes/implicit' },
    { key: 'jewel', folder: 'mmorpg_affixes/jewel' },
    { key: 'jewel_corruption', folder: 'mmorpg_affixes/jewel_corruption' },
    { key: 'prefix', folder: 'mmorpg_affixes/prefix' },
    { key: 'suffix', folder: 'mmorpg_affixes/suffix' },
    { key: 'tool', folder: 'mmorpg_affixes/tool' },
    { key: 'base_gear_types', folder: 'mmorpg_base_gear_types' },
    { key: 'support_gem', folder: 'mmorpg_support_gem' },
    { key: 'omen', folder: 'mmorpg_omen' },
    { key: 'aura', folder: 'mmorpg_aura' },
    { key: 'mobAffixes', folder: 'mmorpg_mob_affix' },
    { key: 'mobRarity', folder: 'mmorpg_mob_rarity' }
];

console.log('🚀 Combining all JSON files into one...');

const combinedData = {};

folders.forEach(({ key, folder }) => {
    combinedData[key] = {};

    if (fs.existsSync(folder)) {
        const files = fs.readdirSync(folder).filter(file =>
            file.endsWith('.json') && file !== 'index.json'
        );

        console.log(`📂 Processing ${folder}: ${files.length} files`);

        files.forEach(filename => {
            try {
                const filePath = path.join(folder, filename);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                const itemKey = data.id || filename.replace('.json', '');
                combinedData[key][itemKey] = data;
            } catch (error) {
                console.error(`❌ Error reading ${filename}:`, error.message);
            }
        });

        console.log(`✅ ${key}: ${Object.keys(combinedData[key]).length} items loaded`);
    } else {
        console.log(`⚠️ Folder not found: ${folder}`);
    }
});

// Write combined data
fs.writeFileSync('combined-data.json', JSON.stringify(combinedData, null, 2));

const totalItems = Object.values(combinedData).reduce((sum, category) => sum + Object.keys(category).length, 0);
console.log(`🎉 Combined data created! Total items: ${totalItems}`);
console.log('📝 File: combined-data.json');