import { useEffect, useState } from "react";
import { getCourse } from "../utils/data";
import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import "./style.css"
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { baseURL } from "../utils/Link";

export function CourseDetail() {
    const {state} = useLocation();
    const [button, setButton] = useState('Information');
    const course = getCourse();
    console.log(state);
    useEffect(() => {
        axios.get(baseURL + `/courses/${state}`).then((res) => {
            console.log(res.data);
        })
    }, [])
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
                    src={"https://th.bing.com/th/id/OIF.4cgH705KVyGTBYgsh5cnVQ?rs=1&pid=ImgDetMain"}
                    alt={course.name}
                    style={{ width: 700, height: 400, objectFit: "cover", borderRadius: 10 }}
                />
                <h4 style={{ fontWeight: "bold", fontSize: "20px", marginTop: 10 }}>{course.name}</h4>
                <p>
                    By: <span style={{ fontWeight: "bold" }}>{course.teacher}</span>
                </p>
                <p>Duration: {course.duration}</p>
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
                            <p>Introduction: {course.introduction}</p>
                        </div>
                    )
                }
                {
                    button === 'Content' && (
                        <div>
                            <h2 style={{marginBottom: 10, fontSize: 18, marginTop: 20}}>All Chapters</h2>
                            {course.chapters.map((chapter, index) => {
                                return (
                                    <Accordion key={index} style={{width: '100%'}}>
                                        <AccordionItem header={
                                            <div style={{fontSize: 16, width: '100%'}}>Chapter {index}: {chapter.name}</div>
                                        } className="item" 
                                        buttonProps={{
                                            className: ({ isEnter }) =>
                                              `itemBtn ${isEnter && "itemBtnExpanded"}`,
                                          }}>
                                        <div style={{display: 'flex', gap: 10, flexDirection: 'column', padding: 20}}>
                                            {chapter.content.map((content, index) => {
                                                return (
                                                    <>
                                                    {content.type === 'video' ? (
                                                        <video width="320" height="240" controls>
                                                            <source src={content.url} type="video/mp4" />
                                                        </video>
                                                    ) : (
                                                        <a href={content.url} style={{textDecoration: 'underline'}}>Document</a>
                                                    )}
                                                    </>
                                                );
                                            })}
                                        </div>
                                        </AccordionItem>
                                    </Accordion>     
                                );
                            })}
                        </div>
                    )
                }
            </div>
            <div
                style={{
                    width: 300,
                    height: 400,
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
                >
                    Buy Now
                </button>
                <h6 style={{ fontWeight: "bold", marginTop: 50 }}>This course includes: </h6>
                <ul style={{ listStyleType: "circle", listStylePosition: "inside", padding: 0 }}>
                    <li>Video</li>
                    <li>Document</li>
                    <li>{course.chapters.length} chapters</li>
                </ul>
            </div>
        </div>
    );
}
