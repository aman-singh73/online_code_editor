import React,{useEffect,useRef} from 'react';
//import Codemirror from 'codemirror';
import {EditorView} from 'codemirror';
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/dracula.css'
// import 'codemirror/mode/javascript/javascript'
// import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/addon/edit/closedtag'
import ACTIONS from '../Actions';
//import { on } from 'codemirror';

const Editor= ({socketRef,roomId,onCodeChange})=>{
    const EditorRef=useRef(null);
    useEffect(()=>{
        async function init(){
            EditorRef.current=EditorView.fromTextArea(
            document.getElementById('realTimeEditor'),
            {
                mode:{name:'javascript',json:true},
                theme:'dracula',
                autoClosedBrackets:true,
                lineNumbers:true,

            }
            );
            EditorRef.current.on('change',(instance,changes)=>{
            const {origin}=changes;
            const code=instance.getValue();       
            onCodeChange(code);
            if(origin!=='setValue'){
                socketRef.current.emit(ACTIONS.CODE_CHANGE,{
                    roomId,
                    code,
                });
            }
             });
        }
        init();
    },[]);
useEffect(()=>{
    if(socketRef.current){
        socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=> {
            if(code!==null  &&  EditorRef.current){//made changes here
                EditorRef.current.setValue(code);
            }
        });
        
    }
    return()=>{
      if(socketRef.current) {//one here
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
},[socketRef.current]);
return <textarea id="realTimeEditor"></textarea>;

};
// useEffect(() => {
//     if (socketRef.current) {
//       socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//         if (code !== null) {
//           EditorRef.current.setValue(code);
//         }
//       });
//     }
  
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off(ACTIONS.CODE_CHANGE);
//       }
//     };
//   }, [socketRef.current]);
  
//   useEffect(() => {
//     return () => {
//       if (EditorRef.current) {
//         EditorRef.current.off('change');
//       }
//     };
//   }, [EditorRef.current]);
//   return <textarea id="realTimeEditor"></textarea>;
// };
export default Editor;





