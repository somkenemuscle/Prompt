import Navbar from "@/components/shared/navbar";

export default function Layout({ children }) {
    return (
        <main>
            <Navbar />
            
            <div>
                {children}
            </div>
        </main>
    );
}
