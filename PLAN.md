# Multiple Resume Versions Implementation Plan

## Overview
Implement a feature that allows users to maintain a master resume database and create multiple tailored resume versions by selecting and customizing specific items from the master data.

## Requirements Summary
Based on user input:
- **Edit Behavior**: Version-specific overrides (each version can customize items independently)
- **Header Data**: Shared across all versions
- **Education/Skills**: Selectable per version (like experiences and projects)
- **Item Ordering**: Independent ordering within each version

## Architectural Design

### Data Structure

```typescript
// Master data - the source of truth for all resume content
interface MasterData {
  header: ResumeHeader;  // Shared across all versions
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategory[];  // Restructure from Record<string, string[]>
}

interface SkillCategory {
  id: string;
  name: string;  // e.g., "Languages", "Frontend"
  skills: string[];
}

// Individual resume version
interface ResumeVersion {
  id: string;
  name: string;  // e.g., "Software Engineer Resume", "Data Science Resume"
  description?: string;
  createdAt: string;
  lastModified: string;

  // Selected and possibly customized items (stored as complete copies)
  education: EducationItem[];  // Copies from master, can be edited
  experience: ExperienceItem[];  // Copies from master, can be edited
  projects: ProjectItem[];  // Copies from master, can be edited
  skillCategories: SkillCategory[];  // Copies from master, can be edited
}

// Add metadata to track master relationship
interface VersionItem extends ExperienceItem | ProjectItem | EducationItem {
  masterId?: string;  // Reference to original master item (for sync features)
}

// New store structure
interface ResumeStore {
  // Master data
  masterData: MasterData;

  // Versions
  versions: ResumeVersion[];
  currentVersionId: string | null;

  // Computed getter for current resume (backward compatibility)
  resume: Resume | null;  // Derived from current version

  // Master data actions
  addMasterEducation: (item: EducationItem) => void;
  updateMasterEducation: (id: string, updates: Partial<EducationItem>) => void;
  deleteMasterEducation: (id: string) => void;
  addMasterExperience: (item: ExperienceItem) => void;
  updateMasterExperience: (id: string, updates: Partial<ExperienceItem>) => void;
  deleteMasterExperience: (id: string) => void;
  addMasterProject: (item: ProjectItem) => void;
  updateMasterProject: (id: string, updates: Partial<ProjectItem>) => void;
  deleteMasterProject: (id: string) => void;
  addMasterSkillCategory: (category: SkillCategory) => void;
  updateMasterSkillCategory: (id: string, updates: Partial<SkillCategory>) => void;
  deleteMasterSkillCategory: (id: string) => void;
  updateMasterHeader: (header: Partial<ResumeHeader>) => void;

  // Version management actions
  createVersion: (name: string, description?: string) => string;
  deleteVersion: (versionId: string) => void;
  duplicateVersion: (versionId: string, newName: string) => string;
  switchVersion: (versionId: string) => void;
  renameVersion: (versionId: string, name: string, description?: string) => void;

  // Version content actions (for current version)
  addItemToCurrentVersion: (type: 'education' | 'experience' | 'projects' | 'skills', masterId: string) => void;
  removeItemFromCurrentVersion: (type: 'education' | 'experience' | 'projects' | 'skills', itemId: string) => void;
  updateCurrentVersionEducation: (education: EducationItem[]) => void;
  updateCurrentVersionExperience: (experience: ExperienceItem[]) => void;
  updateCurrentVersionProjects: (projects: ProjectItem[]) => void;
  updateCurrentVersionSkills: (skillCategories: SkillCategory[]) => void;
  reorderCurrentVersionItems: (type: 'education' | 'experience' | 'projects' | 'skills', itemIds: string[]) => void;
  syncItemFromMaster: (type: string, itemId: string) => void;  // Pull latest from master

  // Backward compatibility (delegate to current version)
  updateHeader: (header: Partial<ResumeHeader>) => void;  // Updates master header
  updateEducation: (education: EducationItem[]) => void;  // Updates current version
  updateExperience: (experience: ExperienceItem[]) => void;  // Updates current version
  updateProjects: (projects: ProjectItem[]) => void;  // Updates current version
  updateSkills: (skills: Skills) => void;  // Updates current version
}
```

