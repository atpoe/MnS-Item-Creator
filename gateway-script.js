// Gateway state management
let waveCount = 0;
let globalAffixData = {};

// Theme functions
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

// Navigation function
function backToItemCreator() {
    window.location.href = 'index.html';
}

function loadAllAffixData() {
    const dataStatus = document.getElementById('dataStatus');
    const loadingProgress = document.getElementById('loadingProgress');

    loadingProgress.textContent = 'Loading gateway data...';

    setTimeout(() => {
        dataStatus.innerHTML = '<strong style="color: var(--success-color);">✅ Gateway data loaded successfully!</strong>';
        console.log('✅ All gateway data loaded');
    }, 1000);
}

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

function collectGatewayData() {
    const gatewayData = {
        size: document.getElementById('gatewaySize')?.value || 'small',
        color: document.getElementById('gatewayColor')?.value || '#00f7ff',
        waves: [],
        rewards: [],
        failures: [],
        rules: {
            spacing: parseInt(document.getElementById('gatewaySpacing')?.value) || 100
        }
    };

    // Add spawn_range and leash_range if they exist
    const spawnRange = document.getElementById('spawnRange')?.value;
    const leashRange = document.getElementById('leashRange')?.value;
    if (spawnRange) gatewayData.rules.spawn_range = parseInt(spawnRange);
    if (leashRange) gatewayData.rules.leash_range = parseInt(leashRange);

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
        rewards: []
    };

    // Collect wave entities
    const entities = waveElement.querySelectorAll('.wave-entity-item');
    entities.forEach(entity => {
        const entityData = collectEntityData(entity);
        if (entityData) {
            waveData.entities.push(entityData);
        }
    });

    // Collect wave modifiers
    const modifiers = waveElement.querySelectorAll('.wave-modifier-item');
    modifiers.forEach(modifier => {
        const modifierData = collectModifierData(modifier);
        if (modifierData) {
            waveData.modifiers.push(modifierData);
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

    // Get wave timing
    const maxWaveTime = waveElement.querySelector('.wave-max-time')?.value;
    const setupTime = waveElement.querySelector('.wave-setup-time')?.value;

    if (maxWaveTime) waveData.max_wave_time = parseInt(maxWaveTime);
    if (setupTime) waveData.setup_time = parseInt(setupTime);

    return waveData.entities.length > 0 ? waveData : null;
}

function collectEntityData(entityElement) {
    const entityId = entityElement.querySelector('.entity-id')?.value?.trim();
    const count = parseInt(entityElement.querySelector('.entity-count')?.value) || 1;
    const nbtJson = entityElement.querySelector('.entity-nbt')?.value?.trim();

    if (!entityId) return null;

    const entityData = {
        entity: entityId,
        count: count
    };

    if (nbtJson) {
        try {
            entityData.nbt = JSON.parse(nbtJson);
        } catch (e) {
            console.warn('Invalid entity NBT JSON:', nbtJson);
        }
    }

    return entityData;
}

function collectModifierData(modifierElement) {
    const attribute = modifierElement.querySelector('.modifier-attribute')?.value;
    const operation = modifierElement.querySelector('.modifier-operation')?.value;
    const value = parseFloat(modifierElement.querySelector('.modifier-value')?.value);

    if (!attribute || !operation || isNaN(value)) return null;

    return {
        attribute: attribute,
        operation: operation,
        value: value
    };
}

function collectRewardData(rewardElement) {
    const rewardType = rewardElement.querySelector('.reward-type')?.value;
    const rolls = parseInt(rewardElement.querySelector('.reward-rolls')?.value) || 1;

    if (!rewardType) return null;

    const rewardData = {
        type: rewardType
    };

    // Add rolls if greater than 1
    if (rolls > 1) {
        rewardData.rolls = rolls;
    }

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

        case 'gateways:stack_list':
            const stackListJson = rewardElement.querySelector('.reward-stack-list')?.value?.trim();
            if (stackListJson) {
                try {
                    rewardData.stacks = JSON.parse(stackListJson);
                } catch (e) {
                    console.warn('Invalid stack list JSON:', stackListJson);
                }
            }
            break;

        case 'gateways:command':
            const command = rewardElement.querySelector('.reward-command')?.value?.trim();
            if (command) rewardData.command = command;
            break;

        case 'gateways:summon':
            const summonJson = rewardElement.querySelector('.reward-summon-entity')?.value?.trim();
            if (summonJson) {
                try {
                    rewardData.entity = JSON.parse(summonJson);
                } catch (e) {
                    console.warn('Invalid summon entity JSON:', summonJson);
                }
            }
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
            const command = failureElement.querySelector('.failure-command')?.value?.trim();
            if (command) failureData.command = command;
            break;
        case 'gateways:explosion':
            const power = parseFloat(failureElement.querySelector('.failure-power')?.value);
            const breaksBlocks = failureElement.querySelector('.failure-breaks-blocks')?.value === 'true';
            if (!isNaN(power)) failureData.power = power;
            failureData.breaks_blocks = breaksBlocks;
            break;
    }

    return failureData;
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

// Wave management functions
function addWave() {
    waveCount++;
    const wavesList = document.getElementById('wavesList');

    const waveHtml = `
        <div class="wave-item" style="background: var(--bg-section); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="color: var(--text-primary); margin: 0;">⚔️ Wave ${waveCount}</h4>
                <button onclick="removeWave(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 4px 12px; cursor: pointer;">🗑️ Remove</button>
            </div>

            <!-- Wave Timing -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                <div>
                    <label style="color: var(--text-secondary); font-size: 12px; display: block; margin-bottom: 4px;">Max Wave Time (ticks):</label>
                    <input type="number" class="wave-max-time" value="1000" min="1" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-primary);">
                </div>
                <div>
                    <label style="color: var(--text-secondary); font-size: 12px; display: block; margin-bottom: 4px;">Setup Time (ticks):</label>
                    <input type="number" class="wave-setup-time" value="100" min="1" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-input); color: var(--text-primary);">
                </div>
            </div>

            <!-- Wave Entities -->
            <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h5 style="color: var(--text-primary); margin: 0;">👹 Wave Entities</h5>
                    <button onclick="addWaveEntity(this)" style="background: #27ae60; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">+ Add Entity</button>
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
            <div style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h5 style="color: var(--text-primary); margin: 0;">🎁 Wave Rewards</h5>
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
        <div class="wave-entity-item" style="background: var(--bg-input); padding: 12px; border-radius: 4px; margin-bottom: 8px;">
            <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 8px; align-items: start;">
                <div>
                    <input type="text" class="entity-id" placeholder="Entity ID (e.g., minecraft:zombie)" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                </div>
                <div>
                    <input type="number" class="entity-count" placeholder="Count" value="1" min="1" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                </div>
                <button onclick="removeWaveEntity(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer;">🗑️</button>
            </div>
            <div style="margin-top: 8px;">
                <textarea class="entity-nbt" placeholder="Entity NBT (JSON)" style="width: 100%; height: 80px; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary); font-family: monospace; font-size: 12px; resize: vertical;"></textarea>
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

// Modifier management functions
function addWaveModifier(button) {
    const waveItem = button.closest('.wave-item');
    const modifiersContainer = waveItem.querySelector('.wave-modifiers');

    const modifierHtml = `
        <div class="wave-modifier-item" style="background: var(--bg-input); padding: 12px; border-radius: 4px; margin-bottom: 8px;">
            <div style="display: grid; grid-template-columns: 2fr 2fr 1fr auto; gap: 8px;">
                <select class="modifier-attribute" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                    <option value="">Select Attribute</option>
                    <option value="generic.max_health">Max Health</option>
                    <option value="generic.attack_damage">Attack Damage</option>
                    <option value="generic.movement_speed">Movement Speed</option>
                    <option value="generic.knockback_resistance">Knockback Resistance</option>
                    <option value="generic.armor">Armor</option>
                    <option value="generic.armor_toughness">Armor Toughness</option>
                    <option value="generic.attack_speed">Attack Speed</option>
                    <option value="generic.luck">Luck</option>
                </select>
                <select class="modifier-operation" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                    <option value="ADDITION">Addition (+)</option>
                    <option value="MULTIPLY_BASE">Multiply Base (×)</option>
                    <option value="MULTIPLY_TOTAL">Multiply Total (%)</option>
                </select>
                <input type="number" class="modifier-value" placeholder="Value" value="1.0" step="0.1" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                <button onclick="removeWaveModifier(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer;">🗑️</button>
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

    addRewardToContainer(rewardsContainer);
}

function addGlobalReward() {
    const rewardsContainer = document.getElementById('globalRewardsList');
    addRewardToContainer(rewardsContainer);
}

function addRewardToContainer(container) {
    const rewardHtml = `
        <div class="reward-item" style="background: var(--bg-input); padding: 12px; border-radius: 4px; margin-bottom: 8px;">
            <div style="display: grid; grid-template-columns: 2fr 1fr auto; gap: 8px; margin-bottom: 8px;">
                <select class="reward-type" onchange="updateRewardFields(this)" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                    <option value="">Select Reward Type</option>
                    <option value="gateways:stack">Item Stack</option>
                    <option value="gateways:stack_list">Stack List</option>
                    <option value="gateways:loot_table">Loot Table</option>
                    <option value="gateways:entity_loot">Entity Loot</option>
                    <option value="gateways:experience">Experience</option>
                    <option value="gateways:command">Command</option>
                    <option value="gateways:summon">Summon Entity</option>
                </select>
                <input type="number" class="reward-rolls" placeholder="Rolls" value="1" min="1" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                <button onclick="removeReward(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer;">🗑️</button>
            </div>
            <div class="reward-fields">
                <!-- Dynamic fields will be added here -->
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', rewardHtml);
}

function removeReward(button) {
    const rewardItem = button.closest('.reward-item');
    if (rewardItem) {
        rewardItem.remove();
    }
}

function updateRewardFields(selectElement) {
    const fieldsContainer = selectElement.closest('.reward-item').querySelector('.reward-fields');
    const rewardType = selectElement.value;

    let fieldsHtml = '';
    switch (rewardType) {
        case 'gateways:entity_loot':
            fieldsHtml = `<input type="text" class="reward-entity" placeholder="Entity ID (e.g., minecraft:zombie)" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">`;
            break;
        case 'gateways:loot_table':
            fieldsHtml = `
                <input type="text" class="reward-loot-table" placeholder="Loot Table ID (e.g., minecraft:chests/simple_dungeon)" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary); margin-bottom: 8px;">
                <input type="text" class="reward-desc" placeholder="Description (optional)" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
            `;
            break;
        case 'gateways:experience':
            fieldsHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <input type="number" class="reward-experience" placeholder="Experience" value="100" min="1" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                    <input type="number" class="reward-orb-size" placeholder="Orb Size" value="10" min="1" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                </div>
            `;
            break;
        case 'gateways:stack':
            fieldsHtml = `<textarea class="reward-stack" placeholder='{"item": "minecraft:diamond", "count": 1}' style="width: 100%; height: 60px; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary); font-family: monospace; font-size: 12px; resize: vertical;"></textarea>`;
            break;
        case 'gateways:stack_list':
            fieldsHtml = `<textarea class="reward-stack-list" placeholder='[{"item": "minecraft:diamond", "count": 1}, {"item": "minecraft:gold_ingot", "count": 5}]' style="width: 100%; height: 80px; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary); font-family: monospace; font-size: 12px; resize: vertical;"></textarea>`;
            break;
        case 'gateways:command':
            fieldsHtml = `<input type="text" class="reward-command" placeholder="Command (e.g., say Hello)" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">`;
            break;
        case 'gateways:summon':
            fieldsHtml = `<textarea class="reward-summon-entity" placeholder='{"entity": "minecraft:iron_golem", "nbt": {}, "count": 1}' style="width: 100%; height: 100px; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary); font-family: monospace; font-size: 12px; resize: vertical;"></textarea>`;
            break;
    }
    fieldsContainer.innerHTML = fieldsHtml;
}

// Gateway failure functions
function addGatewayFailure() {
    const failuresList = document.getElementById('gatewayFailuresList');

    const failureHtml = `
        <div class="failure-item" style="background: var(--bg-input); padding: 12px; border-radius: 4px; margin-bottom: 8px;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-bottom: 8px;">
                <select class="failure-type" onchange="updateFailureFields(this)" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                    <option value="">Select Failure Type</option>
                    <option value="gateways:command">Command</option>
                    <option value="gateways:explosion">Explosion</option>
                </select>
                <button onclick="removeFailure(this)" style="background: #e74c3c; color: white; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer;">🗑️</button>
            </div>
            <div class="failure-fields">
                <!-- Dynamic fields will be added here -->
            </div>
        </div>
    `;

    failuresList.insertAdjacentHTML('beforeend', failureHtml);
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
            fieldsHtml = `<input type="text" class="failure-command" placeholder="Command (e.g., say Gateway Failed!)" style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">`;
            break;
        case 'gateways:explosion':
            fieldsHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <input type="number" class="failure-power" placeholder="Power" value="4.0" step="0.1" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                    <select class="failure-breaks-blocks" style="padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-section); color: var(--text-primary);">
                        <option value="false">Doesn't Break Blocks</option>
                        <option value="true">Breaks Blocks</option>
                    </select>
                </div>
            `;
            break;
    }
    fieldsContainer.innerHTML = fieldsHtml;
}

// Import gateway function
function importGateway() {
    const importTextarea = document.getElementById('importJson');
    const jsonText = importTextarea.value.trim();

    if (!jsonText) {
        showNotification('Please paste a gateway JSON to import', 'error');
        return;
    }

    try {
        const gatewayData = JSON.parse(jsonText);
        loadGatewayData(gatewayData);
        showNotification('Gateway imported successfully!', 'success');
        console.log('✅ Gateway imported successfully');
    } catch (error) {
        console.error('❌ Error importing gateway:', error);
        showNotification('Invalid JSON format: ' + error.message, 'error');
    }
}

function loadGatewayData(data) {
    // Clear existing data
    document.getElementById('wavesList').innerHTML = '';
    document.getElementById('globalRewardsList').innerHTML = '';
    document.getElementById('gatewayFailuresList').innerHTML = '';
    waveCount = 0;

    // Load basic settings
    if (data.size) document.getElementById('gatewaySize').value = data.size;
    if (data.color) document.getElementById('gatewayColor').value = data.color;

    // Load rules
    if (data.rules) {
        if (data.rules.spacing) document.getElementById('gatewaySpacing').value = data.rules.spacing;
        if (data.rules.spawn_range) document.getElementById('spawnRange').value = data.rules.spawn_range;
        if (data.rules.leash_range) document.getElementById('leashRange').value = data.rules.leash_range;
        if (data.rules.player_damage_only !== undefined) {
            document.getElementById('playerDamageOnly').value = data.rules.player_damage_only.toString();
        }
    }

    // Load waves
    if (data.waves && Array.isArray(data.waves)) {
        data.waves.forEach(wave => {
            addWave();
            const waveElement = document.querySelectorAll('.wave-item')[waveCount - 1];
            loadWaveData(waveElement, wave);
        });
    }

    // Load global rewards
    if (data.rewards && Array.isArray(data.rewards)) {
        data.rewards.forEach(reward => {
            addGlobalReward();
            const rewardElement = document.querySelectorAll('#globalRewardsList .reward-item');
            loadRewardData(rewardElement[rewardElement.length - 1], reward);
        });
    }

    // Load failures
    if (data.failures && Array.isArray(data.failures)) {
        data.failures.forEach(failure => {
            addGatewayFailure();
            const failureElement = document.querySelectorAll('#gatewayFailuresList .failure-item');
            loadFailureData(failureElement[failureElement.length - 1], failure);
        });
    }

    updateGatewaySize();
}

function loadWaveData(waveElement, waveData) {
    // Load wave timing
    if (waveData.max_wave_time) {
        waveElement.querySelector('.wave-max-time').value = waveData.max_wave_time;
    }
    if (waveData.setup_time) {
        waveElement.querySelector('.wave-setup-time').value = waveData.setup_time;
    }

    // Load entities
    if (waveData.entities && Array.isArray(waveData.entities)) {
        waveData.entities.forEach(entity => {
            const addButton = waveElement.querySelector('.wave-entities').previousElementSibling.querySelector('button');
            addWaveEntity(addButton);
            const entityElements = waveElement.querySelectorAll('.wave-entity-item');
            const entityElement = entityElements[entityElements.length - 1];

            entityElement.querySelector('.entity-id').value = entity.entity || '';
            entityElement.querySelector('.entity-count').value = entity.count || 1;
            if (entity.nbt) {
                entityElement.querySelector('.entity-nbt').value = JSON.stringify(entity.nbt, null, 2);
            }
        });
    }

    // Load modifiers
    if (waveData.modifiers && Array.isArray(waveData.modifiers)) {
        waveData.modifiers.forEach(modifier => {
            const addButton = waveElement.querySelector('.wave-modifiers').previousElementSibling.querySelector('button');
            addWaveModifier(addButton);
            const modifierElements = waveElement.querySelectorAll('.wave-modifier-item');
            const modifierElement = modifierElements[modifierElements.length - 1];

            modifierElement.querySelector('.modifier-attribute').value = modifier.attribute || '';
            modifierElement.querySelector('.modifier-operation').value = modifier.operation || 'ADDITION';
            modifierElement.querySelector('.modifier-value').value = modifier.value || 1.0;
        });
    }

    // Load wave rewards
    if (waveData.rewards && Array.isArray(waveData.rewards)) {
        waveData.rewards.forEach(reward => {
            const addButton = waveElement.querySelector('.wave-rewards').previousElementSibling.querySelector('button');
            addWaveReward(addButton);
            const rewardElements = waveElement.querySelectorAll('.wave-rewards .reward-item');
            loadRewardData(rewardElements[rewardElements.length - 1], reward);
        });
    }
}

function loadRewardData(rewardElement, rewardData) {
    const typeSelect = rewardElement.querySelector('.reward-type');
    const rollsInput = rewardElement.querySelector('.reward-rolls');

    if (rewardData.type) {
        typeSelect.value = rewardData.type;
        updateRewardFields(typeSelect);
    }

    if (rewardData.rolls) {
        rollsInput.value = rewardData.rolls;
    }

    // Wait for fields to be created
    setTimeout(() => {
        switch (rewardData.type) {
            case 'gateways:entity_loot':
                if (rewardData.entity) {
                    rewardElement.querySelector('.reward-entity').value = rewardData.entity;
                }
                break;

            case 'gateways:loot_table':
                if (rewardData.loot_table) {
                    rewardElement.querySelector('.reward-loot-table').value = rewardData.loot_table;
                }
                if (rewardData.desc) {
                    rewardElement.querySelector('.reward-desc').value = rewardData.desc;
                }
                break;

            case 'gateways:experience':
                if (rewardData.experience) {
                    rewardElement.querySelector('.reward-experience').value = rewardData.experience;
                }
                if (rewardData.orb_size) {
                    rewardElement.querySelector('.reward-orb-size').value = rewardData.orb_size;
                }
                break;

            case 'gateways:stack':
                if (rewardData.stack) {
                    rewardElement.querySelector('.reward-stack').value = JSON.stringify(rewardData.stack, null, 2);
                }
                break;

            case 'gateways:stack_list':
                if (rewardData.stacks) {
                    rewardElement.querySelector('.reward-stack-list').value = JSON.stringify(rewardData.stacks, null, 2);
                }
                break;

            case 'gateways:command':
                if (rewardData.command) {
                    rewardElement.querySelector('.reward-command').value = rewardData.command;
                }
                break;

            case 'gateways:summon':
                if (rewardData.entity) {
                    rewardElement.querySelector('.reward-summon-entity').value = JSON.stringify(rewardData.entity, null, 2);
                }
                break;
        }
    }, 50);
}

function loadFailureData(failureElement, failureData) {
    const typeSelect = failureElement.querySelector('.failure-type');

    if (failureData.type) {
        typeSelect.value = failureData.type;
        updateFailureFields(typeSelect);
    }

    // Wait for fields to be created
    setTimeout(() => {
        switch (failureData.type) {
            case 'gateways:command':
                if (failureData.command) {
                    failureElement.querySelector('.failure-command').value = failureData.command;
                }
                break;

            case 'gateways:explosion':
                if (failureData.power !== undefined) {
                    failureElement.querySelector('.failure-power').value = failureData.power;
                }
                if (failureData.breaks_blocks !== undefined) {
                    failureElement.querySelector('.failure-breaks-blocks').value = failureData.breaks_blocks.toString();
                }
                break;
        }
    }, 50);
}

// Update functions for gateway rules
function updateSpawnRange() {
    const spawnRange = document.getElementById('spawnRange').value;
    console.log(`🎯 Spawn range updated to: ${spawnRange}`);
}

function updateLeashRange() {
    const leashRange = document.getElementById('leashRange').value;
    console.log(`🔗 Leash range updated to: ${leashRange}`);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
});