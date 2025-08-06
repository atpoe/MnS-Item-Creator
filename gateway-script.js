// Gateway state management
let waveCount = 0;
let globalAffixData = {};

// Theme and initialization functions
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        document.getElementById('themeIcon').textContent = '☀️';
        document.getElementById('themeText').textContent = 'Light Mode';
    }
}

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

function backToItemCreator() {
    window.location.href = 'index.html';
}

// Gateway property functions
function updateGatewaySize() {
    const size = document.getElementById('gatewaySize').value;
    console.log(`🔄 Gateway size updated to: ${size}`);
}

function updateGatewayColor() {
    const color = document.getElementById('gatewayColor').value;
    console.log(`🎨 Gateway color updated to: ${color}`);
}

function updateGatewaySpacing() {
    const spacing = document.getElementById('gatewaySpacing').value;
    console.log(`📏 Gateway spacing updated to: ${spacing}`);
}

// Wave management functions
function addWave() {
    waveCount++;
    const wavesList = document.getElementById('wavesList');

    const waveHtml = `
        <div class="wave-item" style="border: 2px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 16px; background: var(--bg-secondary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="color: var(--text-primary); margin: 0;">⚔️ Wave ${waveCount}</h4>
                <button onclick="removeWave(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">Remove Wave</button>
            </div>

            <!-- Wave Timing -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
                <div class="form-group">
                    <label>Max Wave Time (ticks):</label>
                    <input type="number" class="max-wave-time" value="800" min="1" style="background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-color);">
                </div>
                <div class="form-group">
                    <label>Setup Time (ticks):</label>
                    <input type="number" class="setup-time" value="100" min="1" style="background: var(--bg-input); color: var(--text-primary); border: 1px solid var(--border-color);">
                </div>
            </div>

            <!-- Wave Entities -->
            <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h5 style="color: var(--text-primary); margin: 0;">👹 Wave Entities</h5>
                    <button onclick="addWaveEntity(this)" style="background: #3498db; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">+ Add Entity</button>
                </div>
                <div class="wave-entities">
                    <!-- Entities will be added here -->
                </div>
            </div>

            <!-- Wave Modifiers -->
            <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h5 style="color: var(--text-primary); margin: 0;">⚡ Wave Modifiers</h5>
                    <button onclick="addWaveModifier(this)" style="background: #9b59b6; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">+ Add Modifier</button>
                </div>
                <div class="wave-modifiers">
                    <!-- Modifiers will be added here -->
                </div>
            </div>

            <!-- Wave Rewards -->
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h5 style="color: var(--text-primary); margin: 0;">🏆 Wave Rewards</h5>
                    <button onclick="addWaveReward(this)" style="background: var(--accent-color); color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">+ Add Reward</button>
                </div>
                <div class="wave-rewards">
                    <!-- Rewards will be added here -->
                </div>
            </div>
        </div>
    `;

    wavesList.insertAdjacentHTML('beforeend', waveHtml);
    console.log(`➕ Wave ${waveCount} added`);
}

function removeWave(button) {
    const waveItem = button.closest('.wave-item');
    if (waveItem) {
        waveItem.remove();
        updateWaveNumbers();
        console.log('🗑️ Wave removed');
    }
}

function updateWaveNumbers() {
    const waves = document.querySelectorAll('.wave-item h4');
    waves.forEach((header, index) => {
        header.textContent = `⚔️ Wave ${index + 1}`;
    });
}

// Entity management functions
function addWaveEntity(button) {
    const waveItem = button.closest('.wave-item');
    const entitiesContainer = waveItem.querySelector('.wave-entities');

    const entityHtml = `
        <div class="wave-entity-item" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 8px; margin-bottom: 8px; background: var(--bg-input);">
            <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 8px; align-items: end;">
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Entity:</label>
                    <input type="text" class="entity-type" placeholder="minecraft:zombie" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Count:</label>
                    <input type="number" class="entity-count" value="1" min="1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
                <button onclick="removeWaveEntity(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">Remove</button>
            </div>
        </div>
    `;

    entitiesContainer.insertAdjacentHTML('beforeend', entityHtml);
}

function removeWaveEntity(button) {
    const entityItem = button.closest('.wave-entity-item');
    if (entityItem) {
        entityItem.remove();
    }
}

// Wave modifier functions (moved from entity level to wave level)
function addWaveModifier(button) {
    const waveItem = button.closest('.wave-item');
    const modifiersContainer = waveItem.querySelector('.wave-modifiers');

    const modifierHtml = `
        <div class="wave-modifier-item" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 8px; margin-bottom: 8px; background: var(--bg-input);">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 8px; align-items: end;">
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Attribute:</label>
                    <select class="modifier-attribute" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                        <option value="generic.max_health">Max Health</option>
                        <option value="generic.attack_damage">Attack Damage</option>
                        <option value="generic.movement_speed">Movement Speed</option>
                        <option value="generic.knockback_resistance">Knockback Resistance</option>
                        <option value="generic.armor">Armor</option>
                        <option value="generic.armor_toughness">Armor Toughness</option>
                        <option value="generic.attack_speed">Attack Speed</option>
                        <option value="generic.luck">Luck</option>
                    </select>
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Operation:</label>
                    <select class="modifier-operation" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                        <option value="ADDITION">Addition</option>
                        <option value="MULTIPLY_BASE">Multiply Base</option>
                        <option value="MULTIPLY_TOTAL">Multiply Total</option>
                    </select>
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Value:</label>
                    <input type="number" class="modifier-value" value="0.05" step="0.01" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
                <button onclick="removeWaveModifier(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">Remove</button>
            </div>
        </div>
    `;

    modifiersContainer.insertAdjacentHTML('beforeend', modifierHtml);
}