### Implementation Strategy

**Phase 1: Data Structure Migration**
1. Update TypeScript types in `/lib/types/resume.ts`
   - Add `MasterData`, `ResumeVersion`, `SkillCategory` interfaces
   - Keep existing `Resume` interface for backward compatibility

2. Update Zustand store in `/hooks/use-resume.ts`
   - Migrate state structure to new schema
   - Implement migration logic to convert existing single resume to versioned structure
   - Add `resume` getter that derives from current version
   - Implement all new actions

3. Add migration logic for localStorage
   - Detect old format on load
   - Convert old `resume-storage` to new structure with single "Default" version
   - Preserve all existing data

**Phase 2: UI Components - Version Management**
1. Create `/components/resume/version-switcher.tsx`
   - Dropdown/Select component in ActionBar
   - Show current version name
   - List all versions
   - "New Version" button
   - "Manage Versions" button

2. Create `/components/resume/version-manager-dialog.tsx`
   - Dialog for version management
   - List of all versions with name, description, last modified
   - Actions: Rename, Duplicate, Delete
   - Create new version modal

**Phase 3: UI Components - Master Data Management**
1. Create `/components/resume/master-data-dialog.tsx`
   - Sheet/Dialog to view and manage master data
   - Tabs for Education, Experience, Projects, Skills
   - Add/Edit/Delete master items
   - Show usage count (how many versions use each item)

2. Create master item editors:
   - `/components/resume/master/master-education-list.tsx`
   - `/components/resume/master/master-experience-list.tsx`
   - `/components/resume/master/master-projects-list.tsx`
   - `/components/resume/master/master-skills-list.tsx`

**Phase 4: UI Components - Version Content Selection**
1. Update section components to support item selection:
   - Add "Add from Master" button to each section
   - Dialog/Sheet showing master items with checkboxes
   - Selected items appear in current version

2. Create `/components/resume/item-selector-dialog.tsx`
   - Reusable dialog for selecting items from master data
   - Checkbox list of master items
   - Search/filter functionality
   - Shows which items are already in version

3. Add drag-and-drop reordering to sections:
   - Install/use `@dnd-kit/core` or similar library
   - Add drag handles to items
   - Update order on drop

**Phase 5: UI Enhancements - Override Indicators**
1. Update item editors to show master relationship:
   - Badge showing "From Master" with master item name
   - "Sync from Master" button to pull latest changes
   - Visual indicator if item has been modified from master

2. Create `/components/resume/sync-from-master-button.tsx`
   - Button to sync item with master version
   - Show diff dialog before syncing
   - Confirm action

**Phase 6: Backward Compatibility & Migration**
1. Ensure existing features work:
   - PDF upload still creates items in master data + default version
   - LaTeX generator works with version data
   - AI improvement feature works with versions
   - File download uses current version

2. Update parser/generator:
   - `/lib/parser/latex-parser.ts` - parse into master + default version
   - `/lib/generator/latex-generator.ts` - generate from current version

**Phase 7: Polish & UX Improvements**
1. Add empty states:
   - No versions created
   - No items in master data
   - No items selected in version

2. Add onboarding flow:
   - First-time user guide
   - Tooltip explanations
   - Sample data option

3. Add keyboard shortcuts:
   - Quick version switching
   - Quick master data access

4. Add search/filter:
   - Search across master data
   - Filter versions by name/date

## Implementation Order

1. **Types & Store** (Phase 1)
   - Update types
   - Migrate store structure
   - Add migration logic
   - Test backward compatibility

