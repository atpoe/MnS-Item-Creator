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
    support_gem: {},
    omen: {},
    aura: {}
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
    { key: 'base_gear_types', folder: 'mmorpg_affixes/base_gear_types', name: 'Gear Types', countId: 'gearTypeCount' },
    { key: 'support_gem', folder: 'mmorpg_affixes/support_gem', name: 'Support Gems', countId: 'supportGemCount' },
    { key: 'omen', folder: 'mmorpg_affixes/omen', name: 'Omens', countId: 'omenCount' },
    { key: 'aura', folder: 'mmorpg_aura', name: 'Auras', countId: 'auraCount' }
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

// Load all affix data from combined file (FASTER!)
async function loadAllAffixData() {
    updateDataStatus('loading');
    console.log('🚀 Loading combined affix data...');

    try {
        const response = await fetch('combined-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const combinedData = await response.json();
        console.log('✅ Combined data loaded successfully');

        // Copy data to affixData
        affixData = { ...combinedData };

        // Update counters
        let totalLoaded = 0;
        for (const category of affixCategories) {
            const count = Object.keys(affixData[category.key] || {}).length;
            const countElement = document.getElementById(category.countId);
            if (countElement) {
                countElement.textContent = count;
            }
            totalLoaded += count;
            console.log(`📊 ${category.name}: ${count} items`);
        }

        updateDataStatus('success', `Loaded ${totalLoaded} files in one request!`);
        console.log(`🎉 Total items loaded: ${totalLoaded}`);

    } catch (error) {
        console.error('💥 Error loading combined data:', error);
        updateDataStatus('error', 'Failed to load affix data');

        // Fallback to individual file loading
        console.log('🔄 Falling back to individual file loading...');
        await loadAllAffixDataFallback();
    }
}

// Fallback: Load individual files (slower but works if combined-data.json doesn't exist)
async function loadAllAffixDataFallback() {
    let totalLoaded = 0;
    let totalFiles = 0;

    console.log('🚀 Starting fallback data loading...');

    for (const category of affixCategories) {
        console.log(`📂 Loading category: ${category.name}`);

        try {
            const indexUrl = `${category.folder}/index.json`;
            const response = await fetch(indexUrl);
            if (!response.ok) continue;

            const indexData = await response.json();

            if (indexData && indexData.files && Array.isArray(indexData.files)) {
                totalFiles += indexData.files.length;

                for (const filename of indexData.files) {
                    const fileUrl = `${category.folder}/${filename}`;
                    try {
                        const fileResponse = await fetch(fileUrl);
                        if (fileResponse.ok) {
                            const data = await fileResponse.json();
                            const key = data.id || filename.replace('.json', '');
                            affixData[category.key][key] = data;
                            totalLoaded++;
                        }
                    } catch (fileError) {
                        console.log(`❌ Failed to load: ${fileUrl}`);
                    }
                }

                const countElement = document.getElementById(category.countId);
                if (countElement) {
                    const count = Object.keys(affixData[category.key]).length;
                    countElement.textContent = count;
                }
            }
        } catch (error) {
            console.error(`💥 Error loading ${category.name}:`, error);
        }
    }

    updateDataStatus('success', `Loaded ${totalLoaded}/${totalFiles} files successfully!`);
}

// Load JSON from import textarea
function loadFromJson() {
    const importJsonTextarea = document.getElementById('importJson');
    if (!importJsonTextarea) {
        alert('Import textarea not found!');
        return;
    }

    const jsonText = importJsonTextarea.value.trim();
    if (!jsonText) {
        alert('Please paste some JSON first!');
        return;
    }

    try {
        const json = JSON.parse(jsonText);
        console.log('📥 Importing JSON:', json);

        let detectedItemType = '';
        let needsMixedTypes = false;

        // Detect item type and check for mixed affix types
        if (json.gtype || json.baseStats || (json.affixes && json.affixes.pre)) {
            // This is gear
            detectedItemType = 'gear';

            // Check if gear has non-standard affixes
            if (json.affixes) {
                const gearAffixTypes = ['prefix', 'suffix', 'enchant'];

                // Check prefixes
                if (json.affixes.pre) {
                    json.affixes.pre.forEach(affix => {
                        if (affix.ty && !gearAffixTypes.includes(affix.ty)) {
                            needsMixedTypes = true;
                        }
                    });
                }

                // Check suffixes
                if (json.affixes.suf) {
                    json.affixes.suf.forEach(affix => {
                        if (affix.ty && !gearAffixTypes.includes(affix.ty)) {
                            needsMixedTypes = true;
                        }
                    });
                }

                // Check for jewel corruptions or other types
                if (json.affixes.cor && json.affixes.cor.length > 0) {
                    needsMixedTypes = true;
                }
            }

        } else if (json.uniq || json.style || (json.affixes && Array.isArray(json.affixes))) {
            // This is a jewel
            detectedItemType = 'jewel';

            // Check if jewel has non-standard affixes
            if (json.affixes && Array.isArray(json.affixes)) {
                const jewelAffixTypes = ['jewel', 'jewel_corruption'];
                json.affixes.forEach(affix => {
                    if (affix.ty && !jewelAffixTypes.includes(affix.ty)) {
                        needsMixedTypes = true;
                    }
                });
            }

        } else if (json.type === 'SUPPORT' || (json.links !== undefined && json.id && !json.type)) {
            // This is a support gem
            detectedItemType = 'support_gem';
        } else if (json.type === 'AURA' || (json.id && json.perc && json.links && !json.aff)) {
            // This is an aura
            detectedItemType = 'aura';
        } else if (json.aff && Array.isArray(json.aff) && json.id && json.rar) {
            // This is an omen
            detectedItemType = 'omen';

            // Check if omen has non-standard affixes
            const omenAffixTypes = ['chaos_stat', 'prefix', 'suffix', 'enchant'];
            json.aff.forEach(affix => {
                if (affix.ty && !omenAffixTypes.includes(affix.ty)) {
                    needsMixedTypes = true;
                }
            });
        } else {
            alert('Could not detect item type from JSON. Please check the format.');
            return;
        }

        // Enable mixed types FIRST if needed
        if (needsMixedTypes) {
            const mixedTypesCheckbox = document.getElementById('allowMixedTypes');
            if (mixedTypesCheckbox) {
                mixedTypesCheckbox.checked = true;
                allowMixedTypes = true;
                // Trigger the change event to update dropdowns
                toggleMixedTypes(true);
                console.log('🔄 Auto-enabled mixed types due to imported affix types');
            }
        }

        // THEN select item type (this will populate dropdowns with correct types)
        selectItemType(detectedItemType);

        // Load the actual data after a short delay
        setTimeout(() => {
            if (detectedItemType === 'gear') {
                loadGearFromJson(json);
            } else if (detectedItemType === 'jewel') {
                loadJewelFromJson(json);
            } else if (detectedItemType === 'support_gem') {
                loadSupportGemFromJson(json);
            } else if (detectedItemType === 'omen') {
                loadOmenFromJson(json);
            } else if (detectedItemType === 'aura') {
                loadAuraFromJson(json);
            }
        }, 200);

        // Clear import textarea
        importJsonTextarea.value = '';

        const message = needsMixedTypes ?
            '✅ Item loaded successfully! Mixed types automatically enabled due to imported affix types.' :
            '✅ Item loaded successfully for editing!';
        alert(message);

    } catch (error) {
        console.error('💥 Error parsing JSON:', error);
        alert('Invalid JSON format! Please check your input.');
    }
}

// Clear import JSON textarea
function clearImportJson() {
    const importJsonTextarea = document.getElementById('importJson');
    if (importJsonTextarea) {
        importJsonTextarea.value = '';
    }
}

// Load gear data from JSON
function loadGearFromJson(json) {
    // Basic properties
    if (json.rar) document.getElementById('rar').value = json.rar;
    if (json.lvl) document.getElementById('lvl').value = json.lvl;
    if (json.gtype) document.getElementById('gtype').value = json.gtype;

    // Base stats
    if (json.baseStats && json.baseStats.p) {
        document.getElementById('baseStatsP').value = json.baseStats.p;
    }

    // Implicit
    if (json.imp) {
        if (json.imp.imp) document.getElementById('implicitId').value = json.imp.imp;
        if (json.imp.p) document.getElementById('implicitP').value = json.imp.p;
    }

    // Enchantment
    if (json.ench) {
        if (json.ench.en) document.getElementById('enchantmentId').value = json.ench.en;
        if (json.ench.rar) document.getElementById('enchantmentRar').value = json.ench.rar;
    }

    // Sockets
    if (json.sockets) {
        if (json.sockets.sl) document.getElementById('socketLimit').value = json.sockets.sl;
        if (json.sockets.rw) document.getElementById('runeword').value = json.sockets.rw;
        if (json.sockets.rp) document.getElementById('runewordPower').value = json.sockets.rp;
    }

    // Clear existing affixes
    document.getElementById('prefixList').innerHTML = '';
    document.getElementById('suffixList').innerHTML = '';

    // Load prefixes
    if (json.affixes && json.affixes.pre) {
        json.affixes.pre.forEach(affix => {
            addPrefix();
            const prefixItems = document.querySelectorAll('#prefixList .affix-item');
            const lastItem = prefixItems[prefixItems.length - 1];

            lastItem.querySelector('.prefix-id').value = affix.id;
            lastItem.querySelector('.prefix-p').value = affix.p;
            lastItem.querySelector('.prefix-rar').value = affix.rar;
        });
    }

    // Load suffixes
    if (json.affixes && json.affixes.suf) {
        json.affixes.suf.forEach(affix => {
            addSuffix();
            const suffixItems = document.querySelectorAll('#suffixList .affix-item');
            const lastItem = suffixItems[suffixItems.length - 1];

            lastItem.querySelector('.suffix-id').value = affix.id;
            lastItem.querySelector('.suffix-p').value = affix.p;
            lastItem.querySelector('.suffix-rar').value = affix.rar;
        });
    }
}

// Load jewel data from JSON
function loadJewelFromJson(json) {
    // Basic properties
    if (json.rar) document.getElementById('jewelRar').value = json.rar;
    if (json.lvl) document.getElementById('jewelLvl').value = json.lvl;
    if (json.style) document.getElementById('jewelStyle').value = json.style;

    // Unique jewel
    if (json.uniq) {
        if (json.uniq.id) document.getElementById('jewelUniqId').value = json.uniq.id;
        if (json.uniq.perc) document.getElementById('jewelUniqPerc').value = json.uniq.perc;
    }

    // Clear existing affixes
    document.getElementById('jewelAffixList').innerHTML = '';

    // Load jewel affixes
    if (json.affixes && Array.isArray(json.affixes)) {
        json.affixes.forEach(affix => {
            addJewelAffix();
            const jewelAffixItems = document.querySelectorAll('#jewelAffixList .affix-item');
            const lastItem = jewelAffixItems[jewelAffixItems.length - 1];

            lastItem.querySelector('.jewel-affix-id').value = affix.id;
            lastItem.querySelector('.jewel-affix-p').value = affix.p;
            lastItem.querySelector('.jewel-affix-rar').value = affix.rar;
        });
    }
}

// Load support gem data from JSON
function loadSupportGemFromJson(json) {
    if (json.id) document.getElementById('supportGemId').value = json.id;
    if (json.perc) document.getElementById('supportGemPerc').value = json.perc;
    if (json.rar) document.getElementById('supportGemRar').value = json.rar;
    if (json.links) document.getElementById('supportGemLinks').value = json.links;
}

// Load aura data from JSON
function loadAuraFromJson(json) {
    if (json.id) document.getElementById('auraId').value = json.id;
    if (json.perc) document.getElementById('auraPerc').value = json.perc;
    if (json.rar) document.getElementById('auraRar').value = json.rar;
    if (json.links) document.getElementById('auraLinks').value = json.links;
}

// Load omen data from JSON
function loadOmenFromJson(json) {
    if (json.id) document.getElementById('omenId').value = json.id;
    if (json.lvl) document.getElementById('omenLvl').value = json.lvl;
    if (json.rar) document.getElementById('omenRar').value = json.rar;

    // Clear existing affixes
    document.getElementById('omenAffixList').innerHTML = '';

    // Load omen affixes
    if (json.aff && Array.isArray(json.aff)) {
        json.aff.forEach(affix => {
            addOmenAffix();
            const omenAffixItems = document.querySelectorAll('#omenAffixList .affix-item');
            const lastItem = omenAffixItems[omenAffixItems.length - 1];

            if (affix.ty) lastItem.querySelector('.omen-affix-type').value = affix.ty;
            if (affix.id) lastItem.querySelector('.omen-affix-id').value = affix.id;
            if (affix.p) lastItem.querySelector('.omen-affix-p').value = affix.p;
            if (affix.rar) lastItem.querySelector('.omen-affix-rar').value = affix.rar;

            // Update the affix dropdown after setting the type
            if (affix.ty) {
                updateOmenAffixDropdown(lastItem.querySelector('.omen-affix-type'));
                // Set the ID again after dropdown is populated
                setTimeout(() => {
                    if (affix.id) lastItem.querySelector('.omen-affix-id').value = affix.id;
                }, 50);
            }
        });
    }
}

// Create display name with stat info
function createDisplayName(id, data) {
    let displayName = id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (data && data.stats && data.stats.length > 0 && data.stats[0].stat) {
        displayName += ` (${data.stats[0].stat})`;
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
        case 'omen':
            return ['chaos_stat', 'prefix', 'suffix', 'enchant'];
        case 'aura':
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
}

// Populate affix select based on available types
function populateAffixSelect(selectElement, allowedTypes = null) {
    if (!selectElement) return;

    const typesToUse = allowedTypes || getAvailableAffixTypes();

    // Clear existing options except first
    while (selectElement.children.length > 1) {
        selectElement.removeChild(selectElement.lastChild);
    }

    // Add options from available types
    typesToUse.forEach(type => {
        if (affixData[type]) {
            Object.entries(affixData[type]).forEach(([key, data]) => {
                const option = document.createElement('option');
                option.value = key;
                option.setAttribute('data-type', type);
                option.textContent = createDisplayName(key, data);
                selectElement.appendChild(option);
            });
        }
    });
}

// Select item type and show appropriate sections
function selectItemType(type) {
    currentItemType = type;
    console.log('🎯 Selected item type:', type);

    // Hide item type selection
    document.getElementById('itemTypeSelection').style.display = 'none';

    // Show editor content
    document.getElementById('editorContent').style.display = 'block';

    // Hide all sections first
    document.getElementById('gearSections').style.display = 'none';
    document.getElementById('jewelSections').style.display = 'none';
    document.getElementById('supportGemSections').style.display = 'none';
    document.getElementById('omenSections').style.display = 'none';
    document.getElementById('auraSections').style.display = 'none';

    // Show appropriate sections
    if (type === 'gear') {
        document.getElementById('gearSections').style.display = 'block';
        populateGearDropdowns();
    } else if (type === 'jewel') {
        document.getElementById('jewelSections').style.display = 'block';
        populateJewelDropdowns();
    } else if (type === 'support_gem') {
        document.getElementById('supportGemSections').style.display = 'block';
        populateSupportGemDropdowns();
    } else if (type === 'omen') {
        document.getElementById('omenSections').style.display = 'block';
        populateOmenDropdowns();
    } else if (type === 'aura') {
        document.getElementById('auraSections').style.display = 'block';
        populateAuraDropdowns();
    }

    // Populate dropdowns after a short delay to ensure DOM is ready
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
function toggleMixedTypes(forceValue = null) {
    const checkbox = document.getElementById('allowMixedTypes');

    if (forceValue !== null) {
        // Force a specific value
        allowMixedTypes = forceValue;
        if (checkbox) checkbox.checked = forceValue;
    } else {
        // Use checkbox state
        allowMixedTypes = checkbox ? checkbox.checked : false;
    }

    console.log('🔄 Mixed types:', allowMixedTypes);
    populateDropdownsForItemType();
}

// Populate dropdowns based on current item type
function populateDropdownsForItemType() {
    if (currentItemType === 'gear') {
        populateGearDropdowns();
        // Repopulate existing affix dropdowns
        document.querySelectorAll('#prefixList .prefix-id').forEach(select => {
            populateAffixSelect(select, allowMixedTypes ? getAvailableAffixTypes() : ['prefix']);
        });
        document.querySelectorAll('#suffixList .suffix-id').forEach(select => {
            populateAffixSelect(select, allowMixedTypes ? getAvailableAffixTypes() : ['suffix']);
        });
    } else if (currentItemType === 'jewel') {
        populateJewelDropdowns();
        // Populate existing jewel affix dropdowns
        document.querySelectorAll('.jewel-affix-id').forEach(select => {
            populateAffixSelect(select, allowMixedTypes ? getAvailableAffixTypes() : ['jewel', 'jewel_corruption']);
        });
    } else if (currentItemType === 'support_gem') {
        populateSupportGemDropdowns();
    } else if (currentItemType === 'omen') {
        populateOmenDropdowns();
        // Populate existing omen affix dropdowns
        document.querySelectorAll('.omen-affix-id').forEach(select => {
            populateAffixSelect(select, allowMixedTypes ? getAvailableAffixTypes() : ['chaos_stat', 'prefix', 'suffix', 'enchant']);
        });
    } else if (currentItemType === 'aura') {
        populateAuraDropdowns();
    }
}

// Populate gear dropdowns
function populateGearDropdowns() {
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

    // Enchantment dropdown
    const enchantmentSelect = document.getElementById('enchantmentId');
    if (enchantmentSelect && affixData.enchant) {
        fillDropdown(enchantmentSelect, affixData.enchant);
    }

    // Populate existing affix dropdowns
    document.querySelectorAll('.prefix-id').forEach(select => {
        populateAffixSelect(select, allowMixedTypes ? getAvailableAffixTypes() : ['prefix']);
    });

    document.querySelectorAll('.suffix-id').forEach(select => {
        populateAffixSelect(select, allowMixedTypes ? getAvailableAffixTypes() : ['suffix']);
    });
}

// Populate jewel dropdowns
function populateJewelDropdowns() {
    // Unique jewel dropdown
    const jewelUniqSelect = document.getElementById('jewelUniqId');
    if (jewelUniqSelect && affixData.crafted_jewel_unique) {
        fillDropdown(jewelUniqSelect, affixData.crafted_jewel_unique);
    }

    // Populate existing jewel affix dropdowns
    document.querySelectorAll('.jewel-affix-id').forEach(select => {
        populateAffixSelect(select, allowMixedTypes ? getAvailableAffixTypes() : ['jewel', 'jewel_corruption']);
    });
}

// Populate support gem dropdowns
function populateSupportGemDropdowns() {
    const supportGemSelect = document.getElementById('supportGemId');
    if (supportGemSelect && affixData.support_gem) {
        fillDropdown(supportGemSelect, affixData.support_gem);
    }
}

// Populate omen dropdowns
function populateOmenDropdowns() {
    const omenIdSelect = document.getElementById('omenId');
    if (omenIdSelect && affixData.omen) {
        fillDropdown(omenIdSelect, affixData.omen, false);
    }
}

// Populate aura dropdowns - Fixed to show stats
function populateAuraDropdowns() {
    const auraIdSelect = document.getElementById('auraId');
    if (auraIdSelect && affixData.aura) {
        fillDropdown(auraIdSelect, affixData.aura, true); // Changed from false to true
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
        <input type="number" class="prefix-p" placeholder="Power" value="100" min="0" max="1000">
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
        <input type="number" class="suffix-p" placeholder="Power" value="100" min="0" max="1000">
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

// Add these missing functions to your script.js file:

function addJewelAffix() {
    const affixList = document.getElementById('jewelAffixList');
    const affixItem = document.createElement('div');
    affixItem.className = 'affix-item';

    affixItem.innerHTML = `
        <select class="jewel-affix-type" onchange="updateJewelAffixDropdown(this)">
            <option value="">Select Type</option>
            ${getAvailableAffixTypes().map(type => `<option value="${type}">${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>`).join('')}
        </select>
        <select class="jewel-affix-id">
            <option value="">Select Affix</option>
        </select>
        <input type="number" class="jewel-affix-p" placeholder="Percent" value="100" min="0" max="1000">
        <select class="jewel-affix-rar">
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
            <option value="mythic" selected>Mythic</option>
        </select>
        <button class="remove-btn" onclick="removeAffix(this)">❌</button>
    `;

    affixList.appendChild(affixItem);
}

function updateJewelAffixDropdown(typeSelect) {
    const affixSelect = typeSelect.parentNode.querySelector('.jewel-affix-id');
    const selectedType = typeSelect.value;

    affixSelect.innerHTML = '<option value="">Select Affix</option>';

    if (selectedType && affixData[selectedType]) {
        Object.keys(affixData[selectedType]).forEach(id => {
            const data = affixData[selectedType][id];
            const displayName = createDisplayName(id, data);
            affixSelect.innerHTML += `<option value="${id}">${displayName}</option>`;
        });
    }
}

function generateNBT() {
    const output = document.getElementById('output');
    let nbtData = {};

    try {
        if (currentItemType === 'gear') {
            nbtData = generateGearNBT();
        } else if (currentItemType === 'jewel') {
            nbtData = generateJewelNBT();
        } else if (currentItemType === 'support_gem') {
            nbtData = generateSupportGemNBT();
        } else if (currentItemType === 'aura') {
            nbtData = generateAuraNBT();
        } else if (currentItemType === 'omen') {
            nbtData = generateOmenNBT();
        }

        const jsonOutput = JSON.stringify(nbtData, null, 2);
        output.innerHTML = `<pre>${jsonOutput}</pre>`;

    } catch (error) {
        console.error('Error generating NBT:', error);
        output.innerHTML = `<div style="color: red;">Error generating NBT: ${error.message}</div>`;
    }
}

// Generate Gear NBT
function generateGearNBT() {
    const nbt = {
        baseStats: {},
        imp: {},
        affixes: { suf: [], pre: [], cor: [] },
        sockets: { so: [], sl: 0, rw: "", rp: 0 },
        rar: document.getElementById('rar')?.value || 'common',
        lvl: parseInt(document.getElementById('lvl')?.value || 1),
        gtype: document.getElementById('gtype')?.value || ''
    };

    // Base Stats
    const baseStatsP = parseInt(document.getElementById('baseStatsP')?.value || 0);
    if (baseStatsP > 0) {
        nbt.baseStats.p = baseStatsP;
    }

    // Implicit
    const implicitId = document.getElementById('implicitId')?.value;
    const implicitP = parseInt(document.getElementById('implicitP')?.value || 0);
    if (implicitId) {
        nbt.imp.imp = implicitId;
        nbt.imp.p = implicitP;
    }

    // Enchantment - only add if there's an enchantment
    const enchantmentId = document.getElementById('enchantmentId')?.value;
    const enchantmentRar = document.getElementById('enchantmentRar')?.value;
    if (enchantmentId) {
        nbt.ench = {
            en: enchantmentId,
            rar: enchantmentRar || 'common'
        };
    }

    // Sockets
    const socketLimit = parseInt(document.getElementById('socketLimit')?.value || 0);
    const runeword = document.getElementById('runeword')?.value || '';
    const runewordPower = parseInt(document.getElementById('runewordPower')?.value || 0);

    nbt.sockets.sl = socketLimit;
    if (runeword) nbt.sockets.rw = runeword;
    if (runewordPower > 0) nbt.sockets.rp = runewordPower;

    // Prefixes
    document.querySelectorAll('#prefixList .affix-item').forEach(item => {
        const type = item.querySelector('.prefix-type')?.value || 'prefix';
        const id = item.querySelector('.prefix-id')?.value;
        const p = parseInt(item.querySelector('.prefix-p')?.value || 100);
        const rar = item.querySelector('.prefix-rar')?.value || 'common';

        if (id) {
            nbt.affixes.pre.push({ p, id, rar, ty: type });
        }
    });

    // Suffixes
    document.querySelectorAll('#suffixList .affix-item').forEach(item => {
        const type = item.querySelector('.suffix-type')?.value || 'suffix';
        const id = item.querySelector('.suffix-id')?.value;
        const p = parseInt(item.querySelector('.suffix-p')?.value || 100);
        const rar = item.querySelector('.suffix-rar')?.value || 'common';

        if (id) {
            nbt.affixes.suf.push({ p, id, rar, ty: type });
        }
    });

    return nbt;
}

function generateJewelNBT() {
    const nbt = {
        cor: [],
        affixes: [],
        auraStats: [],
        style: document.getElementById('jewelStyle')?.value || 'str',
        lvl: parseInt(document.getElementById('jewelLvl')?.value || 1),
        rar: document.getElementById('jewelRar')?.value || 'mythic'
    };

    // Only add unique if selected
    const uniqId = document.getElementById('jewelUniqId')?.value;
    const uniqPerc = parseInt(document.getElementById('jewelUniqPerc')?.value || 0);
    if (uniqId) {
        nbt.uniq = {
            t: 0,
            id: uniqId,
            perc: uniqPerc
        };
    }

    // Add jewel affixes
    document.querySelectorAll('#jewelAffixList .affix-item').forEach(item => {
        const type = item.querySelector('.jewel-affix-type')?.value;
        const id = item.querySelector('.jewel-affix-id')?.value;
        const p = parseInt(item.querySelector('.jewel-affix-p')?.value || 100);
        const rar = item.querySelector('.jewel-affix-rar')?.value;

        if (id) {
            nbt.affixes.push({ p, id, rar, ty: type || 'jewel' });
        }
    });

    return nbt;
}

function generateSupportGemNBT() {
    return {
        type: 'SUPPORT',
        id: document.getElementById('supportGemId')?.value || '',
        perc: parseInt(document.getElementById('supportGemPerc')?.value || 100),
        rar: document.getElementById('supportGemRar')?.value || 'mythic',
        links: parseInt(document.getElementById('supportGemLinks')?.value || 0)
    };
}

function generateAuraNBT() {
    return {
        type: 'AURA',
        id: document.getElementById('auraId')?.value || '',
        perc: parseInt(document.getElementById('auraPerc')?.value || 100),
        rar: document.getElementById('auraRar')?.value || 'mythic',
        links: parseInt(document.getElementById('auraLinks')?.value || 0)
    };
}

function generateOmenNBT() {
    const nbt = {
        id: document.getElementById('omenId')?.value || '',
        lvl: parseInt(document.getElementById('omenLvl')?.value || 1),
        rar: document.getElementById('omenRar')?.value || 'common',
        rarities: {
            "RUNED": 1,
            "NORMAL": 1,
            "UNIQUE": 1
        },
        slot_req: [],
        aff: []
    };

    // Add omen affixes
    document.querySelectorAll('#omenAffixList .affix-item').forEach(item => {
        const type = item.querySelector('.omen-affix-type')?.value;
        const id = item.querySelector('.omen-affix-id')?.value;
        const p = parseInt(item.querySelector('.omen-affix-p')?.value || 100);
        const rar = item.querySelector('.omen-affix-rar')?.value;

        if (id) {
            nbt.aff.push({ p, id, rar, ty: type });
        }
    });

    return nbt;
}

function removeAffix(button) {
    button.parentNode.remove();
}

function copyToClipboard() {
    const output = document.getElementById('output');
    const text = output.textContent;

    if (text && text !== 'Generated NBT will appear here...') {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ NBT data copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('✅ NBT data copied to clipboard!');
        });
    } else {
        alert('⚠️ No NBT data to copy. Generate an item first!');
    }
}

function addOmenAffix() {
    const affixList = document.getElementById('omenAffixList');
    const affixItem = document.createElement('div');
    affixItem.className = 'affix-item';

    affixItem.innerHTML = `
        <select class="omen-affix-type" onchange="updateOmenAffixDropdown(this)">
            <option value="">Select Type</option>
            ${getAvailableAffixTypes().map(type => `<option value="${type}">${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>`).join('')}
        </select>
        <select class="omen-affix-id">
            <option value="">Select Affix</option>
        </select>
        <input type="number" class="omen-affix-p" placeholder="Power" value="100" min="0" max="1000">
        <select class="omen-affix-rar">
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
            <option value="mythic" selected>Mythic</option>
        </select>
        <button class="remove-btn" onclick="removeAffix(this)">❌</button>
    `;

    affixList.appendChild(affixItem);
}

function updateOmenAffixDropdown(typeSelect) {
    const affixSelect = typeSelect.parentNode.querySelector('.omen-affix-id');
    const selectedType = typeSelect.value;

    affixSelect.innerHTML = '<option value="">Select Affix</option>';

    if (selectedType && affixData[selectedType]) {
        Object.keys(affixData[selectedType]).forEach(id => {
            const data = affixData[selectedType][id];
            const displayName = createDisplayName(id, data);
            affixSelect.innerHTML += `<option value="${id}">${displayName}</option>`;
        });
    }
}

// Remove affix
function removeAffix(button) {
    button.parentElement.remove();
}

// Load support gem data from JSON
function loadSupportGemFromJson(json) {
    if (json.id) document.getElementById('supportGemId').value = json.id;
    if (json.perc) document.getElementById('supportGemPerc').value = json.perc;
    if (json.rar) document.getElementById('supportGemRar').value = json.rar;
    if (json.links) document.getElementById('supportGemLinks').value = json.links;
}

// Load aura data from JSON
function loadAuraFromJson(json) {
    if (json.id) document.getElementById('auraId').value = json.id;
    if (json.perc) document.getElementById('auraPerc').value = json.perc;
    if (json.rar) document.getElementById('auraRar').value = json.rar;
    if (json.links) document.getElementById('auraLinks').value = json.links;
}

// Load omen data from JSON
function loadOmenFromJson(json) {
    if (json.id) document.getElementById('omenId').value = json.id;
    if (json.lvl) document.getElementById('omenLvl').value = json.lvl;
    if (json.rar) document.getElementById('omenRar').value = json.rar;

    // Clear existing affixes
    document.getElementById('omenAffixList').innerHTML = '';

    // Load omen affixes
    if (json.aff && Array.isArray(json.aff)) {
        json.aff.forEach(affix => {
            addOmenAffix();
            const omenAffixItems = document.querySelectorAll('#omenAffixList .affix-item');
            const lastItem = omenAffixItems[omenAffixItems.length - 1];

            if (affix.ty) lastItem.querySelector('.omen-affix-type').value = affix.ty;
            if (affix.id) lastItem.querySelector('.omen-affix-id').value = affix.id;
            if (affix.p) lastItem.querySelector('.omen-affix-p').value = affix.p;
            if (affix.rar) lastItem.querySelector('.omen-affix-rar').value = affix.rar;

            // Update the affix dropdown after setting the type
            if (affix.ty) {
                updateOmenAffixDropdown(lastItem.querySelector('.omen-affix-type'));
                // Set the ID again after dropdown is populated
                setTimeout(() => {
                    if (affix.id) lastItem.querySelector('.omen-affix-id').value = affix.id;
                }, 50);
            }
        });
    }
}

// Initialize the application
function initializeApp() {
    console.log('✅ Application initialized');

    // Set up event listeners
    const allowMixedTypesCheckbox = document.getElementById('allowMixedTypes');
    if (allowMixedTypesCheckbox) {
        allowMixedTypesCheckbox.addEventListener('change', () => toggleMixedTypes());
    }

    // Populate initial dropdowns when data is loaded
    if (affixData && Object.keys(affixData).length > 0) {
        console.log('🔄 Populating initial dropdowns...');
        populateGearDropdowns();
        populateSupportGemDropdowns();
        populateOmenDropdowns();
        populateAuraDropdowns();
    }
}

// Load the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('NBT Item Creator starting up...');
    loadAllAffixData();
    initializeApp();
});