// Counters for unique IDs
let actionCounter = 0;
let entityCounter = 0;
let statCounter = 0;

// Initialize the spell creator
function initializeSpellCreator() {
    console.log('🔮 Mine & Slash Spell Creator initialized');
}

// Load spell from JSON input
function loadSpellFromJson() {
    const jsonInput = document.getElementById('importSpellJson').value.trim();
    if (!jsonInput) {
        alert('Please paste a spell JSON to load.');
        return;
    }

    try {
        const spellData = JSON.parse(jsonInput);
        populateSpellForm(spellData);
        alert('✅ Spell loaded successfully!');
    } catch (error) {
        alert('❌ Invalid JSON format. Please check your input.');
        console.error('JSON parse error:', error);
    }
}

// Clear import JSON textarea
function clearImportSpellJson() {
    document.getElementById('importSpellJson').value = '';
}

// Clear all existing UI elements
function clearAllOnCastActions() {
    const onCastList = document.getElementById('onCastList');
    if (onCastList) {
        onCastList.innerHTML = '';
    }
    actionCounter = 0;
}

function clearAllEntityComponents() {
    const entityList = document.getElementById('entityComponentsList');
    if (entityList) {
        entityList.innerHTML = '';
    }
    entityCounter = 0;
}

function clearAllSkillGemStats() {
    const statsList = document.getElementById('skillGemStatsList');
    if (statsList) {
        statsList.innerHTML = '';
    }
    statCounter = 0;
}

// Add on cast action
function addOnCastAction() {
    const actionId = actionCounter++;
    const onCastList = document.getElementById('onCastList');

    if (!onCastList) return;

    const actionDiv = document.createElement('div');
    actionDiv.className = 'action-item';
    actionDiv.id = `onCastAction_${actionId}`;

    actionDiv.innerHTML = `
        <div class="action-header">
            <h4>🎯 On Cast Action ${actionId + 1}</h4>
            <button class="remove-btn" onclick="removeOnCastAction(${actionId})">🗑️ Remove</button>
        </div>
        <div class="form-group">
            <label>Raw Action JSON:</label>
            <textarea class="action-json" rows="15" placeholder='Complete action object with acts, en_preds, ifs, targets...'></textarea>
        </div>
    `;

    onCastList.appendChild(actionDiv);
}

// Remove on cast action
function removeOnCastAction(actionId) {
    const actionDiv = document.getElementById(`onCastAction_${actionId}`);
    if (actionDiv) actionDiv.remove();
}

// Add entity component
function addEntityComponent() {
    const componentId = entityCounter++;
    const entityList = document.getElementById('entityComponentsList');

    if (!entityList) return;

    const componentDiv = document.createElement('div');
    componentDiv.className = 'entity-component-item';
    componentDiv.id = `entityComponent_${componentId}`;

    componentDiv.innerHTML = `
        <div class="component-header">
            <h4>🎭 Entity Component ${componentId + 1}</h4>
            <button class="remove-btn" onclick="removeEntityComponent(${componentId})">🗑️ Remove</button>
        </div>
        <div class="form-group">
            <label>Component Type:</label>
            <input type="text" class="component-type" placeholder="stack_adder, on_tick, etc.">
        </div>
        <div class="form-group">
            <label>Component JSON:</label>
            <textarea class="component-json" rows="10" placeholder='Component configuration...'></textarea>
        </div>
    `;

    entityList.appendChild(componentDiv);
}

// Remove entity component
function removeEntityComponent(componentId) {
    const componentDiv = document.getElementById(`entityComponent_${componentId}`);
    if (componentDiv) componentDiv.remove();
}

