import React from 'react'
import MainDiv from './LandingPageStyle'
import icon from '../../images/icon.png'
import PostPage from '../posts/PostPage'
const LandingPage = () => {
  return (
    <MainDiv>
        <header>
            <img src={icon} alt="icon" />
            <div className="btns">
                <button className="login">login</button>
                <button className="signup">Sign up</button>
            </div>
        </header>

        <PostPage/>
    </MainDiv>
  )
}

export default LandingPage