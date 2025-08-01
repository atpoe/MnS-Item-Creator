const fs = require('fs');
const path = require('path');

// Folders to scan
const folders = [
    'mmorpg_affixes/chaos_stat',
    'mmorpg_affixes/crafted_jewel_unique',
    'mmorpg_affixes/enchant',
    'mmorpg_affixes/implicit',
    'mmorpg_affixes/jewel',
    'mmorpg_affixes/jewel_corruption',
    'mmorpg_affixes/prefix',
    'mmorpg_affixes/suffix',
    'mmorpg_affixes/tool',
    'mmorpg_base_gear_types',
    'mmorpg_support_gem'
];

// Function to get all JSON files in a directory
function getJSONFiles(folderPath) {
    try {
        const files = fs.readdirSync(folderPath);
        return files.filter(file => file.endsWith('.json') && file !== 'index.json');
    } catch (error) {
        console.log(`❌ Folder not found: ${folderPath}`);
        return [];
    }
}

// Generate index files for all folders
function generateIndexFiles() {
    console.log('🚀 Generating index files...\n');
    
    folders.forEach(folder => {
        const jsonFiles = getJSONFiles(folder);
        
        if (jsonFiles.length > 0) {
            const indexData = {
                files: jsonFiles
            };
            
            const indexPath = path.join(folder, 'index.json');
            fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
            
            console.log(`✅ Created ${indexPath} with ${jsonFiles.length} files:`);
            jsonFiles.forEach(file => console.log(`   - ${file}`));
            console.log('');
        } else {
            console.log(`⚠️  No JSON files found in ${folder}`);
        }
    });
    
    console.log('🎉 Index file generation complete!');
}

// Run the script
generateIndexFiles();