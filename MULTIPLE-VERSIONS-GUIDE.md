# Multiple Resume Versions - Feature Guide

## 🎯 Overview

The resume editor now supports **multiple resume versions** with a centralized master data pool. This allows you to:

- Maintain all your experiences, projects, education, and skills in one place (master data)
- Create multiple tailored resume versions (e.g., "Software Engineer", "Data Scientist", "Frontend Developer")
- Select which items from your master data to include in each version
- Customize items independently per version without affecting other versions or the master data

## 🚀 Quick Start Guide

### 1. **Build Your Master Data Pool**

First, add all your experiences, projects, education, and skills to your master data:

1. Click the **"Master Data"** button in the top navigation
2. Use the tabs to navigate between sections:
   - **Experience**: Add all your work experiences
   - **Projects**: Add all your projects
   - **Education**: Add all your degrees/certifications
   - **Skills**: Add all your skill categories
3. Click **"Add Experience/Project/Education/Category"** to create new items
4. Edit or delete items as needed

**Tips:**
- Add everything you might want to include in any resume version
- Use descriptive names and complete bullet points
- You can see which versions use each item (shown as badges)

### 2. **Create Resume Versions**

Create different versions of your resume for different job applications:

1. Click the **version dropdown** in the top left (next to "Resume Editor")
2. Select **"Create New Version"**
3. Enter a name (e.g., "Software Engineer Resume")
4. Optionally add a description
5. Click **"Create Version"**

**Tips:**
- Create versions for different roles or industries
- Use descriptive names to easily identify each version
- You can create as many versions as you need

### 3. **Add Items to a Version**

Populate your resume version with selected items from master data:

1. Ensure you're viewing the correct version (check the version dropdown)
2. In each section (Experience, Projects, Education, Skills):
   - Click the **Database icon** (📊) button
   - A dialog will open showing all items from your master data
   - **Check the boxes** next to items you want to include
   - Click **"Add Selected"**

**Tips:**
- Search/filter items using the search box
- Items already in the version show "Already added" badges
- You can add multiple items at once

### 4. **Customize Items Per Version**

Edit items within a version without affecting other versions:

1. Click on any item in a section to expand the editor
2. Make your changes (modify bullets, dates, descriptions, etc.)
3. Changes only apply to the current version
4. The master data remains unchanged

**Tips:**
- Tailor bullet points for specific job requirements
- Reorder bullets within items
- Add/remove bullet points as needed

### 5. **Switch Between Versions**

Easily switch between your different resume versions:

1. Click the **version dropdown** in the top navigation
2. Select the version you want to view/edit
3. The entire editor updates to show that version's content

**Tips:**
- The active version is shown in the dropdown
- Each version maintains its own selection and customizations

### 6. **Manage Your Versions**

Rename, duplicate, or delete versions:

1. Click the version dropdown → **"Manage Versions"**
2. In the dialog, you can:
   - **Rename**: Click the pencil icon to edit name/description
   - **Duplicate**: Click the copy icon to create a copy
   - **Delete**: Click the trash icon (must have at least one version)
   - **Switch**: Click "Switch" to change to that version

**Tips:**
- Duplicate versions to create similar resumes quickly
- Last modified timestamps help track recent changes
- Item counts show how many items are in each version

## 📋 Key Concepts

### Master Data vs Versions

- **Master Data**: Your complete pool of all experiences, projects, education, and skills
  - One centralized location for all content
  - Shared header (name, contact info) across all versions
  - Edit master items to update the source content

- **Resume Versions**: Individual resumes tailored for specific purposes
  - Each version contains **copies** of selected master items
  - Edits to version items don't affect master data or other versions
  - Independent customization per version

### Item Lifecycle

```
1. Create in Master Data
   ↓
2. Add to Version (creates a copy with masterId reference)
   ↓
3. Customize in Version (edits are version-specific)
   ↓
4. Optional: Sync from Master (pull latest master changes)
```

## 🎨 Workflow Examples

### Example 1: Tailoring for Different Roles

**Scenario**: Applying to both frontend and full-stack positions

