type ProfileSetupTypeStudent = {
  name: string;
  email: string;
  confirmEmail: string;
  password: string;
  topics: string[];
  bio: string;
  country: string;
};

interface StepProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  steps: {
    title: string;
    icon: any;
  }[];
  complete: boolean;
  setComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

export type { ProfileSetupTypeStudent, StepProps };