function removeWaveModifier(button) {
    const modifierItem = button.closest('.wave-modifier-item');
    if (modifierItem) {
        modifierItem.remove();
    }
}

// Reward management functions
function addWaveReward(button) {
    const waveItem = button.closest('.wave-item');
    const rewardsContainer = waveItem.querySelector('.wave-rewards');

    const rewardHtml = `
        <div class="reward-item" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 8px; margin-bottom: 8px; background: var(--bg-input);">
            <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 8px; align-items: end;">
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Reward Type:</label>
                    <select class="reward-type" onchange="updateRewardFields(this)" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                        <option value="gateways:entity_loot">Entity Loot</option>
                        <option value="gateways:loot_table">Loot Table</option>
                        <option value="gateways:stack">Item Stack</option>
                        <option value="gateways:experience">Experience</option>
                        <option value="gateways:command">Command</option>
                    </select>
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Rolls:</label>
                    <input type="number" class="reward-rolls" value="1" min="1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
                <button onclick="removeReward(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">Remove</button>
            </div>
            <div class="reward-fields" style="margin-top: 8px;">
                <!-- Dynamic fields will be added here -->
            </div>
        </div>
    `;

    rewardsContainer.insertAdjacentHTML('beforeend', rewardHtml);

    // Initialize the reward fields
    const newReward = rewardsContainer.lastElementChild;
    const typeSelect = newReward.querySelector('.reward-type');
    updateRewardFields(typeSelect);
}

function removeReward(button) {
    const rewardItem = button.closest('.reward-item');
    if (rewardItem) {
        rewardItem.remove();
    }
}

function updateRewardFields(selectElement) {
    const rewardItem = selectElement.closest('.reward-item');
    const fieldsContainer = rewardItem.querySelector('.reward-fields');
    const rewardType = selectElement.value;

    let fieldsHtml = '';

    switch (rewardType) {
        case 'gateways:entity_loot':
            fieldsHtml = `
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Entity:</label>
                    <input type="text" class="reward-entity" placeholder="minecraft:zombie" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
            `;
            break;
        case 'gateways:loot_table':
            fieldsHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Loot Table:</label>
                        <input type="text" class="reward-loot-table" placeholder="minecraft:chests/simple_dungeon" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Description:</label>
                        <input type="text" class="reward-desc" placeholder="rewards.gateways.loot_table.drops" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                    </div>
                </div>
            `;
            break;
        case 'gateways:experience':
            fieldsHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Experience:</label>
                        <input type="number" class="reward-experience" value="100" min="1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Orb Size:</label>
                        <input type="number" class="reward-orb-size" value="10" min="1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                    </div>
                </div>
            `;
            break;
        case 'gateways:stack':
            fieldsHtml = `
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Item Stack JSON:</label>
                    <textarea class="reward-stack" placeholder='{"item": "minecraft:diamond", "count": 1}' rows="3" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary); resize: vertical;"></textarea>
                </div>
            `;
            break;
        case 'gateways:command':
            fieldsHtml = `
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Command:</label>
                    <input type="text" class="reward-command" placeholder="/give @p minecraft:diamond 1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
            `;
            break;
    }

    fieldsContainer.innerHTML = fieldsHtml;
}

// Global reward functions
function addGlobalReward() {
    const rewardsContainer = document.getElementById('globalRewardsList');
    if (!rewardsContainer) return;

    const rewardHtml = `
        <div class="reward-item" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 8px; margin-bottom: 8px; background: var(--bg-input);">
            <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 8px; align-items: end;">
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Reward Type:</label>
                    <select class="reward-type" onchange="updateRewardFields(this)" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                        <option value="gateways:entity_loot">Entity Loot</option>
                        <option value="gateways:loot_table">Loot Table</option>
                        <option value="gateways:stack">Item Stack</option>
                        <option value="gateways:experience">Experience</option>
                        <option value="gateways:command">Command</option>
                    </select>
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Rolls:</label>
                    <input type="number" class="reward-rolls" value="1" min="1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
                <button onclick="removeReward(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">Remove</button>
            </div>
            <div class="reward-fields" style="margin-top: 8px;">
                <!-- Dynamic fields will be added here -->
            </div>
        </div>
    `;

    rewardsContainer.insertAdjacentHTML('beforeend', rewardHtml);

    // Initialize the reward fields
    const newReward = rewardsContainer.lastElementChild;
    const typeSelect = newReward.querySelector('.reward-type');
    updateRewardFields(typeSelect);
}

// Data loading functions
function loadAllAffixData() {
    const dataStatus = document.getElementById('dataStatus');
    const loadingProgress = document.getElementById('loadingProgress');

    loadingProgress.textContent = 'Loading gateway data...';

    setTimeout(() => {
        dataStatus.innerHTML = '<strong style="color: var(--success-color);">✅ Gateway data loaded successfully!</strong>';
        console.log('✅ All gateway data loaded');
    }, 1000);
}

function generateGatewayJson() {
    try {
        const gatewayData = collectGatewayData();
        const jsonOutput = JSON.stringify(gatewayData, null, 2);

        // Display the result
        const outputArea = document.getElementById('jsonOutput');
        if (outputArea) {
            outputArea.value = jsonOutput;
        }

        console.log('✅ Gateway JSON generated successfully');
        showNotification('Gateway JSON generated successfully!', 'success');
    } catch (error) {
        console.error('❌ Error generating gateway JSON:', error);
        showNotification('Error generating gateway JSON: ' + error.message, 'error');
    }
}