1. **Master Data**: Add all 10 of your experiences and 15 projects
2. **Frontend Version**:
   - Select 4 frontend-heavy experiences
   - Select 6 frontend projects
   - Customize bullets to emphasize UI/UX work
3. **Full-Stack Version**:
   - Select 5 full-stack experiences
   - Select 8 projects showing both frontend and backend
   - Customize bullets to show full-stack capabilities

### Example 2: Industry-Specific Resumes

**Scenario**: Applying to different industries

1. **Master Data**: All experiences with comprehensive bullets
2. **Tech Startup Version**:
   - Select fast-paced, agile experiences
   - Emphasize innovation and rapid development
   - Include cutting-edge tech projects
3. **Enterprise Version**:
   - Select experiences with large-scale systems
   - Emphasize stability, scalability, security
   - Include enterprise integration projects

## ⚙️ Advanced Features

### Header Management

The header (name, email, phone, etc.) is **shared across all versions**:
- Edit header in the Header section
- Changes apply to all resume versions
- Use the same contact info for all applications

### Skills Management

Skills are organized into categories:
- Create skill categories in master data (e.g., "Languages", "Frameworks")
- Each category contains multiple skills
- Add entire categories to versions
- Customize category names and skills per version

### Empty States

Helpful prompts guide you when sections are empty:
- No master data: "Add items to master data first"
- No version items: Options to "Add from Master" or "Create New"
- No versions: "Create Version" button prominently displayed

## 🔄 Migration & Compatibility

### Automatic Migration

If you had existing resume data:
- ✅ Automatically migrated to new versioned structure
- ✅ Creates a default version called "My Resume"
- ✅ All existing data preserved in both master and version
- ✅ No data loss or manual migration required

### Backward Compatibility

- ✅ PDF upload still works (adds to master + current version)
- ✅ LaTeX export works (generates from current version)
- ✅ AI improvements work on current version
- ✅ All existing features continue to function

## 🎯 Best Practices

1. **Start with Master Data**
   - Add everything to master data first
   - Write comprehensive, detailed bullets
   - Keep master data complete and up-to-date

2. **Create Targeted Versions**
   - Make versions for specific roles or companies
   - Select only relevant experiences/projects
   - Tailor bullets to match job descriptions

3. **Use Descriptive Names**
   - "Software Engineer - FAANG" vs "Resume 1"
   - Add descriptions to remember the purpose
   - Include date or company names if helpful

4. **Regular Maintenance**
   - Update master data after new experiences
   - Review and update existing versions
   - Delete outdated versions

5. **Version Management**
   - Keep 3-5 active versions maximum
   - Duplicate and modify for similar roles
   - Archive old versions (delete if not needed)

## 🐛 Troubleshooting

**Q: Items I added to master data don't show in my version**
- A: Use the Database icon in each section to add items from master

**Q: Changes to an item appear in all versions**
- A: You're editing master data. Edit items within the version editor instead.

**Q: I can't find the version switcher**
- A: It's in the top navigation bar, left side, next to "Resume Editor"

**Q: My PDF upload overwrote my versions**
- A: PDF upload updates the current version. Switch versions if needed.

**Q: How do I copy content between versions?**
- A: Both versions can select the same item from master data, then customize independently

## 📊 Summary of UI Components

- **Version Dropdown**: Top left - Switch between versions and create new ones
- **Master Data Button**: Top right - Manage your master data pool
- **Database Icon (📊)**: In each section - Add items from master data
- **Plus Icon (+)**: In each section - Create new items directly in version
- **Manage Versions**: In version dropdown - Rename, duplicate, delete versions

## 🎉 Feature Highlights

✅ **Unlimited Versions**: Create as many resume versions as you need
✅ **Master Data Pool**: One source of truth for all content
✅ **Independent Customization**: Edit each version without affecting others
✅ **Easy Selection**: Checkbox interface to add items from master
✅ **Search & Filter**: Find items quickly in large master data sets
✅ **Usage Tracking**: See which versions use which master items
✅ **Auto-save**: All changes automatically persisted to localStorage
✅ **Zero Data Loss**: Automatic migration preserves all existing data

---

**Ready to create your first version?** Click the version dropdown and select "Create New Version"!
