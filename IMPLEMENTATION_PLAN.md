# AI Resume Improvement Feature - Implementation Plan

## Overview
Add a "one-click magic improve your resume" feature that analyzes and improves resume content based on best practices from the comprehensive tech resume guide. The feature will show before/after comparisons with **explanations for each improvement**.

## User Experience Flow

1. User clicks **"✨ Improve Resume"** button in ActionBar
2. Loading state shows while AI analyzes entire resume
3. Comparison dialog opens showing:
   - **Before/After side-by-side for each section**
   - **Reasons explaining why each change was made**
   - Accept/Reject buttons
4. User reviews changes and decides
5. Changes applied to store, dialog closes, success toast

## Technical Architecture

### 1. API Endpoint: `/app/api/improve-resume/route.ts`

**Input:**
```typescript
POST /api/improve-resume
{
  resume: Resume // Full resume object from store
}
```

**Output Schema (with reasons):**
```typescript
{
  improvements: {
    experience: [
      {
        id: string,
        bullets: [
          {
            original: string,
            improved: string,
            reason: string // WHY this change improves the resume
          }
        ]
      }
    ],
    projects: [
      {
        id: string,
        bullets: [
          {
            original: string,
            improved: string,
            reason: string
          }
        ]
      }
    ],
    skills: {
      original: Skills,
      improved: Skills,
      reason: string // Overall explanation for skill reorganization
    }
  }
}
```

**AI Prompt Strategy:**
Uses OpenAI `generateObject()` with structured schema. Prompt will include:
- The resume guidelines (all 13 sections)
- Specific instructions for each section type
- Request for explanations using the guideline principles

**Key Improvement Rules from Guidelines:**
- Transform "Built X using Y" → "Built X using Y to solve Z, resulting in [impact]"
- Add impact keywords: automated, eliminated, reduced, improved, enabled, simplified
- Remove soft skills, adjectives, passive voice
- Group skills by category (Languages, Frontend, Backend, Systems, Tools)
- Ensure every bullet has Problem → Action → Impact structure
- Use strong verbs: built, designed, automated, architected, shipped
- Show technical/operational/architectural impact (not just user numbers)

### 2. UI Components

#### New Components to Create:

**`/components/resume/improve-resume-button.tsx`**
- Button in ActionBar
- Handles click → calls API → opens dialog
- Loading state management

**`/components/resume/improvement-dialog.tsx`**
- Large dialog with scrollable content
- Tabbed sections: Experience, Projects, Skills
- Each tab shows before/after comparisons
- **Collapsible reason cards** for each improvement
- Accept/Reject buttons at bottom

**`/components/resume/improvement-comparison.tsx`**
- Reusable component for before/after display
- Two columns: Original | Improved
- Diff highlighting (optional)
- Reason badge/accordion below each comparison

### 3. Zustand Store Updates

Add to `/hooks/use-resume.ts`:
```typescript
{
  // ... existing state
  applyImprovements: (improvements: ImprovedResume) => void
}
```

This method will:
- Update experience bullets
- Update project bullets
- Update skills structure
- Trigger re-render of all sections

### 4. Type Definitions

Add to `/lib/types/resume.ts` (or new file):
```typescript
export interface BulletImprovement {
  original: string;
  improved: string;
  reason: string;
}

export interface ExperienceImprovement {
  id: string;
  bullets: BulletImprovement[];
}

export interface ProjectImprovement {
  id: string;
  bullets: BulletImprovement[];
}

export interface SkillsImprovement {
  original: Skills;
  improved: Skills;
  reason: string;
}

export interface ImprovedResume {
  experience: ExperienceImprovement[];
  projects: ProjectImprovement[];
  skills: SkillsImprovement;
}
```

## Implementation Steps

### Phase 1: API Endpoint (Core Logic)
1. Create `/app/api/improve-resume/route.ts`
2. Define Zod schemas for improvement response (with reasons)
3. Craft comprehensive prompt using the guideline rules
4. Implement `generateObject()` call with structured output
5. Add error handling and validation
6. Test with sample resume data