function collectGatewayData() {
    const gatewayData = {
        size: document.getElementById('gatewaySize')?.value || 'small',
        color: document.getElementById('gatewayColor')?.value || '#00f7ff',
        waves: [],
        rewards: [],
        failures: [],
        rules: {
            spawn_range: parseInt(document.getElementById('spawnRange')?.value) || 4,
            leash_range: parseInt(document.getElementById('leashRange')?.value) || 16,
            spacing: parseInt(document.getElementById('gatewaySpacing')?.value) || 100
        }
    };

    // Collect waves
    const waves = document.querySelectorAll('.wave-item');
    waves.forEach(wave => {
        const waveData = collectWaveData(wave);
        if (waveData) {
            gatewayData.waves.push(waveData);
        }
    });

    // Collect global rewards
    const globalRewards = document.querySelectorAll('#globalRewardsList .reward-item');
    globalRewards.forEach(reward => {
        const rewardData = collectRewardData(reward);
        if (rewardData) {
            gatewayData.rewards.push(rewardData);
        }
    });

    // Collect failures
    const failures = document.querySelectorAll('#gatewayFailuresList .failure-item');
    failures.forEach(failure => {
        const failureData = collectFailureData(failure);
        if (failureData) {
            gatewayData.failures.push(failureData);
        }
    });

    return gatewayData;
}

function collectWaveData(waveElement) {
    const waveData = {
        entities: [],
        modifiers: [],
        rewards: [],
        max_wave_time: parseInt(waveElement.querySelector('.max-wave-time')?.value) || 800,
        setup_time: parseInt(waveElement.querySelector('.setup-time')?.value) || 100
    };

    // Collect entities
    const entities = waveElement.querySelectorAll('.wave-entity-item');
    entities.forEach(entity => {
        const entityType = entity.querySelector('.entity-type')?.value?.trim();
        const entityCount = parseInt(entity.querySelector('.entity-count')?.value) || 1;

        if (entityType) {
            waveData.entities.push({
                entity: entityType,
                count: entityCount
            });
        }
    });

    // Collect wave modifiers
    const modifiers = waveElement.querySelectorAll('.wave-modifier-item');
    modifiers.forEach(modifier => {
        const attribute = modifier.querySelector('.modifier-attribute')?.value;
        const operation = modifier.querySelector('.modifier-operation')?.value;
        const value = parseFloat(modifier.querySelector('.modifier-value')?.value) || 0;

        if (attribute && operation) {
            waveData.modifiers.push({
                attribute: attribute,
                operation: operation,
                value: value
            });
        }
    });

    // Collect wave rewards
    const rewards = waveElement.querySelectorAll('.wave-rewards .reward-item');
    rewards.forEach(reward => {
        const rewardData = collectRewardData(reward);
        if (rewardData) {
            waveData.rewards.push(rewardData);
        }
    });

    return waveData.entities.length > 0 ? waveData : null;
}

function collectRewardData(rewardElement) {
    const rewardType = rewardElement.querySelector('.reward-type')?.value;
    const rolls = parseInt(rewardElement.querySelector('.reward-rolls')?.value) || 1;

    if (!rewardType) return null;

    const rewardData = {
        type: rewardType,
        rolls: rolls
    };

    // Add type-specific fields
    switch (rewardType) {
        case 'gateways:entity_loot':
            const entity = rewardElement.querySelector('.reward-entity')?.value?.trim();
            if (entity) rewardData.entity = entity;
            break;
        case 'gateways:loot_table':
            const lootTable = rewardElement.querySelector('.reward-loot-table')?.value?.trim();
            const desc = rewardElement.querySelector('.reward-desc')?.value?.trim();
            if (lootTable) rewardData.loot_table = lootTable;
            if (desc) rewardData.desc = desc;
            break;
        case 'gateways:experience':
            const experience = parseInt(rewardElement.querySelector('.reward-experience')?.value) || 100;
            const orbSize = parseInt(rewardElement.querySelector('.reward-orb-size')?.value) || 10;
            rewardData.experience = experience;
            rewardData.orb_size = orbSize;
            break;
        case 'gateways:stack':
            const stackJson = rewardElement.querySelector('.reward-stack')?.value?.trim();
            if (stackJson) {
                try {
                    rewardData.stack = JSON.parse(stackJson);
                } catch (e) {
                    console.warn('Invalid stack JSON:', stackJson);
                }
            }
            break;
        case 'gateways:command':
            const command = rewardElement.querySelector('.reward-command')?.value?.trim();
            if (command) rewardData.command = command;
            break;
    }

    return rewardData;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? 'var(--success-color)' : '#e74c3c'};
        color: white;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Gateway failure functions
function addGatewayFailure() {
    const failuresContainer = document.getElementById('gatewayFailuresList');
    if (!failuresContainer) return;

    const failureHtml = `
        <div class="failure-item" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 8px; margin-bottom: 8px; background: var(--bg-input);">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: end;">
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Failure Type:</label>
                    <select class="failure-type" onchange="updateFailureFields(this)" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                        <option value="">Select failure type...</option>
                        <option value="gateways:command">Command</option>
                        <option value="gateways:explosion">Explosion</option>
                        <option value="gateways:mob_effect">Mob Effect</option>
                        <option value="gateways:summon">Summon</option>
                    </select>
                </div>
                <button onclick="removeFailure(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">Remove</button>
            </div>
            <div class="failure-fields" style="margin-top: 8px;">
                <!-- Dynamic fields will be added here -->
            </div>
        </div>
    `;

    failuresContainer.insertAdjacentHTML('beforeend', failureHtml);

    // Initialize the failure fields
    const newFailure = failuresContainer.lastElementChild;
    const typeSelect = newFailure.querySelector('.failure-type');
    updateFailureFields(typeSelect);
}

