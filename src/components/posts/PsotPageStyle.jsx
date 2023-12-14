import styled from "styled-components";

const PostsDiv = styled.div`
    width: 70%;
    margin: auto;
    margin-top: 5%;
    color: white;
    .post{
        border: 1px solid #474747;
        padding: 2%;
        margin-bottom: 5%;
        .head{
            display: flex;
            align-items: center;
            gap: 2%;
            img{ width: 5%;}
        }
        .body{
            margin-top: 2%;
            width: 90%;
            margin-left: 7%;
            img{ 
                width: 100%;
                border-radius:20px;
            }
            .caption{
                margin-top: 2%;
            }
        }
        .footer{
            margin-top: 2%;
            width: 90%;
            margin-left: 7%;

            .icons-tray{
                display: flex;
                gap: 3%;
                .like-icon, .cmt-icon{
                    display: flex;
                    align-items: center;
                    font-size: 120%;
                }
                .like-btn{
                    cursor: pointer;
                    margin-right: 1%;
                    transition: 0.2s;
                }
                .like-btn:hover
                {
                    color: red;
                }
            }
            .caption{
                margin-top: 2%;
                margin-left: .5%;
            }
            .comment{
                width: 100%;
                padding: 1%;
                font-size: 105%;
                margin-top: 2%;
                border: 1px inset #9c9c9c;
            }
        }
    }

`

export default PostsDiv