import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
function Notes() {
    const {subject} = useParams();
    useEffect(()=>{
        axios.get("http://localhost:8080/api/sub-data")
        .then((res)=>{
            console.log(res.data)
        })
    },[])
    return(
        <h2>{subject}</h2>
        
    );
}
export default Notes;