function removeFailure(button) {
    const failureItem = button.closest('.failure-item');
    if (failureItem) {
        failureItem.remove();
    }
}

function updateFailureFields(selectElement) {
    const fieldsContainer = selectElement.closest('.failure-item').querySelector('.failure-fields');
    const failureType = selectElement.value;

    let fieldsHtml = '';
    switch (failureType) {
        case 'gateways:command':
            fieldsHtml = `<input type="text" class="failure-command" placeholder="Enter command..." style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-primary);">`;
            break;
        case 'gateways:explosion':
            fieldsHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <input type="number" class="failure-power" placeholder="Power" min="1" value="4" style="padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-primary);">
                    <select class="failure-breaks-blocks" style="padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-primary);">
                        <option value="false">No Block Breaking</option>
                        <option value="true">Break Blocks</option>
                    </select>
                </div>
            `;
            break;
    }
    fieldsContainer.innerHTML = fieldsHtml;
}

// Gateway rules functions
function updateSpawnRange() {
    const spawnRange = document.getElementById('spawnRange').value;
    console.log(`📏 Spawn range updated to: ${spawnRange}`);
}

function updateLeashRange() {
    const leashRange = document.getElementById('leashRange').value;
    console.log(`📏 Leash range updated to: ${leashRange}`);
}

// Import/Export functions
function importGateway() {
    const importJson = document.getElementById('importJson').value.trim();

    if (!importJson) {
        showNotification('Please paste a gateway JSON to import', 'error');
        return;
    }

    try {
        const gatewayData = JSON.parse(importJson);
        console.log('Parsed JSON:', gatewayData); // Add this debug line
        loadGatewayData(gatewayData);
        showNotification('Gateway imported successfully!', 'success');

        // Clear the import field
        document.getElementById('importJson').value = '';
    } catch (error) {
        console.error('❌ Error importing gateway:', error);
        showNotification('Error importing gateway: Invalid JSON format', 'error');
    }
}

function loadGatewayData(data) {
    // Clear existing data
    clearAllData();

    // Load gateway properties
    if (data.size) document.getElementById('gatewaySize').value = data.size;
    if (data.color) document.getElementById('gatewayColor').value = data.color;
    if (data.rules) {
        if (data.rules.spawn_range) document.getElementById('spawnRange').value = data.rules.spawn_range;
        if (data.rules.leash_range) document.getElementById('leashRange').value = data.rules.leash_range;
        if (data.rules.spacing) document.getElementById('gatewaySpacing').value = data.rules.spacing;
    }

    // Load waves
    if (data.waves && Array.isArray(data.waves)) {
        data.waves.forEach(waveData => {
            addWave();
            const waveElement = document.querySelector('.wave-item:last-child');
            loadWaveData(waveElement, waveData);
        });
    }

    // Load global rewards
    if (data.rewards && Array.isArray(data.rewards)) {
        data.rewards.forEach(rewardData => {
            addGlobalReward();
            const rewardElement = document.querySelector('#globalRewardsList .reward-item:last-child');
            loadRewardData(rewardElement, rewardData);
        });
    }

    // Load failures
    console.log('Loading failures:', data.failures);
    if (data.failures && Array.isArray(data.failures)) {
        data.failures.forEach(failureData => {
            console.log('Adding failure:', failureData);
            addGatewayFailure();
            const failureElement = document.querySelector('#gatewayFailuresList .failure-item:last-child');
            loadFailureData(failureElement, failureData);
        });
    }
}

function loadWaveData(waveElement, waveData) {
    // Load wave timing
    if (waveData.max_wave_time) {
        waveElement.querySelector('.max-wave-time').value = waveData.max_wave_time;
    }
    if (waveData.setup_time) {
        waveElement.querySelector('.setup-time').value = waveData.setup_time;
    }

    // Load entities
    if (waveData.entities && Array.isArray(waveData.entities)) {
        waveData.entities.forEach(entityData => {
            const addButton = waveElement.querySelector('button[onclick*="addWaveEntity"]');
            addWaveEntity(addButton);
            const entityElement = waveElement.querySelector('.wave-entity-item:last-child');
            if (entityData.entity) entityElement.querySelector('.entity-type').value = entityData.entity;
            if (entityData.count) entityElement.querySelector('.entity-count').value = entityData.count;
        });
    }

    // Load modifiers
    if (waveData.modifiers && Array.isArray(waveData.modifiers)) {
        waveData.modifiers.forEach(modifierData => {
            const addButton = waveElement.querySelector('button[onclick*="addWaveModifier"]');
            addWaveModifier(addButton);
            const modifierElement = waveElement.querySelector('.wave-modifier-item:last-child');
            if (modifierData.attribute) modifierElement.querySelector('.modifier-attribute').value = modifierData.attribute;
            if (modifierData.operation) modifierElement.querySelector('.modifier-operation').value = modifierData.operation;
            if (modifierData.value !== undefined) modifierElement.querySelector('.modifier-value').value = modifierData.value;
        });
    }

    // Load wave rewards
    if (waveData.rewards && Array.isArray(waveData.rewards)) {
        waveData.rewards.forEach(rewardData => {
            const addButton = waveElement.querySelector('button[onclick*="addWaveReward"]');
            addWaveReward(addButton);
            const rewardElement = waveElement.querySelector('.wave-rewards .reward-item:last-child');
            loadRewardData(rewardElement, rewardData);
        });
    }
}

function loadRewardData(rewardElement, rewardData) {
    if (rewardData.type) {
        rewardElement.querySelector('.reward-type').value = rewardData.type;
        updateRewardFields(rewardElement.querySelector('.reward-type'));
    }
    if (rewardData.rolls) rewardElement.querySelector('.reward-rolls').value = rewardData.rolls;

    // Load type-specific data
    switch (rewardData.type) {
        case 'gateways:entity_loot':
            if (rewardData.entity) rewardElement.querySelector('.reward-entity').value = rewardData.entity;
            break;
        case 'gateways:loot_table':
            if (rewardData.loot_table) rewardElement.querySelector('.reward-loot-table').value = rewardData.loot_table;
            if (rewardData.desc) rewardElement.querySelector('.reward-desc').value = rewardData.desc;
            break;
        case 'gateways:experience':
            if (rewardData.experience) rewardElement.querySelector('.reward-experience').value = rewardData.experience;
            if (rewardData.orb_size) rewardElement.querySelector('.reward-orb-size').value = rewardData.orb_size;
            break;
        case 'gateways:stack':
            if (rewardData.stack) rewardElement.querySelector('.reward-stack').value = JSON.stringify(rewardData.stack, null, 2);
            break;
        case 'gateways:command':
            if (rewardData.command) rewardElement.querySelector('.reward-command').value = rewardData.command;
            break;
    }
}

function loadFailureData(failureElement, failureData) {
    console.log('Loading failure data:', failureData);

    if (failureData.type) {
        failureElement.querySelector('.failure-type').value = failureData.type;
        updateFailureFields(failureElement.querySelector('.failure-type'));

        // Wait longer for fields to be created
        setTimeout(() => {
            console.log('Populating fields for type:', failureData.type);

            switch (failureData.type) {
                case 'gateways:command':
                    if (failureData.command) {
                        const commandField = failureElement.querySelector('.failure-command');
                        console.log('Command field found:', !!commandField);
                        if (commandField) commandField.value = failureData.command;
                    }
                    break;
                case 'gateways:explosion':
                    if (failureData.power) {
                        const powerField = failureElement.querySelector('.failure-power');
                        console.log('Power field found:', !!powerField);
                        if (powerField) powerField.value = failureData.power;
                    }
                    if (failureData.breaks_blocks !== undefined) {
                        const breaksField = failureElement.querySelector('.failure-breaks-blocks');
                        if (breaksField) breaksField.value = failureData.breaks_blocks.toString();
                    }
                    break;
                case 'gateways:mob_effect':
                            const effectField = failureElement.querySelector('.failure-effect');
                            const durationField = failureElement.querySelector('.failure-duration');
                            console.log('Mob effect fields:', effectField, durationField);
                            if (failureData.effect && effectField) effectField.value = failureData.effect;
                            if (failureData.duration && durationField) durationField.value = failureData.duration;
                            break;
                case 'gateways:summon':
                            const entityField = failureElement.querySelector('.failure-entity');
                            const countField = failureElement.querySelector('.failure-count');
                            console.log('Summon fields:', entityField, countField);
                            console.log('Entity data:', failureData.entity);
                            if (failureData.entity && failureData.entity.entity && entityField) entityField.value = failureData.entity.entity;
                            if (failureData.entity && failureData.entity.count && countField) countField.value = failureData.entity.count;
                            break;
            }
        }, 200);  // Increased timeout
    }
}

function clearAllData() {
    // Clear waves
    document.getElementById('wavesList').innerHTML = '';

    // Clear global rewards
    document.getElementById('globalRewardsList').innerHTML = '';

    // Clear failures
    document.getElementById('gatewayFailuresList').innerHTML = '';

    // Reset wave count
    waveCount = 0;
}

function exportGateway() {
    try {
        const gatewayData = collectGatewayData();
        const jsonOutput = JSON.stringify(gatewayData, null, 2);

        // Create and download file
        const blob = new Blob([jsonOutput], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gateway.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('Gateway exported successfully!', 'success');
    } catch (error) {
        console.error('❌ Error exporting gateway:', error);
        showNotification('Error exporting gateway: ' + error.message, 'error');
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadAllAffixData();
    console.log('🌀 Gateway Creator initialized');
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 'g':
                event.preventDefault();
                generateGatewayJson();
                break;
            case 'i':
                event.preventDefault();
                importGateway();
                break;
            case 'e':
                event.preventDefault();
                exportGateway();
                break;
        }
    }
});

// Wave management functions
function addWave() {
    const wavesList = document.getElementById('wavesList');
    if (!wavesList) return;

    waveCount++;

    const waveHtml = `
        <div class="wave-item" style="border: 2px solid var(--border-color); border-radius: 8px; padding: 16px; margin-bottom: 16px; background: var(--bg-secondary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="margin: 0; color: var(--text-primary);">⚔️ Wave ${waveCount}</h4>
                <button onclick="removeWave(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 6px 12px; cursor: pointer;">Remove Wave</button>
            </div>

            <div class="wave-settings" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px;">
                <div class="form-group">
                    <label style="font-weight: bold; color: var(--text-primary);">Max Wave Time (seconds):</label>
                    <input type="number" class="wave-max-time" value="300" min="1" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-primary);">
                </div>
                <div class="form-group">
                    <label style="font-weight: bold; color: var(--text-primary);">Setup Time (seconds):</label>
                    <input type="number" class="wave-setup-time" value="5" min="0" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-primary);">
                </div>
            </div>

            <!-- Wave Entities -->
            <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h5 style="margin: 0; color: var(--text-primary);">👹 Wave Entities</h5>
                    <button onclick="addWaveEntity(this)" style="background: #3498db; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">+ Add Entity</button>
                </div>
                <div class="wave-entities">
                    <!-- Entities will be added here -->
                </div>
            </div>

            <!-- Wave Modifiers -->
            <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h5 style="margin: 0; color: var(--text-primary);">🔮 Wave Modifiers</h5>
                    <button onclick="addWaveModifier(this)" style="background: #9b59b6; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">+ Add Modifier</button>
                </div>
                <div class="wave-modifiers">
                    <!-- Modifiers will be added here -->
                </div>
            </div>

            <!-- Wave Rewards -->
            <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h5 style="margin: 0; color: var(--text-primary);">🏆 Wave Rewards</h5>
                    <button onclick="addWaveReward(this)" style="background: #f39c12; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">+ Add Reward</button>
                </div>
                <div class="wave-rewards">
                    <!-- Rewards will be added here -->
                </div>
            </div>
        </div>
    `;

    wavesList.insertAdjacentHTML('beforeend', waveHtml);
}

function removeWave(button) {
    const waveItem = button.closest('.wave-item');
    if (waveItem) {
        waveItem.remove();
    }
}

function addWaveEntity(button) {
    const waveItem = button.closest('.wave-item');
    const entitiesContainer = waveItem.querySelector('.wave-entities');

    const entityHtml = `
        <div class="entity-item" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 8px; margin-bottom: 8px; background: var(--bg-input);">
            <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 8px; align-items: end;">
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Entity:</label>
                    <input type="text" class="entity-type" placeholder="minecraft:zombie" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Count:</label>
                    <input type="number" class="entity-count" value="1" min="1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
                <button onclick="removeWaveEntity(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">Remove</button>
            </div>
        </div>
    `;

    entitiesContainer.insertAdjacentHTML('beforeend', entityHtml);
}

function removeWaveEntity(button) {
    const entityItem = button.closest('.entity-item');
    if (entityItem) {
        entityItem.remove();
    }
}

function addWaveModifier(button) {
    const waveItem = button.closest('.wave-item');
    const modifiersContainer = waveItem.querySelector('.wave-modifiers');

    const modifierHtml = `
        <div class="wave-modifier-item" style="border: 1px solid var(--border-color); border-radius: 4px; padding: 8px; margin-bottom: 8px; background: var(--bg-input);">
            <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 8px; align-items: end;">
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Modifier Type:</label>
                    <select class="modifier-type" onchange="updateModifierFields(this)" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                        <option value="gateways:speed">Speed</option>
                        <option value="gateways:strength">Strength</option>
                        <option value="gateways:resistance">Resistance</option>
                        <option value="gateways:fire_resistance">Fire Resistance</option>
                        <option value="gateways:regeneration">Regeneration</option>
                        <option value="gateways:invisibility">Invisibility</option>
                    </select>
                </div>
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Level:</label>
                    <input type="number" class="modifier-level" value="1" min="1" max="10" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
                <button onclick="removeWaveModifier(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px;">Remove</button>
            </div>
        </div>
    `;

    modifiersContainer.insertAdjacentHTML('beforeend', modifierHtml);
}

function updateModifierFields(select) {
    // For now, modifiers just need type and level
    console.log(`Modifier type updated to: ${select.value}`);
}

function updateRewardFields(select) {
    const rewardItem = select.closest('.reward-item');
    const fieldsContainer = rewardItem.querySelector('.reward-fields');
    const rewardType = select.value;

    let fieldsHtml = '';

    switch (rewardType) {
        case 'gateways:entity_loot':
            fieldsHtml = `
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Entity:</label>
                    <input type="text" class="reward-entity" placeholder="minecraft:zombie" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
            `;
            break;
        case 'gateways:loot_table':
            fieldsHtml = `
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Loot Table:</label>
                        <input type="text" class="reward-loot-table" placeholder="minecraft:chests/simple_dungeon" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Description:</label>
                        <input type="text" class="reward-desc" placeholder="Optional description" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                    </div>
                </div>
            `;
            break;
        case 'gateways:stack':
            fieldsHtml = `
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Item Stack JSON:</label>
                    <textarea class="reward-stack" placeholder='{"item": "minecraft:diamond", "count": 1}' rows="3" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary); resize: vertical;"></textarea>
                </div>
            `;
            break;
        case 'gateways:experience':
            fieldsHtml = `
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Experience Amount:</label>
                    <input type="number" class="reward-experience" value="10" min="1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
            `;
            break;
        case 'gateways:command':
            fieldsHtml = `
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Command:</label>
                    <input type="text" class="reward-command" placeholder="/give @p minecraft:diamond 1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
            `;
            break;
    }

    fieldsContainer.innerHTML = fieldsHtml;
}

function updateFailureFields(select) {
    const failureItem = select.closest('.failure-item');
    const fieldsContainer = failureItem.querySelector('.failure-fields');
    const failureType = select.value;

    let fieldsHtml = '';

    switch (failureType) {
        case 'gateways:command':
            fieldsHtml = `
                <div class="form-group" style="margin: 0;">
                    <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Command:</label>
                    <input type="text" class="failure-command" placeholder="/say Gateway failed!" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                </div>
            `;
            break;
        case 'gateways:explosion':
            fieldsHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Power:</label>
                        <input type="number" class="failure-power" value="4" min="1" max="10" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Breaks Blocks:</label>
                        <select class="failure-breaks-blocks" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                </div>
            `;
            break;
        case 'gateways:summon':
            fieldsHtml = `
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Entity:</label>
                        <input type="text" class="failure-entity" placeholder="minecraft:pillager" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Count:</label>
                        <input type="number" class="failure-count" value="1" min="1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                    </div>
                </div>
            `;
            break;
        case 'gateways:mob_effect':
            fieldsHtml = `
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px;">
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Effect:</label>
                        <input type="text" class="failure-effect" placeholder="minecraft:blindness" style="width: 100%; padding: 4px; border: 1px solid var(--input-border); border-radius: 4px; font-size: 12px;">
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label style="font-size: 12px; font-weight: bold; color: var(--text-primary);">Duration:</label>
                        <input type="number" class="failure-duration" value="200" min="1" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; font-size: 12px; background: var(--bg-input); color: var(--text-primary);">
                    </div>
                </div>
            `;
            break;
    }

    fieldsContainer.innerHTML = fieldsHtml;
}

