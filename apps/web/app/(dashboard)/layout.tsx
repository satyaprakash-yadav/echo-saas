import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { OrganizationGuard } from "@/modules/auth/ui/components/organization-guard";

interface Props {
    children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
    return (
        <AuthGuard>
            <OrganizationGuard>
                {children}
            </OrganizationGuard>
        </AuthGuard>
    );
};

export default Layout;
