export type TutorialStep = { id: string; text: string };

export type Tutorial = {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: TutorialStep[];
};
