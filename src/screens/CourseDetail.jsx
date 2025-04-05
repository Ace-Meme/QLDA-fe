import { useEffect, useState } from "react";
import { getCourse } from "../utils/data";
import { Accordion, Modal } from "react-bootstrap"
import "./style.css"
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { baseURL } from "../utils/Link";

export function CourseDetail() {
    const {state} = useLocation();
    const [button, setButton] = useState('Information');
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    console.log(state);
    useEffect(() => {
        setLoading(true);
        axios.get(baseURL + `/courses/${state}`).then((res) => {
            console.log(res.data);
            setCourse(res.data);
            setLoading(false);
        })
    }, [])
    if(loading){
        return (
            <div>Loading...</div>
        )
    }
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "start",
                backgroundColor: "#FAF1E6",
                padding: 20,
            }}
        >
            <div
                style={{
                    overflow: "auto",
                    width: 800,
                    height: 650,
                    backgroundColor: "white",
                    borderRadius: 10,
                    textAlign: "left",
                    padding: 30,
                }}
            >
                <img
                    src="https://th.bing.com/th/id/OIP.2NiZfQzNy6BKq7hUHycxbAHaE8?rs=1&pid=ImgDetMain"
                    alt={course.name}
                    style={{ width: 700, height: 400, objectFit: "cover", borderRadius: 10 }}
                />
                <h4 style={{ fontWeight: "bold", fontSize: "20px", marginTop: 10 }}>{course.name}</h4>
                <h6>
                    By: <span style={{ fontWeight: "bold" }}>{course.teacherName}</span>
                </h6>
                <h6 style={{ }}>Duration: {course.totalDurationMinutes} minutes</h6>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 20,
                        marginTop: 10,
                        marginBottom: 10,
                    }}
                >
                    <button
                        style={{ backgroundColor: button == "Information" ? "#FF7800" : "#f0f0f0", borderRadius: 20 }}
                        onClick={() => setButton("Information")}
                    >
                        Information
                    </button>
                    <button
                        style={{ backgroundColor: button == "Content" ? "#FF7800" : "#f0f0f0", borderRadius: 20 }}
                        onClick={() => setButton("Content")}
                    >
                        Content
                    </button>
                </div>
                {
                    button === 'Information' &&  (
                        <div>
                            <p>{course.description}</p>
                        </div>
                    )
                }
                {
                    button === 'Content' && (
                        <div>
                            <h2 style={{marginBottom: 10, fontSize: 18, marginTop: 20}}>All Chapters</h2>
                            <Accordion alwaysOpen>
                                {
                                    course.weeks.map((week, index) => {
                                        return (
                                            <Accordion.Item eventKey={index} key={index}>
                                                <Accordion.Header>Week {week.weekNumber} - {week.title}</Accordion.Header>
                                                <Accordion.Body>
                                                    <p>{week.description}</p>
                                                    <ul style={{ listStyleType: "circle", listStylePosition: "inside", padding: 0 }}>
                                                        {
                                                            week.learningItems.map((item, index) => {
                                                                return (
                                                                    <li key={index}>
                                                                        <a>{item.title}</a>
                                                                        <p style={{ marginBottom: 0}}>{item.content}</p>
                                                                        <p>Duration: {item.durationMinutes} minutes</p>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        )
                                    })
                                }
                            </Accordion>
                        </div>
                    )
                }
            </div>
            <div
                style={{
                    width: 300,
                    height: 500,
                    backgroundColor: "white",
                    marginLeft: 20,
                    borderRadius: 10,
                    textAlign: "left",
                    padding: 20,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        textAlign: "center",
                        backgroundColor: "#F8F8FB",
                        padding: 20,
                        border: "1px dashed black",
                        borderRadius: 10,
                    }}
                >
                    Price: {course.price}
                </div>
                <button
                    style={{
                        width: "100%",
                        textAlign: "center",
                        backgroundColor: "#4C6FFF",
                        padding: 20,
                        color: "white",
                        borderRadius: 10,
                        margin: "10px 0px 10px 0px",
                    }}
                    onClick={handleShow}
                >
                    Buy Now
                </button>
                <h6 style={{ fontWeight: "bold", marginTop: 50 }}>What you will learn: </h6>
                <h6 style={{ color: 'gray' }}>{course.summary}</h6>
                <h6 style={{ fontWeight: "bold", marginTop: 50 }}>This course includes: </h6>
                <ul style={{ listStyleType: "circle", listStylePosition: "inside", padding: 0 }}>
                    <li>Video</li>
                    <li>Document</li>
                    <li>{course.numberOfLessons} lessons</li>
                    <li>Estimated {course.estimatedWeeks} weeks</li>
                    <li>Total {course.totalDurationMinutes} minutes</li>
                </ul>
            </div>
            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Buy a course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                        <h4 style={{fontWeight: 'bold', fontSize: 20}}>{course.name}</h4>
                        <p style={{color: 'gray'}}>By {course.teacherName}</p>
                        <p>Price: {course.price}</p>
                        <button style={{backgroundColor: '#4C6FFF', color: 'white', padding: 10, borderRadius: 10, width: '100%'}}>Buy Now?</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
