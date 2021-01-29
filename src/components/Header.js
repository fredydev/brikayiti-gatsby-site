import React, {useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import { Link, navigate } from 'gatsby';
import { Auth } from 'aws-amplify'
import { isLoggedIn, logout } from '../services/auth'
import logo from '../images/brikayiti-logo1.png';
import { animation, colors, fonts, media } from '../tokens';
import { ImSearch,ImHome,ImCross,ImMenu } from "react-icons/im";
import { GrAnnounce } from "react-icons/gr";
import { GoPlus } from "react-icons/go";
import { Transition } from 'react-transition-group';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
// import Search from './Search';

const Header = styled('header')`
  /* border: solid blue; */
  border-bottom: solid ${colors.yellow};
  height: 80px;
  background-color: ${colors.lightest};
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
  .for-mobile{
    display: none;
    /* border: solid red; */
    @media ${media.large} {
      display: flex;
      height: 100%;
      .mobile-logo-link{
        left: 5%;
        top: 10%;
      }
      .menu-button, .close-button{
        font-size: 2rem;
        color: ${colors.yellow};
        cursor: pointer;
      
       
        position: absolute;
        top: 30%;
        right: 5%;
      }
    }
  }
  .mobile-menu{
    display: none;
    @media ${media.large} {

      display: inherit;
      background-color: rgba(0,0,0,0.7);
      .mobile-menu-container{
        background-color: white;
        height: 100%;
        width: 75%;
        display: flex;
        flex-direction: column;
        padding: 15px;
        a{
          display: block;
          font-size: ${fonts.heading};
          color: ${colors.black};
          text-decoration: none;
          font-weight: bold;
          padding: 8px;
          transition:all .2s ease-in-out;
          &:hover{
            background-color: rgba(225,166,0, 0.1);
            transition:all .2s ease-in-out;
            color: ${colors.yellow}
          }
        }
      }
     
    }
    
  }
`;

const SkipToContent = styled('a')`
  transition: none;

  :focus,
  :active,
  :hover {
    clip: auto;
    width: auto;
    height: auto;
    background-color: ${colors.lightest};
    border: 2px solid ${colors.darkest};
    border-radius: 0;
    color: ${colors.darkest};
    padding: 0.5rem 1rem;
    z-index: 5000;
  }
`;

const Nav = styled('nav')`
  box-sizing:border-box;
  height: 100%;
  max-width: 1440px;
  /* border: solid red; */
  display: flex;
  font-size: 0.875rem;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 0;
  position: relative;
  z-index: 5;

  @media ${media.large} {
    /* font-size: 1rem; */
    display: none;
  }
`;

const NavLink = styled(Link)`
  border: 2px solid transparent;
  border-radius: 0;
  color: ${colors.darkest};
  font-family: ${fonts.heading};
  font-weight: 900;
  line-height: 1.25;
  margin: 0;
  padding: calc(0.5rem - 2px) 0.25rem;
  text-decoration: none;
  /* text-transform: uppercase; */
  transition-property: color;

  &.active {
    color: ${colors.primary};
  }

  &.hiddenSmall {
    display: none;

    @media (min-width: 414px) {
      display: inline-block;
    }
  }

  @media ${media.small} {
    padding-left: 0.625rem;
    padding-right: 0.625rem;
  }

  :focus,
  :active,
  :hover {
    background-color: transparent;
    border-radius: 0;
    color: ${colors.yellow};
  }

  :focus {
    border-color: ${colors.darkest};
  }
`;

const LogoLink = styled(NavLink)`
  border: 0;
  /* border: solid green; */
  margin-right: 2.5rem;
  padding: 0;
  position: relative;
  z-index: 10;

  @media ${media.small} {
    padding: 0;
  }

  

  :focus,
  :active,
  :hover {
    outline: 0;
  }

  :focus {
    ::after {
      opacity: 1;
    }
  }
`;

const Logo = styled('img')`
  /* position: absolute; */
  /* width: 100px; */
  /* border: solid orange; */
  z-index: 2;
`;
export const AnnonceButton = styled("button")`
  background-color: ${props=>props.border?"transparent":colors.yellow};
  color: ${props=>props.border&&colors.yellow};
  transition: all .2s ease-in-out;
  padding: 15px;
  border: ${props=>props.border?`1px solid ${colors.yellow}`:`1px solid ${colors.white}`};
  border-radius: 2px;
  display: flex;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  .icon{
    margin-left: 10px;
    font-size: 30px;
  }
  &:hover{
    transition: all .3s ease-in-out;
    background-color: ${colors.yellow};
    color: ${props=>props.border&&"whitesmoke"};
  }
`
const GroupLink = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
`
const topLevelNav = [
  // {
  //   href: '/home/',
  //   label: 'Accueil',
  //   icon: <ImHome />
  // },
  {
    href: '/rechercher/',
    label: 'Recherche',
    icon: <ImSearch />
  },
  // {
  //   href: '/speaking/',
  //   label: 'Speaking',
  //   extraClass: 'hiddenSmall',
  // },
];
const mobileMenuLinks = [
  {
    name: 'Deposer une annonce',
    link: '/deposer-une-annonce'
  },
  {
    name: 'Rechercher',
    link: '/rechercher'
  }
];
const duration = 300
const defaultStyle = {
  zIndex: '-1',
  transition: `width ${duration}ms ease-in-out`,
  width: 0,
  height: "100vh"
};

const transitionStyles = {
  entering: { width: '0',transition: `width ${duration}ms ease-in-out` },
  entered: { width: '100vw',transition: `width ${duration}ms ease-in-out` },
  exiting: { width: 0,transition: `width ${duration}ms ease-in-out` },
  exited: { width: 0,transition: `width ${duration}ms ease-in-out` }
};
export default () => {
  const [visible,setVisible] = useState()
  const mobileMenu = useRef(null)
  useEffect(()=>{
    // handle()

    return ()=>{
      clearAllBodyScrollLocks()
    }
  },[])
  const onEntering = () => {
    disableBodyScroll(mobileMenu);
  }

  const onExiting = () => {
    enableBodyScroll(mobileMenu);
  }
  if(visible){
    onEntering()
  }
  if(!visible){
    onExiting()
  }
  const toggleMobileMenu = () => {
    // console.log("touch menu button or cross button")
      setVisible(!visible)
  }
  return(
  
  <Header role="banner">
    <SkipToContent
      href="#content"
      id="skip-navigation"
      className="screen-reader-text"
    >
      Skip to Content
    </SkipToContent>
    <div className="for-mobile">
      <LogoLink to="/" className="mobile-logo-link">
          <Logo
            src={logo}
            alt="Brikayiti Logo"
            // This keeps the logo from flashing at full-width on fresh loads.
            style={{ maxWidth: '100px' }}
          />
      </LogoLink>
    
      {visible?<ImCross onClick={toggleMobileMenu} className="close-button" />:<ImMenu onClick={toggleMobileMenu} className="menu-button"/>}
    </div>
    <Nav>
      
      <GroupLink>
      <LogoLink to="/">
        <Logo
          src={logo}
          alt="Brikayiti Logo"
          // This keeps the logo from flashing at full-width on fresh loads.
          style={{ maxWidth: '100px' }}
        />
    </LogoLink>
    <Link to="/deposer-une-annonce">
      <AnnonceButton>
        Faire une annonce 
        <GrAnnounce className="icon"/>
      </AnnonceButton>
    </Link>
      {topLevelNav.map(({ href, label,icon, extraClass = '' }) => (
        <NavLink
          key={label}
          to={href}
          className={`${extraClass} text-sharp`}
          activeClassName="active"
        > {icon}
          {label}
        </NavLink>
      ))}
      </GroupLink>
      <GroupLink>
        <AnnonceButton border>
        <GoPlus />Publier un bien
        </AnnonceButton>

        {
          isLoggedIn()
          ?
          (<>
            <NavLink className={` text-sharp`} to="/app/profile">
              Profile
            </NavLink>
            <button
              className="logout-button"
              onClick={() =>
                Auth.signOut()
                .then(logout(() => navigate('/app/login')))
                .catch(err => console.log('error:', err))
              }
              onKeyDown={() =>
                Auth.signOut()
                .then(logout(() => navigate('/app/login')))
                .catch(err => console.log('error:', err))
              }
              role="button"
              tabIndex="0"
            >
            Sign Out
            </button>
            
            </>
          )
          :
          <NavLink className={` text-sharp`} to="/app/login">
            Se connecter
          </NavLink>}

        </GroupLink>
      
      {/* <Search /> */}
    </Nav>
    <Transition
    in={visible}
    timeout={duration}
    unmountOnExit
    onEntering={onEntering}
    onExiting={onExiting}
    >
      {state=><div className="mobile-menu" ref={mobileMenu}style={{
                ...defaultStyle,
                ...transitionStyles[state]
                // Prevent gap being shown at bottom of mobile menu
                // top: '4em'
              }}>
                <div className="mobile-menu-container">
                {mobileMenuLinks.map((item, i) => (
                  <Link
                    key={i}
                    to={item.link}
                    
                  >
                    {item.name}
                  </Link>
                ))}
                {
                  isLoggedIn()
                  ?
                  <Link to="/app/profile" className="profile">Profile</Link>
                  :
                  <NavLink className={` text-sharp`} to="/app/login">
                    Se connecter
                  </NavLink>
                }
                </div>
                
                </div>}
    </Transition>
  </Header>
)};
