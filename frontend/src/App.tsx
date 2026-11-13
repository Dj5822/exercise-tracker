import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ColorModeContext from './context/ColorModeContext';
import Datapage from './pages/Datapage';
import Homepage from './pages/Homepage';
import PageLayout from './pages/PageLayout';

function App() {
    const [mode, setMode] = React.useState<'light' | 'dark'>(() =>
        window.localStorage.getItem('exercise-tracker-mode') === 'light' ? 'light' : 'dark'
    );
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((current) => {
                    const next = current === 'light' ? 'dark' : 'light';
                    window.localStorage.setItem('exercise-tracker-mode', next);
                    return next;
                });
            },
        }),
        [],
    );

    return (
        <div className={mode}>
            <ColorModeContext.Provider value={colorMode}>
                <Routes>
                    <Route path="/" element={<PageLayout />}>
                        <Route index element={<Navigate to="home" replace />} />
                        <Route path="home" element={<Homepage />} />
                        <Route path="data" element={<Datapage />} />
                    </Route>
                </Routes>
            </ColorModeContext.Provider>
        </div>
    );
}

export default App;
