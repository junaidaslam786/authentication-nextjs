import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"
import classes from './main-navigation.module.css';

function MainNavigation() {

    const { data: session, status } = useSession();

    function logoutHandler() {
        signOut();
    }


    return (
        <header className={classes.header}>
            <Link href='/'>
                <a>
                    <div className={classes.logo}>Limbo News</div>
                </a>
            </Link>
            <nav>
                <ul>
                    {!session && (

                        <li>
                            <Link href='/auth'>Login</Link>
                        </li>
                    )}
                    {session && (
                        <li>
                            <Link href='/profile'>Profile</Link>
                        </li>
                    )}
                    {session && (
                        <li>
                            <button onClick={logoutHandler}>Logout</button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;