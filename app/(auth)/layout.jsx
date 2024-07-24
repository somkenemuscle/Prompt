import Navbar from "@components/shared/navbar"
function Layout({ children }) {
    return (
        <div >
            <Navbar />
            <main className='auth'>
                {children}
            </main>
        </div>
    )
}

export default Layout