interface Props {
    children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
    return (
        <div className="min-h-screen min-w-screen h-full flex flex-col items-center justify-center">
            {children}
        </div>
    );
};

export default Layout;