// Add skill gem stat
function addSkillGemStat() {
    const statId = statCounter++;
    const statsList = document.getElementById('skillGemStatsList');

    if (!statsList) return;

    const statDiv = document.createElement('div');
    statDiv.className = 'skill-gem-stat-item';
    statDiv.id = `skillGemStat_${statId}`;

    const statHTML = `
        <div class="stat-header">
            <h4>📊 Skill Gem Stat ${statId + 1}</h4>
            <button class="remove-btn" onclick="removeSkillGemStat(${statId})">🗑️ Remove</button>
        </div>
        <div class="grid-3">
            <div class="form-group">
                <label>Stat Type:</label>
                <select class="stat-type">
                    <option value="spell_damage">Spell Damage</option>
                    <option value="cooldown_reduction">Cooldown Reduction</option>
                    <option value="mana_cost_reduction">Mana Cost Reduction</option>
                    <option value="cast_speed">Cast Speed</option>
                    <option value="area_of_effect">Area of Effect</option>
                    <option value="projectile_speed">Projectile Speed</option>
                    <option value="duration">Duration</option>
                    <option value="effect_strength">Effect Strength</option>
                </select>
            </div>
            <div class="form-group">
                <label>Base Value:</label>
                <input type="number" class="stat-value" value="0" step="0.1">
            </div>
            <div class="form-group">
                <label>Per Level:</label>
                <input type="number" class="stat-scaling" value="0" step="0.1">
            </div>
        </div>
        <div class="grid-2">
            <div class="form-group">
                <label>Min Value:</label>
                <input type="number" class="stat-min" value="" step="0.1" placeholder="Optional">
            </div>
            <div class="form-group">
                <label>Max Value:</label>
                <input type="number" class="stat-max" value="" step="0.1" placeholder="Optional">
            </div>
        </div>
    `;

    statDiv.innerHTML = statHTML;
    statsList.appendChild(statDiv);
}

// Remove skill gem stat
function removeSkillGemStat(statId) {
    const statDiv = document.getElementById(`skillGemStat_${statId}`);
    if (statDiv) statDiv.remove();
}

// Generate spell JSON
function generateSpellJson() {
    try {
        const spell = {
            "attached": {
                "entity_components": {},
                "on_cast": []
            },
            "cast_animation": {
                "id": document.getElementById('castAnimation')?.value || "staff_ground"
            },
            "cast_finish_animation": {
                "id": document.getElementById('castFinishAnimation')?.value || "cast_finish"
            },
            "config": {
                "tags": {
                    "tags": []
                }
            },
            "default_lvl": parseInt(document.getElementById('defaultLvl')?.value) || 0,
            "disabled_dims": [],
            "effect_tip": document.getElementById('effectTip')?.value || "",
            "identifier": document.getElementById('spellId')?.value || 'custom_spell',
            "loc_name": document.getElementById('locName')?.value || 'Custom Spell',
            "lvl_based_on_spell": document.getElementById('lvlBasedOnSpell')?.value || "",
            "manual_tip": document.getElementById('manualTip')?.checked || false,
            "max_lvl": parseInt(document.getElementById('maxLvl')?.value) || 16,
            "min_lvl": parseInt(document.getElementById('minLvl')?.value) || 1,
            "show_other_spell_tooltip": document.getElementById('showOtherSpellTooltip')?.value || "",
            "statsForSkillGem": [],
            "weight": parseInt(document.getElementById('weight')?.value) || 1000
        };

        // Add tags
        const tagsInput = document.getElementById('spellTags')?.value;
        if (tagsInput && tagsInput.trim()) {
            spell.config.tags.tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        }

        // Build on_cast actions from raw JSON inputs
        const onCastActions = document.querySelectorAll('#onCastList .action-item');
        onCastActions.forEach(actionDiv => {
            const jsonTextarea = actionDiv.querySelector('.action-json');
            if (jsonTextarea && jsonTextarea.value.trim()) {
                try {
                    const actionObj = JSON.parse(jsonTextarea.value);
                    spell.attached.on_cast.push(actionObj);
                } catch (error) {
                    console.error('Error parsing action JSON:', error);
                    alert('Error parsing action JSON. Please check your JSON syntax.');
                    throw error;
                }
            }
        });

        // Build entity components from raw JSON inputs
        const entityComponents = document.querySelectorAll('#entityComponentsList .entity-component-item');
        entityComponents.forEach(componentDiv => {
            const componentType = componentDiv.querySelector('.component-type')?.value;
            const componentJson = componentDiv.querySelector('.component-json')?.value;

            if (componentType && componentJson && componentJson.trim()) {
                try {
                    const componentData = JSON.parse(componentJson);
                    if (!spell.attached.entity_components[componentType]) {
                        spell.attached.entity_components[componentType] = [];
                    }
                    spell.attached.entity_components[componentType].push(componentData);
                } catch (error) {
                    console.error('Error parsing component JSON:', error);
                    alert('Error parsing entity component JSON. Please check your JSON syntax.');
                    throw error;
                }
            }
        });

        // Build skill gem stats
        const skillGemStats = document.querySelectorAll('#skillGemStatsList .skill-gem-stat-item');
        skillGemStats.forEach(statDiv => {
            const statType = statDiv.querySelector('.stat-type')?.value;
            const statValue = statDiv.querySelector('.stat-value')?.value;
            const statMin = statDiv.querySelector('.stat-min')?.value;
            const statMax = statDiv.querySelector('.stat-max')?.value;
            const statScaling = statDiv.querySelector('.stat-scaling')?.value;

            if (statType && statValue) {
                const statObj = {
                    "type": statType,
                    "value": parseFloat(statValue)
                };

                if (statMin && statMin.trim()) {
                    statObj.min = parseFloat(statMin);
                }
                if (statMax && statMax.trim()) {
                    statObj.max = parseFloat(statMax);
                }
                if (statScaling && statScaling.trim()) {
                    statObj.scaling = parseFloat(statScaling);
                }

                spell.statsForSkillGem.push(statObj);
            }
        });

        // Add config properties
        const castTimeTicks = document.getElementById('castTimeTicks');
        const cooldownTicks = document.getElementById('cooldownTicks');
        const manaCost = document.getElementById('manaCost');

        if (castTimeTicks?.value) {
            spell.config.cast_time_ticks = parseInt(castTimeTicks.value);
        }
        if (cooldownTicks?.value) {
            spell.config.cooldown_ticks = parseInt(cooldownTicks.value);
        }
        if (manaCost?.value) {
            spell.config.mana_cost = parseInt(manaCost.value);
        }

        // Add weapon requirements
        const weaponRequirements = document.getElementById('weaponRequirements');
        if (weaponRequirements?.value && weaponRequirements.value.trim()) {
            spell.config.weapon_req = weaponRequirements.value.split(',').map(w => w.trim()).filter(w => w);
        }

        // Add spell school
        const spellSchool = document.getElementById('spellSchool');
        if (spellSchool?.value && spellSchool.value !== 'none') {
            spell.config.spell_school = spellSchool.value;
        }

        // Display the generated JSON
        const output = document.getElementById('spellOutput');
        if (output) {
            output.innerHTML = `<pre>${JSON.stringify(spell, null, 2)}</pre>`;
        }

        console.log('✅ Spell JSON generated successfully!');
        return spell;

    } catch (error) {
        console.error('❌ Error generating spell JSON:', error);
        alert('Error generating spell JSON. Please check your inputs.');
    }
}

