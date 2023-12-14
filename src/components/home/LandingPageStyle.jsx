import styled from "styled-components";

const MainDiv = styled.div`
    
    header{
        padding: .5%;
        display: grid;
        grid-template-columns: 70% 30%;
        img{
            width: 5%;
            margin-left: 2%;
        }
        .btns{
            padding: 0% 2%;
            display: flex;
            flex-direction:row-reverse;
            .login, .signup{
                cursor: pointer;
                color: black;
                height: 70%;
                background-color: white;
                padding: 0% 5%;
                margin-right: 2%;
                border-radius: 5px;
                font-weight: bold;
                border: none;
                transition: 0.3s;
            }
            .login{
                background-color: #f7de52;
            }
            .signup{
                background-color: #d6a80e;
            }

            button:hover{
                font-size: 120%;
            }

        }
    }
`

export default MainDiv