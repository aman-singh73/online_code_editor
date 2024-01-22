import {io} from 'socket.io-client';
export const initSocket=async()=>{
    const options={
        'force new connection':true,
        reconnectionAttempt:Infinity,
         setTimeout:10000,
         transports:['webSocket'],

    };
    return io(process.env.REACT_APP_BACKEND_URL,options);
};