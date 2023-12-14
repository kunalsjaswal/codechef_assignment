import React from 'react'
import worldCupImage from '../../images/worldcup.png'
import icon1 from '../../images/icon.png'
import PostsDiv from './PsotPageStyle'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageIcon from '@mui/icons-material/Message';


const blogs = [
  {
    username: "harry",
    caption:"India losses World Cup 2023 Final.. ",
    icon:icon1,
    blog:worldCupImage
  },
  {
    username: "harry",
    caption:"India losses World Cup 2023 Final.. ",
    icon:icon1,
    blog:worldCupImage
  },
  {
    username: "harry",
    caption:"India losses World Cup 2023 Final.. ",
    icon:icon1,
    blog:worldCupImage
  }
]
const PostPage = () => {
  return (
    <PostsDiv>
      {blogs.map((val,key)=>(
        <div className="post">
          <div className="head">
              <img src={val.icon} alt="profile icon" />
              <h2>{val.username}</h2>
          </div>

          <div className="body">
            <img src={val.blog} alt="blog" />
          </div>

          <div className="footer">
            <div className="icons-tray">
              <div className="like-icon">
                <FavoriteBorderIcon fontSize='large' className='like-btn'/> 
                 86
              </div>
              <div className="cmt-icon">
                <MessageIcon style={{cursor:"pointer"}} fontSize='large'/>
                 15
              </div>
            </div>

            <div className='caption'>{val.caption}</div>
             
            <input type="text" disabled className="comment" placeholder='add your comment..'/>
          </div>
        </div>
      ))}
    </PostsDiv>
  )
}

export default PostPage