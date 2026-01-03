import './header.css'
import Button from "../Tools/button/button.jsx";
import { Monitor} from "lucide-react"

function Header(){
    return(
        <div>
            <header className="header">
                <div className="container header-inner">
                    <div className="logo">
                        <Monitor className="logo-icon" />
                        <span>Tims</span>
                    </div>

                    <nav className="nav">
                        <a href="#builds">Builds</a>
                        <a href="#calculator">Calculator</a>
                        <a href="#about">About</a>
                        <Button className="primary-btn" text='Contact Us'></Button>
                    </nav>
                </div>
            </header>
        </div>
    )
   
}

export default Header