// Copy spell JSON to clipboard
function copySpellToClipboard() {
    const output = document.getElementById('spellOutput');
    if (!output) return;

    const textContent = output.textContent || output.innerText;

    if (!textContent || textContent.includes('Generated spell JSON will appear here')) {
        alert('❌ No spell JSON to copy. Please generate a spell first.');
        return;
    }

    try {
        navigator.clipboard.writeText(textContent).then(() => {
            alert('📋 Spell JSON copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = textContent;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('📋 Spell JSON copied to clipboard!');
        });
    } catch (error) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('📋 Spell JSON copied to clipboard!');
    }
}

// Download spell JSON as file
function downloadSpellJson() {
    const output = document.getElementById('spellOutput');
    if (!output) return;

    const textContent = output.textContent || output.innerText;

    if (!textContent || textContent.includes('Generated spell JSON will appear here')) {
        alert('❌ No spell JSON to download. Please generate a spell first.');
        return;
    }

    const spellId = document.getElementById('spellId')?.value || 'custom_spell';
    const filename = `${spellId}.json`;

    const blob = new Blob([textContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
    alert(`💾 Spell JSON downloaded as ${filename}!`);
}

// Populate spell form from loaded JSON
function populateSpellForm(spellData) {
    // Clear existing data
    clearAllOnCastActions();
    clearAllEntityComponents();
    clearAllSkillGemStats();

    // Basic properties - check if elements exist before setting values
    const spellIdEl = document.getElementById('spellId');
    if (spellIdEl) spellIdEl.value = spellData.identifier || '';

    const locNameEl = document.getElementById('locName');
    if (locNameEl) locNameEl.value = spellData.loc_name || '';

    const weightEl = document.getElementById('weight');
    if (weightEl) weightEl.value = spellData.weight || 1000;

    const minLvlEl = document.getElementById('minLvl');
    if (minLvlEl) minLvlEl.value = spellData.min_lvl || 1;

    const maxLvlEl = document.getElementById('maxLvl');
    if (maxLvlEl) maxLvlEl.value = spellData.max_lvl || 16;

    const defaultLvlEl = document.getElementById('defaultLvl');
    if (defaultLvlEl) defaultLvlEl.value = spellData.default_lvl || 0;

    const effectTipEl = document.getElementById('effectTip');
    if (effectTipEl) effectTipEl.value = spellData.effect_tip || '';

    const manualTipEl = document.getElementById('manualTip');
    if (manualTipEl) manualTipEl.checked = spellData.manual_tip || false;

    // Load on_cast actions
    if (spellData.attached?.on_cast) {
        spellData.attached.on_cast.forEach(action => {
            addOnCastAction();
            const lastAction = document.querySelector('#onCastList .action-item:last-child .action-json');
            if (lastAction) {
                lastAction.value = JSON.stringify(action, null, 2);
            }
        });
    }

    // Load entity components
    if (spellData.attached?.entity_components) {
        Object.entries(spellData.attached.entity_components).forEach(([componentType, components]) => {
            components.forEach(component => {
                addEntityComponent();
                const lastComponent = document.querySelector('#entityComponentsList .entity-component-item:last-child');
                if (lastComponent) {
                    const typeInput = lastComponent.querySelector('.component-type');
                    const jsonInput = lastComponent.querySelector('.component-json');
                    if (typeInput) typeInput.value = componentType;
                    if (jsonInput) jsonInput.value = JSON.stringify(component, null, 2);
                }
            });
        });
    }

    // Load skill gem stats
    if (spellData.statsForSkillGem) {
        spellData.statsForSkillGem.forEach(stat => {
            addSkillGemStat();
            const lastStat = document.querySelector('#skillGemStatsList .skill-gem-stat-item:last-child');
            if (lastStat) {
                const typeSelect = lastStat.querySelector('.stat-type');
                const valueInput = lastStat.querySelector('.stat-value');
                const minInput = lastStat.querySelector('.stat-min');
                const maxInput = lastStat.querySelector('.stat-max');
                const scalingInput = lastStat.querySelector('.stat-scaling');

                if (typeSelect) typeSelect.value = stat.type || '';
                if (valueInput) valueInput.value = stat.value || 0;
                if (minInput && stat.min !== undefined) minInput.value = stat.min;
                if (maxInput && stat.max !== undefined) maxInput.value = stat.max;
                if (scalingInput && stat.scaling !== undefined) scalingInput.value = stat.scaling;
            }
        });
    }

    // Load other properties
    const castAnimationEl = document.getElementById('castAnimation');
    if (castAnimationEl && spellData.cast_animation?.id) {
        castAnimationEl.value = spellData.cast_animation.id;
    }

    const castFinishAnimationEl = document.getElementById('castFinishAnimation');
    if (castFinishAnimationEl && spellData.cast_finish_animation?.id) {
        castFinishAnimationEl.value = spellData.cast_finish_animation.id;
    }

    // Load config properties
    if (spellData.config) {
        const castTimeTicksEl = document.getElementById('castTimeTicks');
        if (castTimeTicksEl && spellData.config.cast_time_ticks) {
            castTimeTicksEl.value = spellData.config.cast_time_ticks;
        }

        const cooldownTicksEl = document.getElementById('cooldownTicks');
        if (cooldownTicksEl && spellData.config.cooldown_ticks) {
            cooldownTicksEl.value = spellData.config.cooldown_ticks;
        }

        const manaCostEl = document.getElementById('manaCost');
        if (manaCostEl && spellData.config.mana_cost) {
            manaCostEl.value = spellData.config.mana_cost;
        }

        const spellSchoolEl = document.getElementById('spellSchool');
        if (spellSchoolEl && spellData.config.spell_school) {
            spellSchoolEl.value = spellData.config.spell_school;
        }

        const weaponReqEl = document.getElementById('weaponRequirements');
        if (weaponReqEl && spellData.config.weapon_req) {
            weaponReqEl.value = spellData.config.weapon_req.join(', ');
        }

        const spellTagsEl = document.getElementById('spellTags');
        if (spellTagsEl && spellData.config.tags?.tags) {
            spellTagsEl.value = spellData.config.tags.tags.join(', ');
        }
    }
}

// Navigate back to main creator
function goBackToMain() {
    window.location.href = 'index.html';
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    body.classList.toggle('dark-theme');

    if (body.classList.contains('dark-theme')) {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme and initialize
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        if (themeIcon) themeIcon.textContent = '☀️';
        if (themeText) themeText.textContent = 'Light Mode';
    }

    // Initialize spell creator
    initializeSpellCreator();
});