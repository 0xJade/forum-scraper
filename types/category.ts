export type CategoryType =
  | 'governance'
  | 'technical'
  | 'community'
  | 'partnerships'
  | 'education'
  | 'announcements'
  | 'support'
  | 'meta';

export interface Category {
  id: CategoryType;
  name: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'governance',
    name: 'Governance',
    description: 'Proposals, voting, treasury decisions',
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Development updates, technical discussions, bug reports',
  },
  {
    id: 'community',
    name: 'Community',
    description: 'General discussions, onboarding, community building',
  },
  {
    id: 'partnerships',
    name: 'Partnerships',
    description: 'Collaborations, integrations, partnerships',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Tutorials, documentation, learning resources',
  },
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Important updates, launches, milestones',
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Help requests, troubleshooting, Q&A',
  },
  {
    id: 'meta',
    name: 'Meta',
    description: 'Forum governance, process improvements, meta-discussions',
  },
];

export function getCategoryById(id: CategoryType): Category | undefined {
  return CATEGORIES.find((cat) => cat.id === id);
}

