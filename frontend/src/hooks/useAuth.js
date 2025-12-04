import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function useAuth() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                if (isMounted) {
                    setLoading(false);
                    if (!location.pathname.startsWith('/admin') && location.pathname !== '/login') {
                        navigate('/login', { replace: true });
                    }
                }
                return;
            }
            try {
                // Port 5001 ekanligiga e'tibor bering!
                const response = await fetch('http://localhost:5001/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok && isMounted) {
                    setIsLoggedIn(true);
                    setUserName(data.name);
                } else {
                    throw new Error('Token yaroqsiz');
                }
            } catch (error) {
                if (isMounted) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    setIsLoggedIn(false);
                    navigate('/login', { replace: true });
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        verifyUser();
        return () => { isMounted = false; };
    }, [navigate, location.pathname]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName(null);
        navigate('/login', { replace: true });
    };

    return { userName, handleLogout, loading, isLoggedIn };
}
export default useAuth;