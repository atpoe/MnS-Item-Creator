// Store all affix data
let affixData = {
    chaos_stat: {},
    crafted_jewel_unique: {},
    enchant: {},
    implicit: {},
    jewel: {},
    jewel_corruption: {},
    prefix: {},
    suffix: {},
    tool: {},
    base_gear_types: {},
    support_gem: {}
};

let currentItemType = '';
let allowMixedTypes = false;

// Configuration for affix categories
const affixCategories = [
    { key: 'chaos_stat', folder: 'mmorpg_affixes/chaos_stat', name: 'Chaos Stats', countId: 'chaosStatCount' },
    { key: 'crafted_jewel_unique', folder: 'mmorpg_affixes/crafted_jewel_unique', name: 'Crafted Jewels', countId: 'craftedJewelCount' },
    { key: 'enchant', folder: 'mmorpg_affixes/enchant', name: 'Enchants', countId: 'enchantCount' },
    { key: 'implicit', folder: 'mmorpg_affixes/implicit', name: 'Implicits', countId: 'implicitCount' },
    { key: 'jewel', folder: 'mmorpg_affixes/jewel', name: 'Jewels', countId: 'jewelCount' },
    { key: 'jewel_corruption', folder: 'mmorpg_affixes/jewel_corruption', name: 'Jewel Corruptions', countId: 'jewelCorruptionCount' },
    { key: 'prefix', folder: 'mmorpg_affixes/prefix', name: 'Prefixes', countId: 'prefixCount' },
    { key: 'suffix', folder: 'mmorpg_affixes/suffix', name: 'Suffixes', countId: 'suffixCount' },
    { key: 'tool', folder: 'mmorpg_affixes/tool', name: 'Tools', countId: 'toolCount' },
    { key: 'base_gear_types', folder: 'mmorpg_base_gear_types', name: 'Gear Types', countId: 'gearTypeCount' },
    { key: 'support_gem', folder: 'mmorpg_support_gem', name: 'Support Gems', countId: 'supportGemCount' }
];

// Update data status
function updateDataStatus(status, message = '') {
    const statusElement = document.getElementById('dataStatus');
    if (!statusElement) return;

    statusElement.className = `data-status ${status}`;

    if (status === 'loading') {
        statusElement.innerHTML = '<strong>🔄 Loading affix data...</strong>';
    } else if (status === 'success') {
        statusElement.innerHTML = `<strong>✅ ${message || 'Affix data loaded successfully!'}</strong>`;
    } else if (status === 'error') {
        statusElement.innerHTML = `<strong>❌ ${message || 'Error loading data'}</strong>`;
    }
}

