import { Onboarding } from '@page-ui/Onboarding/Onboarding';
import type { ReactNode } from 'react';

interface OnboardingPageProps {
    searchParams: Promise<{ edit?: string }>;
}

const OnboardingPage = async ({ searchParams }: OnboardingPageProps): Promise<ReactNode> => {
    const { edit } = await searchParams;
    return <Onboarding isEditing={edit === '1'} />;
};

export default OnboardingPage;
