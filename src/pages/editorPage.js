import React,{useState,useRef,useEffect, useDebugValue} from "react";
import toast from 'react-hot-toast'
import ACTIONS from '../Actions';
import Client from "../components/client";
import Editor from "../components/editor";
import {initSocket} from '../socket'
import {useLocation,useNavigate,Navigate,useParams} from 'react-router-dom'

const EditorPage=()=>{
    const socketRef=useRef(null);
    const codeRef=useRef(null);
    const location=useLocation();
    const {roomId}=useParams();
    const reactNavigator=useNavigate();
    const [clients,setClients]=useState([]);

    useEffect(()=>{
        const init=async()=>{
            socketRef.current=await initSocket();
            socketRef.current.on('connect_error',(err)=>handleErrors(err));
            socketRef.current.on('connect_failed',(err)=>handleErrors(err));

            function handleErrors(e){
                console.log('socket error',e);
                toast.error('socket connection failed,try again later.')
                reactNavigator('/');
            }
            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,
                username:location.state?.username
            });
            socketRef.current.on(ACTIONS.JOINED,
               ({clients,username,socketId})=>{
                if(username!==location.state?.username){
                    toast.success(`${username}joined the room.`);
                    console.log(`${username}joined`);
                }
                 setClients(clients);
                 socketRef.current.emit(ACTIONS.SYNC_CODE,{//one here
                    code:codeRef.current,
                    socketId,
            
                 });
               });
               socketRef.current.on(ACTIONS.DISCONNECTED,
                ({socketId,username})=>{
                    toast.success(`${username}left the room.`);
                    setClients((prev)=>{
                       return prev.filter(
                        (client)=>client.socketId!==socketId
                       );
                    });
                }
               );
        };
        init();
        return ()=>{
            const cleanup=()=>{//one here
                if(socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
                }
            };
            cleanup();
        };
        
    },[]);
    async function copyRoomId() {
     try{
        await navigator.clipboard.writeText(roomId);
         toast.success('room Id has been copies to your clipboard.');

     } catch (err){
       toast.error('room id not copied ');
       console.log(err);
     }
    }
    function leaveRoom() {
        reactNavigator('/');
    }
    if(!location.state) {
        return <Navigate to="/" />;
    }
    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImg" src=" "/>
                    </div>
                    <h3>connected</h3>
                    <div className="clientsList">
                        {clients.map((client)=>(
                            <Client key={client.socketId} username={client.username}
                            />
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn" onClick={copyRoomId}>
                    copy room id
                </button>
                <button className="btn leaveBUtton" onClick={leaveRoom}>
                    leave room
                </button>
            </div>
            <div className="editorWrap">
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{
                    codeRef.current=code;
                }}
            />
            </div>
        </div>
    );
};
export default EditorPage;