// Data collection functions
function collectWaveData(waveElement) {
    const waveData = {
        entities: [],
        rewards: [],
        modifiers: [],
        max_wave_time: parseInt(waveElement.querySelector('.wave-max-time')?.value) || 300,
        setup_time: parseInt(waveElement.querySelector('.wave-setup-time')?.value) || 5
    };

    // Collect entities
    const entities = waveElement.querySelectorAll('.entity-item');
    entities.forEach(entity => {
        const entityType = entity.querySelector('.entity-type')?.value;
        const entityCount = parseInt(entity.querySelector('.entity-count')?.value) || 1;

        if (entityType) {
            waveData.entities.push({
                entity: entityType,
                count: entityCount
            });
        }
    });

    // Collect modifiers
    const modifiers = waveElement.querySelectorAll('.wave-modifier-item');
    modifiers.forEach(modifier => {
        const modifierType = modifier.querySelector('.modifier-type')?.value;
        const modifierLevel = parseInt(modifier.querySelector('.modifier-level')?.value) || 1;

        if (modifierType) {
            waveData.modifiers.push({
                type: modifierType,
                level: modifierLevel
            });
        }
    });

    // Collect rewards
    const rewards = waveElement.querySelectorAll('.wave-rewards .reward-item');
    rewards.forEach(reward => {
        const rewardData = collectRewardData(reward);
        if (rewardData) {
            waveData.rewards.push(rewardData);
        }
    });

    return waveData;
}