### Phase 2: Type Definitions
1. Add improvement types to `/lib/types/resume.ts`
2. Export all interfaces

### Phase 3: UI Components
1. Create `improve-resume-button.tsx` (simple button with loading state)
2. Create `improvement-comparison.tsx` (reusable before/after with reason)
3. Create `improvement-dialog.tsx` (main dialog with tabs + comparisons)
4. Wire up to API endpoint

### Phase 4: Store Integration
1. Add `applyImprovements()` method to Zustand store
2. Connect dialog Accept button to store method
3. Add toast notifications

### Phase 5: Polish
1. Add loading spinners
2. Add error handling with user-friendly messages
3. Add keyboard shortcuts (Escape to close, Enter to accept)
4. Add analytics/tracking (optional)
5. Test with various resume formats

## Design Considerations

### Reasons Display Options

**Option A: Inline Badges** (Recommended)
```
[Before]                           [After]
Built backend routes in Express    Built a modular Express API routing...

💡 Added impact metrics and made architecture explicit
```

**Option B: Collapsible Accordions**
- Each comparison has "Why?" button
- Expands to show detailed explanation
- Cleaner UI, but requires extra click

**Option C: Tooltip Hovers**
- Hover over improved text to see reason
- Compact, but less discoverable

**Recommendation:** Use inline badges for primary reasons, with expandable accordion for detailed guidelines reference.

### Error Handling

- API timeout: "Improvement taking longer than expected. Please try again."
- API error: "Unable to improve resume. Check your internet connection."
- Empty resume: "Please add content to your resume first."
- Partial failure: "Some sections couldn't be improved. Applied partial changes."

### Performance

- Show progress indicator during API call
- Consider streaming improvements (optional, for future)
- Cache improvements temporarily (allow re-review without re-calling API)

## Files to Create/Modify

### New Files (5):
1. `/app/api/improve-resume/route.ts` - API endpoint
2. `/components/resume/improve-resume-button.tsx` - Button component
3. `/components/resume/improvement-dialog.tsx` - Dialog component
4. `/components/resume/improvement-comparison.tsx` - Comparison component
5. `/lib/types/improvements.ts` - Type definitions for improvements

### Modified Files (2):
1. `/components/resume/action-bar.tsx` - Add ImproveResumeButton
2. `/hooks/use-resume.ts` - Add applyImprovements method

## Dependencies

All required dependencies already exist:
- ✅ `ai` + `@ai-sdk/openai` - AI SDK
- ✅ `zod` - Schema validation
- ✅ `sonner` - Toast notifications
- ✅ `lucide-react` - Icons (Sparkles, Check, X)
- ✅ shadcn/ui components (Dialog, Tabs, Accordion, Button, Badge)

## Testing Strategy

1. **Unit Tests:**
   - Test improvement logic with sample bullets
   - Test reason generation quality
   - Test skills reorganization

2. **Integration Tests:**
   - Test API endpoint with full resume
   - Test dialog open/close flow
   - Test accept/reject flows

3. **Manual Testing:**
   - Test with weak bullets → verify improvements
   - Test with already-good bullets → verify minimal changes
   - Test with edge cases (empty sections, very long bullets)
   - Verify reasons are helpful and accurate

## Success Metrics

- Improvements follow all 13 guideline principles
- Reasons clearly explain the "why" behind each change
- Users understand and learn from the explanations
- Improved bullets score higher on impact/clarity
- Dialog is intuitive and responsive
- No regressions in existing functionality

## Future Enhancements (Not in Initial Scope)

- Section-level improve buttons
- Item-level inline suggestions
- Real-time improvement hints while typing
- A/B testing different improvement strategies
- "Explain this guideline" tooltips
- Export improvement report as PDF
- Undo/redo improvement history
