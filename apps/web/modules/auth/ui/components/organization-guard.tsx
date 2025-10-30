"use client";

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "@/modules/auth/ui/layouts/auth-layout";
import { OrgSelectionView } from "@/modules/auth/ui/views/org-selection-view";

interface Props {
    children: React.ReactNode;
};

export const OrganizationGuard = ({ children }: Props) => {
    const { organization } = useOrganization();

    if (!organization) {
        return (
            <AuthLayout>
                <OrgSelectionView />
            </AuthLayout>
        );
    };


    return (
        <>
            {children}
        </>
    );
};
