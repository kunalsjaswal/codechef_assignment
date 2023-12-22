import React, { useContext, useEffect, useState } from 'react'
import { ShowDiv } from './Style'
import CloseIcon from '@mui/icons-material/Close';
import contextStore from '../../context/ContextFile';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'; 
import EditComment from './EditComment';
import ShowReplies from '../reply/ShowReplies';

const ShowComments = () => {
  
  // hooks and all
  const {setCommentBox, filterGivenLevel, commentData,fetchComments,commentBox, blogs, filterTopLevel, topLevelComments, editInfo, setEditInfo} = useContext(contextStore)
  
  useEffect(()=>{
    filterTopLevel()
    filterGivenLevel() 

  },[commentData])
  
  // states
  const [liked, setLiked] = useState({})
  // handler
  const onCloseHandler=()=>{
      setCommentBox({status: false, id: 0})
  }

  const likePost=async(id, likes, flag)=>{
    const response = await fetch("http://localhost/apis/codechef_api/requests/like_comment.php",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({id, likes, flag})
    })
    fetchComments()

  }
  const dislikePost = async(id, dislikes, flag)=>{
    const response = await fetch("http://localhost/apis/codechef_api/requests/dislike_comment.php",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({id, dislikes, flag})
        
      })
      fetchComments()
  }
  const onLikeClickHandler=async(id, flag, likes, dislikes, add)=>{
      setLiked({...liked, [id]:[flag, false]})
      likePost(id, likes, add)
    
  }
  const onDislikeClickHandler=async(id, flag, likes, dislikes, add)=>{
    setLiked({...liked, [id]:[false, flag]})
    dislikePost(id, dislikes, add)
  }
  const onDeleteClickHandler=async(id)=>{
      const response = await fetch('http://localhost/apis/codechef_api/requests/delete_comment.php',{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({id:id})
      })
      const json = await response.json();
      fetchComments()
  }

  const onEditHandler=async(id, comment ,created_at)=>{
      let prev_date = new Date(created_at)
      let curr_date = new Date()
      let milisec = curr_date.getTime() - prev_date.getTime()

      let min = milisec / 60000
      if(min <= 5){
          setEditInfo({
            status:true,
            id:id,
            comment:comment,
          })
      }else{
        alert("Sorry u cannot edit after 5 minutes")
      }

  }

  const [replyOn, setReplyOn] = useState(false)
  const [replyText, setReplyText] = useState("")
  const onReplyButtonClickHandler=(id, replies)=>{
    if(replies == 50){
      alert("Maximum replies to this comment exceeds")
      return
    }

    if(replyOn){
      document.getElementById(`form-${id}`).style.display = "none"
    }else{
      document.getElementById(`form-${id}`).style.display = "block"
      setReplyText("")
    }
    setReplyOn(prev=> !prev)
  }

  const onReplyHandler=async(post_id, level, ref_id, replies)=>{
    if(replyText.length == 0) return
    

    const response = await fetch("http://localhost/apis/codechef_api/requests/add_reply.php",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
          post_id: post_id,
          user_id: localStorage.getItem('token'),
          user_name: localStorage.getItem('username'),
          comment:replyText,
          level:level,
          replies:replies,
          ref_id:ref_id
      })
    })
    const json = await response.json()
    onReplyButtonClickHandler(ref_id, replies)
    
    if(json['status']){
      fetchComments()
      setReplyText("")
    }
    
 }

 const [showReplyFlag, setShowReplyFlag] = useState(false)
 const showRepliesHandler=(id)=>{ 
      if(showReplyFlag){
        document.getElementById(`reply-${id}`).style.display = "none"
      }else{
        document.getElementById(`reply-${id}`).style.display = "block"
      }
      setShowReplyFlag(prev => !prev)
  }
  
  // return statement
  return (
    <ShowDiv>
        {/* {
          editInfo.status && 
          <EditComment/>
        } */}
        <header>
          <h2>Comments history ({topLevelComments.length})</h2>
          <CloseIcon fontSize='large' className='close-icon' onClick={onCloseHandler}/>
        </header>
        <h4 className='comment-info'>
          <span>
            {blogs[commentBox.id].username}.
          </span>
          <i> {blogs[commentBox.id].caption}</i>   
        </h4> 

        <div className='comment-section'>
        {   
            topLevelComments.map((val,indx)=>(              
                <div className='comment-box' key={indx}>
                    <div className="icon">
                      <AccountCircleIcon fontSize='large'/>
                    </div>

                    <div className="content">
                        <h3 className="head">
                          {val.user_name} <span>on {val.created_at.substr(0,10)}</span> 
                        </h3>
                        <div className="body">
                          {val.comment}
                        </div>

                        {
                          localStorage.getItem('token') && 

                          <div className="footer">
                            { 
                              liked[val.id] && liked[val.id][0] && <ThumbUpIcon onClick={()=>onLikeClickHandler(val.id,false, val.likes, val.dislikes, -1)} className='icon'/>
                            }
                            {
                              (!liked[val.id] || !liked[val.id][0]) && <ThumbUpOffAltIcon onClick={()=>onLikeClickHandler(val.id,true, val.likes, val.dislikes, 1)} className='icon'/> 
                            }
                            {val.likes}
                            {
                               liked[val.id] && liked[val.id][1] && <ThumbDownIcon onClick={()=>onDislikeClickHandler(val.id,false, val.likes, val.dislikes, -1)} className='icon' style={{marginLeft:"1%"}}/>
                            }
                            {
                              (!liked[val.id] || !liked[val.id][1]) && <ThumbDownOffAltIcon onClick={()=>onDislikeClickHandler(val.id,true, val.likes, val.dislikes, 1)} className='icon' style={{marginLeft:"1%"}}/>
                            }
                            {val.dislikes}
                            {
                               localStorage.getItem('token') === val.user_id && val.status && 
                               <>
                                <DeleteOutlineIcon onClick={()=>onDeleteClickHandler(val.id)} fontSize='small' className='dlt-btn'/>
                                  <span style={{cursor:"pointer"}} onClick={()=>onEditHandler(val.id, val.comment, val.created_at)}>edit</span>
                               </>
                            }
                            <button onClick={()=>onReplyButtonClickHandler(val.id, val.replies)}>reply</button>
                          </div>
                        }
                        <div className='reply-form' id={`form-${val.id}`}>
                            <input 
                              type="text" 
                              placeholder='reply here..'
                              value={replyText}
                              onChange={(ev)=> setReplyText(ev.target.value)}
                              />
                            <button onClick={()=>onReplyHandler(val.post_id, val.level+1, val.id, val.replies)}>REPLY</button>
                        </div>
                        
                        {
                            val.replies > 0 && 
                            <div className="open-replies" onClick={()=>showRepliesHandler(val.id)}>
                                {showReplyFlag && <ArrowDropUpIcon fontSize='large'/>}
                                
                                {!showReplyFlag && <ArrowDropDownIcon fontSize='large'/> }
                                <span> {val.replies} replies</span>
                            </div>
                        }
                        { 
                            <div id={`reply-${val.id}`} style={{display:"none"}}>
                              <ShowReplies ref_id = {val.id} level = {1}/>
                            </div>
                        }                        
                    </div>
                </div>
            ))
        }
        </div>

    </ShowDiv>
  )
}

export default ShowComments