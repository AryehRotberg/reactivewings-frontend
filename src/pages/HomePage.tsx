import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../services/user';
import { BACKEND_OAUTH_URL } from '../config';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function HomePage() {
    const navigate = useNavigate();

    const handleSignIn = async () => {
        const userInfo = await getUserInfo();
        if (userInfo) {
            navigate('/dashboard');
        } else {
            window.location.href = `${BACKEND_OAUTH_URL}oauth2/authorization/google`;
        }
    };

    return (
        <>
            <Header onSignIn={handleSignIn} />
            <Hero onGetStarted={handleSignIn} />
            <Features />
            <Footer />
        </>
    );
}
