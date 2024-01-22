import React,{useState} from "react";
import{v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate}from 'react-router-dom';

const Home=()=>{
    const navigate=useNavigate();
    const [roomId,setRoomId]=useState('');
    const [username,setUsername]=useState('');
    const createNewRoom=(e)=>{
        e.preventDefault();
        const id=uuidV4();
        setRoomId(id);
        toast.success('new room created');
    };
    const joinRoom=()=>{
        if(!roomId || !username){
            toast.error("room id and usename is required.");
            return;
        }
        navigate(`/editor/${roomId}`,{
            state:{
                username,
            },
        });
    };
    const handleInputEnter=(e)=>{
         if(e.code==='enter'){
            joinRoom();
         }
    };
    return (
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img className="homePageLogo" src=" " />
                <h4 className="nameLabel">paste room Id</h4>
                <div className="inputGroup">
                    <input type="text" className="inputBox" placeholder="roomId" onChange={(e)=>setRoomId(e.target.value)}
                    value ={roomId}
                    onKeyUp={handleInputEnter} />
                    <input type="text" className="inputBox" placeholder="username" onChange={(e)=>setUsername(e.target.value)}
                    value={username}
                    onKeyUp={handleInputEnter} />
                    <button className=" btn joinBtn" onClick={joinRoom}>
                        join
                    </button>
                    <span className="createInfo">
                        you don't have any invite please create one:
                        <a onClick={createNewRoom}
                        href=""
                        className="createNewBtn"
                        >
                            New room
                        </a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>
                    Built with love in delhi.
                    <a href="https://github.com/aman-singh73">Aman singh73</a>
                </h4>
            </footer>
            
        </div>
    );
};
export default Home;