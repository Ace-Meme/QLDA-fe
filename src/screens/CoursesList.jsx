import { getCoursesList } from "../utils/data"
import { HiOutlineSearch } from "react-icons/hi";
import "./style.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../utils/Link";
import { useNavigate } from "react-router";

export function CoursesList(){
    const [courses, setCourses] = useState([]);
    const [keyword, setKeyword] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(baseURL + '/courses').then((res) => {
            setCourses(res.data.content)
        })
    }, [])
    const onSearch = (name) => {
        if(keyword){
            if(name.search(new RegExp(keyword, "i")) != -1) return true;
            else return false;
        }
        else return true;
    }
    const onCourseDetail = (id) => {
        navigate("/coursedetail", {state: id})
    }
    return(
        <div style={{textAlign: 'start', padding: '20px', backgroundColor: '#F5F7F9'}}>
            <p style={{fontWeight: 'bold', color: '#646cff', fontSize: 20, marginBottom: '20px'}}>Courses</p>
            <div style={{display: 'flex', padding: '5px', gap: 10, alignItems: 'center', marginBottom: '10px'}}>
                <input id="search" placeholder="Key word..." style={{width: 200, padding: '10px', borderRadius: 10, backgroundColor: 'white'}} />
                <button style={{color: 'whitesmoke', backgroundColor: 'green'}} onClick={() => setKeyword(document.getElementById("search").value)}>Search</button>
            </div>
            <div style={{display: 'flex', justifyContent: 'start', alignItems: 'start', gap: '30px', height: '80vh', overflow:"scroll", flexWrap: 'wrap'}}>
                {courses.map((course, index) => {
                    if(onSearch(course.name)) return(
                        <div className="card" key={index} style={{padding: '10px', borderRadius: '10px', backgroundColor: 'white'}} onClick={() => onCourseDetail(course.id)}>
                            <img src="https://th.bing.com/th/id/OIP.2NiZfQzNy6BKq7hUHycxbAHaE8?rs=1&pid=ImgDetMain" alt="course" style={{width: '200px', height: '125px', objectFit: 'cover', borderRadius: '10px'}} />
                            <h2 style={{fontWeight: 'bold', marginBottom: '10px', marginTop: '10px'}}>
                                {
                                    course.name.length > 20 ? course.name.substring(0, 20) + '...' : course.name
                                }
                            </h2>
                            <div style={{display: 'flex', justifyContent: 'space-between', gap: '15px'}}>
                                <p style={{color: 'gray'}}>{course.numberOfLessons} Lessons({course.totalDurationMinutes} minutes)</p>
                                <p style={{color: 'orange'}}>{course.price == 0 ? "Free" : course.price}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}