function collectRewardData(rewardElement) {
    const rewardType = rewardElement.querySelector('.reward-type')?.value;
    const rolls = parseInt(rewardElement.querySelector('.reward-rolls')?.value) || 1;

    if (!rewardType) return null;

    const rewardData = {
        type: rewardType,
        rolls: rolls
    };

    switch (rewardType) {
        case 'gateways:entity_loot':
            const entity = rewardElement.querySelector('.reward-entity')?.value;
            if (entity) rewardData.entity = entity;
            break;
        case 'gateways:loot_table':
            const lootTable = rewardElement.querySelector('.reward-loot-table')?.value;
            const desc = rewardElement.querySelector('.reward-desc')?.value;
            if (lootTable) rewardData.loot_table = lootTable;
            if (desc) rewardData.desc = desc;
            break;
        case 'gateways:stack':
            const stackJson = rewardElement.querySelector('.reward-stack')?.value;
            if (stackJson) {
                try {
                    rewardData.stack = JSON.parse(stackJson);
                } catch (e) {
                    console.warn('Invalid stack JSON:', stackJson);
                }
            }
            break;
        case 'gateways:experience':
            const experience = parseInt(rewardElement.querySelector('.reward-experience')?.value);
            if (experience) rewardData.experience = experience;
            break;
        case 'gateways:command':
            const command = rewardElement.querySelector('.reward-command')?.value;
            if (command) rewardData.command = command;
            break;
    }

    return rewardData;
}

