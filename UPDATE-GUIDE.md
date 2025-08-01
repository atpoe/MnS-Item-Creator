# How to Update Mine & Slash NBT Item Creator Data

When Mine & Slash mod gets updated with new items/affixes, follow these steps to update your NBT Item Creator:

## Step 1: Get Updated JSON Files
1. **Extract new JSON files** from the updated Mine & Slash mod
2. **Replace the old files** in your local project folders:
   - `mmorpg_affixes/chaos_stat/`
   - `mmorpg_affixes/crafted_jewel_unique/`
   - `mmorpg_affixes/enchant/`
   - `mmorpg_affixes/implicit/`
   - `mmorpg_affixes/jewel/`
   - `mmorpg_affixes/jewel_corruption/`
   - `mmorpg_affixes/prefix/`
   - `mmorpg_affixes/suffix/`
   - `mmorpg_affixes/tool/`
   - `mmorpg_base_gear_types/`
   - `mmorpg_support_gem/`

## Step 2: Regenerate Index Files
Open Command Prompt/Terminal in your project folder and run:

node generate-index.js

This will scan all folders and create new index.json files with the updated file lists.
## Step 3: Create Combined Data File
Run the combine script to create a single optimized data file:

node combine.js

This creates combined-data.json which makes the website load much faster.

## Step 4: Test Locally
Start your local server to test the updates:

npx serve .

Open http://localhost:3000 and verify:
✅ Data loads successfully
✅ New items appear in dropdowns
✅ Counters show correct numbers
✅ JSON generation works

## Step 5: Deploy to GitHub Pages
Add all files to Git:

## Step 6: Verify Online
Visit your GitHub Pages URL and confirm everything works correctly.
🚨 Troubleshooting
Problem: Files not loading
Solution: Check that index.json files were created in each folder
Solution: Verify combined-data.json was generated
Problem: New items not showing
Solution: Clear browser cache (Ctrl+F5)
Solution: Check file paths match the folder structure
Problem: GitHub Pages not updating
Solution: Check the "Actions" tab in your GitHub repository for build errors
Solution: Ensure all files were committed and pushed

## Quick Command Summary
# 1. Regenerate indexes
node generate-index.js

# 2. Combine data
node combine-data.js

# 3. Test locally
npx serve .

# 4. Deploy to GitHub
git add .
git commit -m "Update to Mine & Slash v[VERSION]"
git push origin main