2. **Version Switcher** (Phase 2, minimal UI)
   - Add basic version switcher to ActionBar
   - Implement create/switch/delete versions
   - Test version switching

3. **Master Data Management** (Phase 3)
   - Build master data dialog
   - Implement CRUD operations
   - Test data persistence

4. **Item Selection** (Phase 4)
   - Update sections to work with versions
   - Add "Add from Master" functionality
   - Implement item selection dialog
   - Add reordering capability

5. **Polish & Features** (Phase 5-7)
   - Override indicators
   - Sync from master
   - Empty states
   - Search/filter

## Migration Strategy

### Converting Existing Data
When user has existing resume data in localStorage:
1. Detect old format: `{ resume: Resume | null }`
2. Convert to new format:
   ```typescript
   {
     masterData: {
       header: existingResume.header,
       education: existingResume.education,
       experience: existingResume.experience,
       projects: existingResume.projects,
       skillCategories: convertSkillsToCategories(existingResume.skills)
     },
     versions: [{
       id: crypto.randomUUID(),
       name: "My Resume",
       description: "Imported from previous version",
       createdAt: new Date().toISOString(),
       lastModified: new Date().toISOString(),
       education: [...existingResume.education],
       experience: [...existingResume.experience],
       projects: [...existingResume.projects],
       skillCategories: convertSkillsToCategories(existingResume.skills)
     }],
     currentVersionId: <new-version-id>
   }
   ```
3. Save to localStorage with new format
4. Resume works exactly as before (backward compatibility maintained)

### Skills Migration
Convert `Skills` type from `Record<string, string[]>` to `SkillCategory[]`:
```typescript
function convertSkillsToCategories(skills: Skills): SkillCategory[] {
  return Object.entries(skills).map(([name, skillList]) => ({
    id: crypto.randomUUID(),
    name,
    skills: skillList
  }));
}
```

## Key Files to Modify

1. **Types**:
   - `/lib/types/resume.ts` - Add new interfaces

2. **Store**:
   - `/hooks/use-resume.ts` - Complete rewrite with migration

3. **Components (New)**:
   - `/components/resume/version-switcher.tsx`
   - `/components/resume/version-manager-dialog.tsx`
   - `/components/resume/master-data-dialog.tsx`
   - `/components/resume/item-selector-dialog.tsx`
   - `/components/resume/sync-from-master-button.tsx`
   - `/components/resume/master/` (directory for master item editors)

4. **Components (Update)**:
   - `/components/resume/action-bar.tsx` - Add version switcher
   - `/components/resume/sections/*.tsx` - Add "Add from Master" button
   - `/components/resume/sections/*-item-editor.tsx` - Add master indicators

5. **Parser/Generator**:
   - `/lib/parser/latex-parser.ts` - Parse into master + default version
   - `/lib/generator/latex-generator.ts` - Generate from current version

## Testing Checklist

- [ ] Existing users: Old data migrates correctly
- [ ] New users: Can create versions from scratch
- [ ] Version switching: Changes reflected immediately
- [ ] Master data edits: Don't affect existing version items
- [ ] Version item edits: Don't affect master data
- [ ] Item selection: Can add/remove items from versions
- [ ] Reordering: Items can be reordered within versions
- [ ] Sync from master: Updates version item with master changes
- [ ] PDF upload: Creates master items + adds to current version
- [ ] LaTeX export: Generates correct LaTeX from current version
- [ ] AI improvements: Works with current version items
- [ ] Persistence: All changes save to localStorage
- [ ] Header updates: Propagate to all versions

## Notes

- Skills structure changes from flat `Record<string, string[]>` to `SkillCategory[]` for better management
- Each version stores complete item copies (not references) for simplicity
- `masterId` field tracks relationship to master for sync functionality
- Backward compatibility maintained through `resume` getter in store
- Existing section components work with minimal changes (just delegate to version-specific actions)