// Load JSON file
async function loadJSONFile(url) {
    try {
        console.log(`🔄 Loading: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`❌ Failed to load: ${url} (${response.status})`);
            return null;
        }
        const data = await response.json();
        console.log(`✅ Loaded: ${url}`);
        return data;
    } catch (error) {
        console.log(`💥 Error loading ${url}:`, error);
        return null;
    }
}

// Load all affix data
async function loadAllAffixData() {
    updateDataStatus('loading');
    let totalLoaded = 0;
    let totalFiles = 0;

    console.log('🚀 Starting to load affix data...');

    for (const category of affixCategories) {
        console.log(`📂 Loading category: ${category.name}`);

        try {
            // Load index file
            const indexUrl = `${category.folder}/index.json`;
            const indexData = await loadJSONFile(indexUrl);

            if (indexData && indexData.files && Array.isArray(indexData.files)) {
                console.log(`📋 Found ${indexData.files.length} files in ${category.name}`);
                totalFiles += indexData.files.length;

                // Load each file
                for (const filename of indexData.files) {
                    const fileUrl = `${category.folder}/${filename}`;
                    const data = await loadJSONFile(fileUrl);

                    if (data) {
                        // Use filename without .json as key if no id exists
                        const key = data.id || filename.replace('.json', '');
                        affixData[category.key][key] = data;
                        totalLoaded++;
                        console.log(`✅ Stored: ${key} in ${category.key}`);
                    }
                }

                // Update counter immediately after loading each category
                const countElement = document.getElementById(category.countId);
                if (countElement) {
                    const count = Object.keys(affixData[category.key]).length;
                    countElement.textContent = count;
                    console.log(`📊 Updated ${category.name}: ${count} items`);
                }
            } else {
                console.log(`❌ No files found in index for ${category.name}`);
            }
        } catch (error) {
            console.error(`💥 Error loading ${category.name}:`, error);
        }
    }

    console.log(`🎉 Loading complete! Loaded ${totalLoaded}/${totalFiles} files`);
    updateDataStatus('success', `Loaded ${totalLoaded}/${totalFiles} files successfully!`);

    // Debug: Show what was loaded
    console.log('📊 Final data summary:');
    for (const category of affixCategories) {
        const count = Object.keys(affixData[category.key]).length;
        console.log(`${category.name}: ${count} items`);
    }
}

// Create display name with stat info
function createDisplayName(id, data) {
    let displayName = id;
    if (data && data.stat) {
        displayName += ` (${data.stat})`;
    }
    return displayName;
}

// Get available affix types based on current item type and mixed mode
function getAvailableAffixTypes() {
    if (allowMixedTypes) {
        return ['chaos_stat', 'crafted_jewel_unique', 'enchant', 'implicit', 'jewel', 'jewel_corruption', 'prefix', 'suffix', 'tool'];
    }

    switch (currentItemType) {
        case 'gear':
            return ['prefix', 'suffix', 'enchant'];
        case 'jewel':
            return ['jewel', 'jewel_corruption'];
        case 'support_gem':
            return [];
        default:
            return [];
    }
}

// Fill dropdown with data
function fillDropdown(selectElement, data, showStat = true) {
    if (!selectElement) {
        console.error('❌ Select element not found');
        return;
    }

    console.log(`🔄 Filling dropdown with ${Object.keys(data).length} options`);

    // Clear existing options except the first one
    while (selectElement.children.length > 1) {
        selectElement.removeChild(selectElement.lastChild);
    }

    // Add options from data
    Object.entries(data).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = showStat ? createDisplayName(key, value) : key;
        selectElement.appendChild(option);
    });

    console.log(`✅ Dropdown filled with ${selectElement.children.length - 1} options`);
}

// Populate affix select based on available types
function populateAffixSelect(selectElement, allowedTypes = null) {
    if (!selectElement) {
        console.log('❌ Select element not found for affix population');
        return;
    }

    const typesToUse = allowedTypes || getAvailableAffixTypes();
    console.log(`🔄 Populating affix select with types:`, typesToUse);

    // Clear existing options except first
    while (selectElement.children.length > 1) {
        selectElement.removeChild(selectElement.lastChild);
    }

    let totalOptions = 0;
    // Add options from available types
    typesToUse.forEach(type => {
        if (affixData[type]) {
            Object.entries(affixData[type]).forEach(([key, data]) => {
                const option = document.createElement('option');
                option.value = key;
                option.setAttribute('data-type', type);
                option.textContent = createDisplayName(key, data);
                selectElement.appendChild(option);
                totalOptions++;
            });
        }
    });

    console.log(`✅ Added ${totalOptions} options to affix select`);
}

// Select item type
function selectItemType(type) {
    console.log('🎯 Selected item type:', type);
    currentItemType = type;

    // Hide item selection
    const itemSelection = document.getElementById('itemTypeSelection');
    if (itemSelection) itemSelection.style.display = 'none';

    // Show editor content
    const editorContent = document.getElementById('editorContent');
    if (editorContent) editorContent.style.display = 'block';

    // Show appropriate sections
    const gearSections = document.getElementById('gearSections');
    const jewelSections = document.getElementById('jewelSections');
    const supportGemSections = document.getElementById('supportGemSections');

    if (gearSections) gearSections.style.display = type === 'gear' ? 'block' : 'none';
    if (jewelSections) jewelSections.style.display = type === 'jewel' ? 'block' : 'none';
    if (supportGemSections) supportGemSections.style.display = type === 'support_gem' ? 'block' : 'none';

    // Wait a moment for DOM to update, then populate dropdowns
    setTimeout(() => {
        populateDropdownsForItemType();
    }, 100);
}

// Go back to item selection
function goBackToSelection() {
    const editorContent = document.getElementById('editorContent');
    const itemSelection = document.getElementById('itemTypeSelection');

    if (editorContent) editorContent.style.display = 'none';
    if (itemSelection) itemSelection.style.display = 'block';

    currentItemType = '';
}

// Toggle mixed types
function toggleMixedTypes() {
    const checkbox = document.getElementById('allowMixedTypes');
    allowMixedTypes = checkbox ? checkbox.checked : false;
    console.log('🔄 Mixed types:', allowMixedTypes);
    populateDropdownsForItemType();
}

// Populate dropdowns based on current item type
function populateDropdownsForItemType() {
    console.log('🔄 Populating dropdowns for item type:', currentItemType);

    if (currentItemType === 'gear') {
        populateGearDropdowns();
    } else if (currentItemType === 'jewel') {
        populateJewelDropdowns();
    } else if (currentItemType === 'support_gem') {
        populateSupportGemDropdowns();
    }
}

// Populate gear dropdowns
function populateGearDropdowns() {
    console.log('⚙️ Populating gear dropdowns');

    // Gear type dropdown
    const gearTypeSelect = document.getElementById('gtype');
    if (gearTypeSelect && affixData.base_gear_types) {
        fillDropdown(gearTypeSelect, affixData.base_gear_types, false);
    }

    // Implicit dropdown
    const implicitSelect = document.getElementById('implicitId');
    if (implicitSelect && affixData.implicit) {
        fillDropdown(implicitSelect, affixData.implicit);
    }

    // Populate existing affix dropdowns
    const prefixSelects = document.querySelectorAll('.prefix-id, #prefixList select');
    prefixSelects.forEach(select => {
        populateAffixSelect(select, allowMixedTypes ? getAvailableAffixTypes() : ['prefix']);
    });

    const suffixSelects = document.querySelectorAll('.suffix-id, #suffixList select');
    suffixSelects.forEach(select => {
        populateAffixSelect(select, allowMixedTypes ? getAvailableAffixTypes() : ['suffix']);
    });
}

// Populate jewel dropdowns
function populateJewelDropdowns() {
    console.log('💎 Populating jewel dropdowns');

    // Unique jewel dropdown
    const jewelUniqSelect = document.getElementById('jewelUniqId');
    if (jewelUniqSelect && affixData.crafted_jewel_unique) {
        fillDropdown(jewelUniqSelect, affixData.crafted_jewel_unique);
    }

    // Populate existing jewel affix dropdowns
    const jewelAffixSelects = document.querySelectorAll('.jewel-affix-id, #jewelAffixList select');
    jewelAffixSelects.forEach(select => {
        populateAffixSelect(select, allowMixedTypes ? getAvailableAffixTypes() : ['jewel', 'jewel_corruption']);
    });
}

// Populate support gem dropdowns
function populateSupportGemDropdowns() {
    console.log('🔮 Populating support gem dropdowns');

    const supportGemSelect = document.getElementById('supportGemId');
    if (supportGemSelect && affixData.support_gem) {
        fillDropdown(supportGemSelect, affixData.support_gem);
    }
}

// Add prefix
function addPrefix() {
    const prefixList = document.getElementById('prefixList');
    if (!prefixList) return;

    const affixItem = document.createElement('div');
    affixItem.className = 'affix-item';
    affixItem.innerHTML = `
        <select class="prefix-id">
            <option value="">Select Prefix</option>
        </select>
        <input type="number" class="prefix-p" placeholder="Power" value="50000" min="0">
        <select class="prefix-rar">
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
            <option value="mythic" selected>Mythic</option>
        </select>
        <button class="remove-btn" onclick="removeAffix(this)">❌</button>
    `;

    prefixList.appendChild(affixItem);

    // Populate the new dropdown
    const newSelect = affixItem.querySelector('.prefix-id');
    populateAffixSelect(newSelect, allowMixedTypes ? getAvailableAffixTypes() : ['prefix']);
}

// Add suffix
function addSuffix() {
    const suffixList = document.getElementById('suffixList');
    if (!suffixList) return;

    const affixItem = document.createElement('div');
    affixItem.className = 'affix-item';
    affixItem.innerHTML = `
        <select class="suffix-id">
            <option value="">Select Suffix</option>
        </select>
        <input type="number" class="suffix-p" placeholder="Power" value="50000" min="0">
        <select class="suffix-rar">
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
            <option value="mythic" selected>Mythic</option>
        </select>
        <button class="remove-btn" onclick="removeAffix(this)">❌</button>
    `;

    suffixList.appendChild(affixItem);

    // Populate the new dropdown
    const newSelect = affixItem.querySelector('.suffix-id');
    populateAffixSelect(newSelect, allowMixedTypes ? getAvailableAffixTypes() : ['suffix']);
}

// Add jewel affix
function addJewelAffix() {
    const jewelAffixList = document.getElementById('jewelAffixList');
    if (!jewelAffixList) return;

    // Check limit (max 7 affixes for jewels)
    const currentAffixes = jewelAffixList.children.length;
    if (currentAffixes >= 7) {
        alert('Maximum 7 affixes allowed for jewels!');
        return;
    }

    const affixItem = document.createElement('div');
    affixItem.className = 'affix-item';
    affixItem.innerHTML = `
        <select class="jewel-affix-id">
            <option value="">Select Jewel Affix</option>
        </select>
        <input type="number" class="jewel-affix-p" placeholder="Power" value="8" min="0">
        <select class="jewel-affix-rar">
            <option value="common" selected>Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
            <option value="mythic">Mythic</option>
        </select>
        <button class="remove-btn" onclick="removeAffix(this)">❌</button>
    `;

    jewelAffixList.appendChild(affixItem);

    // Populate the new dropdown
    const newSelect = affixItem.querySelector('.jewel-affix-id');
    populateAffixSelect(newSelect, allowMixedTypes ? getAvailableAffixTypes() : ['jewel', 'jewel_corruption']);
}

// Remove affix
function removeAffix(button) {
    button.parentElement.remove();
}

// Generate JSON based on current item type
function generateJSON() {
    let json = {};

    if (currentItemType === 'gear') {
        json = generateGearJSON();
    } else if (currentItemType === 'jewel') {
        json = generateJewelJSON();
    } else if (currentItemType === 'support_gem') {
        json = generateSupportGemJSON();
    }

    console.log('✅ Generated JSON:', json);

    // Display JSON in output
    const output = document.getElementById('output');
    if (output) {
        output.textContent = JSON.stringify(json, null, 2);
        output.style.display = 'block';

        // Scroll to output
        output.scrollIntoView({ behavior: 'smooth' });
    }
}

// Generate gear JSON
function generateGearJSON() {
    const json = {
        baseStats: {
            p: parseInt(document.getElementById('baseStatsP')?.value || 10000)
        },
        affixes: {
            suf: [],
            pre: [],
            cor: []
        },
        sockets: {
            so: [],
            sl: 1,
            rw: "",
            rp: 0
        },
        rar: document.getElementById('rar')?.value || "mythic",
        lvl: parseInt(document.getElementById('lvl')?.value || 1),
        gtype: document.getElementById('gtype')?.value || "necklace"
    };

    // Add implicit if selected
    const implicitId = document.getElementById('implicitId')?.value;
    const implicitP = document.getElementById('implicitP')?.value;
    if (implicitId) {
        json.imp = {
            p: parseInt(implicitP || 10000),
            imp: implicitId
        };
    }

    // Collect prefixes
    const prefixItems = document.querySelectorAll('#prefixList .affix-item');
    prefixItems.forEach(item => {
        const id = item.querySelector('.prefix-id')?.value;
        const p = item.querySelector('.prefix-p')?.value;
        const rar = item.querySelector('.prefix-rar')?.value;

        if (id) {
            json.affixes.pre.push({
                p: parseInt(p || 50000),
                id: id,
                rar: rar || "mythic",
                ty: "prefix"
            });
        }
    });

    // Collect suffixes
    const suffixItems = document.querySelectorAll('#suffixList .affix-item');
    suffixItems.forEach(item => {
        const id = item.querySelector('.suffix-id')?.value;
        const p = item.querySelector('.suffix-p')?.value;
        const rar = item.querySelector('.suffix-rar')?.value;

        if (id) {
            json.affixes.suf.push({
                p: parseInt(p || 50000),
                id: id,
                rar: rar || "mythic",
                ty: "suffix"
            });
        }
    });

    return json;
}

// Generate jewel JSON
function generateJewelJSON() {
    const json = {
        uniq: {
            t: 0,
            id: document.getElementById('jewelUniqId')?.value || "",
            perc: parseInt(document.getElementById('jewelUniqPerc')?.value || 0)
        },
        cor: [],
        affixes: [],
        auraStats: [],
        style: document.getElementById('jewelStyle')?.value || "int",
        lvl: parseInt(document.getElementById('jewelLvl')?.value || 1),
        rar: document.getElementById('jewelRar')?.value || "uncommon"
    };

    // Collect jewel affixes
    const jewelAffixItems = document.querySelectorAll('#jewelAffixList .affix-item');
    jewelAffixItems.forEach(item => {
        const id = item.querySelector('.jewel-affix-id')?.value;
        const p = item.querySelector('.jewel-affix-p')?.value;
        const rar = item.querySelector('.jewel-affix-rar')?.value;

        if (id) {
            json.affixes.push({
                p: parseInt(p || 8),
                id: id,
                rar: rar || "common",
                ty: "jewel"
            });
        }
    });

    return json;
}

// Generate support gem JSON
function generateSupportGemJSON() {
    const json = {
        id: document.getElementById('supportGemId')?.value || "",
        type: "SUPPORT",
        perc: parseInt(document.getElementById('supportGemPerc')?.value || 50000),
        rar: document.getElementById('supportGemRar')?.value || "legendary",
        links: parseInt(document.getElementById('supportGemLinks')?.value || 1)
    };

    return json;
}

// Copy JSON to clipboard
function copyToClipboard() {
    const output = document.getElementById('output');
    if (!output || !output.textContent) {
        alert('No JSON to copy! Generate JSON first.');
        return;
    }

    navigator.clipboard.writeText(output.textContent).then(function() {
        alert('JSON copied to clipboard!');
    }, function(err) {
        console.error('Could not copy text: ', err);
        alert('Failed to copy to clipboard');
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Page loaded, starting data load...');
    loadAllAffixData();
});