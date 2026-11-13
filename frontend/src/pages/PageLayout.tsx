import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import ColorModeContext from '../context/ColorModeContext';

const HomeIcon = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5"><path d="m3.5 10 8.5-7 8.5 7v10a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 20V10Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="M9 21v-7h6v7" stroke="currentColor" strokeWidth="1.7"/></svg>;
const ChartIcon = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5"><path d="M4 19V5m0 14h16M7 15l4-4 3 2 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="7" r="1.5" fill="currentColor"/></svg>;
const SunIcon = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;

const navItems = [
    { to: '/home', label: 'Overview', icon: HomeIcon },
    { to: '/data', label: 'Progress', icon: ChartIcon },
];

export default function PageLayout() {
    const colorMode = useContext(ColorModeContext);
    return (
        <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-[var(--line)] bg-[var(--app-bg)] px-5 py-7 lg:flex">
                <NavLink to="/home" className="mb-12 flex items-center gap-3 px-2">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-300 text-slate-950">
                        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true"><path d="M4 12h3l2-6 4 12 2-6h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span><span className="block text-sm font-bold tracking-wide">EXERCISE TRACKER</span><span className="block text-[10px] font-semibold uppercase tracking-[.22em] text-[var(--text-muted)]">Training log</span></span>
                </NavLink>
                <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-[var(--text-muted)]">Menu</p>
                <nav className="space-y-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-[var(--accent-soft)] text-lime-300' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'}`}>
                            <Icon />{label}
                        </NavLink>
                    ))}
                </nav>
                <div className="mt-auto rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                    <div className="mb-2 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-lime-300"/><span className="text-xs font-semibold">Personal tracker</span></div>
                    <p className="text-xs leading-relaxed text-[var(--text-muted)]">records.yaml · read only</p>
                </div>
            </aside>

            <header className="sticky top-0 z-10 border-b border-[var(--line)] bg-[var(--app-bg)]/85 backdrop-blur-xl lg:ml-64">
                <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
                    <NavLink to="/home" className="flex items-center gap-2.5 lg:hidden">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-300 text-slate-950"><ChartIcon /></span>
                        <span className="text-xs font-bold tracking-[.12em]">EXERCISE TRACKER</span>
                    </NavLink>
                    <div className="hidden lg:block"><p className="text-xs text-[var(--text-muted)]">EXERCISE RECORDS</p></div>
                    <div className="ml-auto flex items-center gap-3">
                        <span className="hidden rounded-full border border-[var(--line)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] sm:inline-flex">READ ONLY</span>
                        <button onClick={colorMode.toggleColorMode} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-secondary)] transition hover:border-lime-300/40 hover:text-lime-300" aria-label="Toggle color theme"><SunIcon /></button>
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface-raised)] text-xs font-bold text-lime-300">ET</div>
                    </div>
                </div>
            </header>

            <main className="mx-auto min-h-[calc(100vh-73px)] max-w-7xl px-5 pb-24 pt-9 sm:px-8 lg:ml-64 lg:px-10 lg:pb-12 lg:pt-12">
                <Outlet />
            </main>

            <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-[var(--line)] bg-[var(--app-bg)]/95 px-4 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl lg:hidden">
                {navItems.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex min-w-24 flex-col items-center gap-1 py-1.5 text-[10px] font-semibold ${isActive ? 'text-lime-300' : 'text-[var(--text-muted)]'}`}><Icon />{label}</NavLink>)}
            </nav>
        </div>
    );
}
