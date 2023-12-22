import React, { useContext, useEffect, useState } from 'react'
import { ReplyDiv } from './style'
import contextStore from '../../context/ContextFile'
import EditComment from '../comments/EditComment'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'; 

const ShowReplies = ({ref_id, level, rootReplies}) => {
    const {levelComments, fetchComments, editInfo ,setEditInfo} = useContext(contextStore)

    useEffect(()=>{
    },[])

    

   // states
  const [liked, setLiked] = useState({})
  // handler

  // liking the comment
  const onLikeClickHandler=async(id, flag, likes, dislikes, add)=>{
      setLiked({...liked, [id]:[flag, false]})
      likePost(id, likes, add)
    
  }
  const likePost=async(id, likes, flag)=>{
    const response = await fetch("http://13.211.139.220/apis/codechef_api/requests/like_comment.php",{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({id, likes, flag})
    })
    fetchComments()

  }

  // disliking the comment
  const onDislikeClickHandler=async(id, flag, likes, dislikes, add)=>{
    setLiked({...liked, [id]:[false, flag]})
    dislikePost(id, dislikes, add)
  }
  const dislikePost = async(id, dislikes, flag)=>{
    const response = await fetch("http://13.211.139.220/apis/codechef_api/requests/dislike_comment.php",{
        method:"PUT",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({id, dislikes, flag})
        
      })
      fetchComments()
  }
  
  // deleting the comment
  const onDeleteClickHandler=async(id)=>{
      const response = await fetch('http://13.211.139.220/apis/codechef_api/requests/delete_comment.php',{
          method:"DELETE",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({id:id})
      })
      const json = await response.json();
      fetchComments()
  }
  
  // Editing comment if time of creation is < 5
  const [text, setText] = useState("")
  const conditionOf5mint = (created_at) =>{
    let prev_date = new Date(created_at)
    let curr_date = new Date()
    let milisec = curr_date.getTime() - prev_date.getTime()
    
    let min = milisec / 60000

    return (min <= 5)
  }
  const onEditHandler=(id, comment ,created_at)=>{
      let condition = conditionOf5mint(created_at)

      if(condition){
          setText(comment)
          document.getElementById(`edit-${id}`).style.display="block"
          setEditInfo({
            status:true,
            id:id,
            comment:comment,
          })
      }else{
        document.getElementById(`edit-${id}`).style.display="none"
        alert("Sorry u cannot edit after 5 minutes")
      }

  }
  const onEditCLickHandler =async()=>{
      const response = await fetch('http://13.211.139.220/apis/codechef_api/requests/edit_comment.php',{
          method:"PUT",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({id: editInfo.id, comment: text})
      })
      fetchComments()
      document.getElementById(`edit-${editInfo.id}`).style.display="none"
      setEditInfo({
          ...editInfo,
          status:false
      })

  }

  // replying to particular comment with id
  const [replyOn, setReplyOn] = useState(false)
  const [replyText, setReplyText] = useState("")
  const onReplyButtonClickHandler=(id)=>{
    if(rootReplies == 50){
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
  const onReplyHandler=async(post_id, ref_id, replies, root_id, total_replies)=>{
    if(replyText.length == 0) return
    
    const response = await fetch("http://13.211.139.220/apis/codechef_api/requests/add_reply.php",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
          post_id: post_id,
          user_id: localStorage.getItem('token'),
          user_name: localStorage.getItem('username'),
          comment:replyText,
          level:level+1,
          replies:replies,
          ref_id:ref_id,
          root_id: root_id,
          total_replies:total_replies
      })
    })
    const json = await response.json()
    onReplyButtonClickHandler(ref_id, replies)
    
    if(json['status']){
      fetchComments()
      setReplyText("")
    }
    
  }

 // showing replies to a particular comment
  const [showReplyFlag, setShowReplyFlag] = useState(false)
  const showRepliesHandler=(id)=>{ 
    if(showReplyFlag){
      document.getElementById(`reply-close-${id}`).style.display = "none"
      document.getElementById(`reply-open-${id}`).style.display = "block"
      document.getElementById(`reply-${id}`).style.display = "none"
    }else{
      document.getElementById(`reply-open-${id}`).style.display = "none"
      document.getElementById(`reply-close-${id}`).style.display = "block"
      document.getElementById(`reply-${id}`).style.display = "block"
    }
    setShowReplyFlag(prev => !prev)
}
    
  if(levelComments[level] != 0){
    return (
        <ReplyDiv>
           

            <div className='comment-section'>
            {   
                levelComments[level].map((val,indx)=>(    
                    val.ref_id == ref_id && 

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
                            
                            <div className='edit-div' id={`edit-${val.id}`} style={{display:"none"}}>
                                <input type="text" value={text} onChange={ev=>setText(ev.target.value)}/>
                                <button onClick={onEditCLickHandler}>EDIT</button>
                            </div>

                            {
                            localStorage.getItem('token') && val.status == 1 &&

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
                                localStorage.getItem('token') == val.user_id && 
                                <>
                                    <DeleteOutlineIcon onClick={()=>onDeleteClickHandler(val.id)} fontSize='small' className='dlt-btn'/>
                                    <span style={{cursor:"pointer"}} onClick={()=>onEditHandler(val.id, val.comment, val.created_at)}>edit</span>
                                </>
                                }
                                {
                                    level < 4 &&
                                    <button onClick={()=>onReplyButtonClickHandler(val.id, val.replies)}>reply</button>
                                }
                            </div>
                            }
                            <div className='reply-form' id={`form-${val.id}`}>
                                <input 
                                type="text" 
                                placeholder='reply here..'
                                value={replyText}
                                onChange={(ev)=> setReplyText(ev.target.value)}
                                />
                                <button onClick={()=>onReplyHandler(val.post_id, val.id, val.replies, val.root_id, val.total_replies)}>REPLY</button>
                            </div>
                            
                            
                            {
                                val.replies > 0 && 
                                <div className="open-replies" onClick={()=>showRepliesHandler(val.id)}>
                                    <ArrowDropDownIcon fontSize='large'  id={`reply-open-${val.id}`}/> 
                                    <ArrowDropUpIcon fontSize='large' style={{display:"none"}} id={`reply-close-${val.id}`}/>
                                    <span> {val.replies} replies</span>
                                </div>
                            }
                            { 
                                <div id={`reply-${val.id}`} style={{display:"none"}}>
                                    <ShowReplies ref_id = {val.id} level = {level+1} rootReplies={rootReplies}/>
                                </div>
                            }  
                            
                            
                        </div>
                        
                    </div>
                ))
            }
            </div>

          
         </ReplyDiv>
    )
  }

  return (<></>)
  
}

export default ShowReplies