function collectFailureData(failureElement) {
    const failureType = failureElement.querySelector('.failure-type')?.value;

    if (!failureType) return null;

    const failureData = {
        type: failureType
    };

    switch (failureType) {
        case 'gateways:command':
            const command = failureElement.querySelector('.failure-command')?.value;
            if (command) failureData.command = command;
            break;
        case 'gateways:explosion':
            const power = parseInt(failureElement.querySelector('.failure-power')?.value);
            const breaksBlocks = failureElement.querySelector('.failure-breaks-blocks')?.value === 'true';
            if (power) failureData.power = power;
            failureData.breaks_blocks = breaksBlocks;
            break;
        case 'gateways:spawn':
            const entity = failureElement.querySelector('.failure-entity')?.value;
            const count = parseInt(failureElement.querySelector('.failure-count')?.value);
            if (entity) failureData.entity = entity;
            if (count) failureData.count = count;
            break;
    }

    return failureData;
}

// Load data into forms
function loadWaveData(waveElement, waveData) {
    if (waveData.max_wave_time) waveElement.querySelector('.wave-max-time').value = waveData.max_wave_time;
    if (waveData.setup_time) waveElement.querySelector('.wave-setup-time').value = waveData.setup_time;

    // Load entities
    if (waveData.entities) {
        waveData.entities.forEach(entityData => {
            addWaveEntity(waveElement.querySelector('.wave-entities').closest('.wave-item').querySelector('button'));
            const entityElement = waveElement.querySelector('.entity-item:last-child');
            if (entityData.entity) entityElement.querySelector('.entity-type').value = entityData.entity;
            if (entityData.count) entityElement.querySelector('.entity-count').value = entityData.count;
        });
    }

    // Load modifiers
    if (waveData.modifiers) {
        waveData.modifiers.forEach(modifierData => {
            addWaveModifier(waveElement.querySelector('.wave-modifiers').closest('.wave-item').querySelector('button'));
            const modifierElement = waveElement.querySelector('.wave-modifier-item:last-child');
            if (modifierData.type) modifierElement.querySelector('.modifier-type').value = modifierData.type;
            if (modifierData.level) modifierElement.querySelector('.modifier-level').value = modifierData.level;
        });
    }

    // Load rewards
    if (waveData.rewards) {
        waveData.rewards.forEach(rewardData => {
            addWaveReward(waveElement.querySelector('.wave-rewards').closest('.wave-item').querySelector('button'));
            const rewardElement = waveElement.querySelector('.wave-rewards .reward-item:last-child');
            loadRewardData(rewardElement, rewardData);
        });
    }
}

