import logo from '../assets/img/logo.png'

export function AppHeader() {
    return (
        <header className="app-header">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <h2 className="app-title">Mister Tasker</h2>
        </header>
    )
}