function loadRewardData(rewardElement, rewardData) {
    if (rewardData.type) {
        rewardElement.querySelector('.reward-type').value = rewardData.type;
        updateRewardFields(rewardElement.querySelector('.reward-type'));
    }
    if (rewardData.rolls) rewardElement.querySelector('.reward-rolls').value = rewardData.rolls;

    switch (rewardData.type) {
        case 'gateways:entity_loot':
            if (rewardData.entity) rewardElement.querySelector('.reward-entity').value = rewardData.entity;
            break;
        case 'gateways:loot_table':
            if (rewardData.loot_table) rewardElement.querySelector('.reward-loot-table').value = rewardData.loot_table;
            if (rewardData.desc) rewardElement.querySelector('.reward-desc').value = rewardData.desc;
            break;
        case 'gateways:stack':
            if (rewardData.stack) rewardElement.querySelector('.reward-stack').value = JSON.stringify(rewardData.stack, null, 2);
            break;
        case 'gateways:experience':
            if (rewardData.experience) rewardElement.querySelector('.reward-experience').value = rewardData.experience;
            break;
        case 'gateways:command':
            if (rewardData.command) rewardElement.querySelector('.reward-command').value = rewardData.command;
            break;
    }
}

function loadFailureData(failureElement, failureData) {
    console.log('🔧 Loading failure data into element:', failureData);

    if (failureData.type) {
        const typeSelect = failureElement.querySelector('.failure-type');
        console.log('🔧 Found type select:', !!typeSelect);

        if (typeSelect) {
            typeSelect.value = failureData.type;
            console.log('🔧 Set type to:', failureData.type);
            updateFailureFields(typeSelect);

            setTimeout(() => {
                console.log('🔧 Populating fields after timeout for type:', failureData.type);

                switch (failureData.type) {
                    case 'gateways:mob_effect':
                        const effectField = failureElement.querySelector('.failure-effect');
                        const durationField = failureElement.querySelector('.failure-duration');
                        console.log('🔧 Effect field found:', !!effectField, 'Duration field found:', !!durationField);

                        if (failureData.effect && effectField) {
                            effectField.value = failureData.effect;
                            console.log('🔧 Set effect to:', failureData.effect);
                        }
                        if (failureData.duration && durationField) {
                            durationField.value = failureData.duration;
                            console.log('🔧 Set duration to:', failureData.duration);
                        }
                        break;

                    case 'gateways:summon':
                        const entityField = failureElement.querySelector('.failure-entity');
                        const countField = failureElement.querySelector('.failure-count');
                        console.log('🔧 Entity field found:', !!entityField, 'Count field found:', !!countField);

                        if (failureData.entity && failureData.entity.entity && entityField) {
                            entityField.value = failureData.entity.entity;
                            console.log('🔧 Set entity to:', failureData.entity.entity);
                        }
                        if (failureData.entity && failureData.entity.count && countField) {
                            countField.value = failureData.entity.count;
                            console.log('🔧 Set count to:', failureData.entity.count);
                        }
                        break;
                }
            }, 100);
        }
    }
}

// Main generation function
function generateGateway() {
    try {
        const gatewayData = collectGatewayData();
        const jsonOutput = JSON.stringify(gatewayData, null, 2);

        // Display the result
        const outputDiv = document.getElementById('output');
        if (outputDiv) {
            outputDiv.innerHTML = `<pre style="background: var(--bg-input); padding: 12px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; color: var(--text-primary);">${jsonOutput}</pre>`;
        }

        console.log('✅ Gateway JSON generated successfully');
        showNotification('Gateway JSON generated successfully!', 'success');
    } catch (error) {
        console.error('❌ Error generating gateway JSON:', error);
        showNotification('Error generating gateway JSON: ' + error.message, 'error');
    }
}

function copyToClipboard() {
    try {
        const gatewayData = collectGatewayData();
        const jsonOutput = JSON.stringify(gatewayData, null, 2);

        navigator.clipboard.writeText(jsonOutput).then(() => {
            showNotification('Gateway JSON copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = jsonOutput;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Gateway JSON copied to clipboard!', 'success');
        });
    } catch (error) {
        console.error('❌ Error copying to clipboard:', error);
        showNotification('Error copying to clipboard: ' + error.message, 'error');
    }
}

function loadFromJson() {
    const importJson = document.getElementById('importJson').value.trim();

    if (!importJson) {
        showNotification('Please paste a gateway JSON to import', 'error');
        return;
    }

    try {
        const gatewayData = JSON.parse(importJson);
        loadGatewayData(gatewayData);
        showNotification('Gateway imported successfully!', 'success');

        // Clear the import field
        document.getElementById('importJson').value = '';
    } catch (error) {
        console.error('❌ Error importing gateway:', error);
        showNotification('Error importing gateway: Invalid JSON format', 'error');
    }
}

function clearImportJson() {
    document.getElementById('importJson').value = '';
    showNotification('Import field cleared', 'success');
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? 'var(--success-color)' : '#e74c3c'};
        color: white;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        font-weight: bold;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}