import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import "./style.css";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { baseURL } from "../utils/Link";
import { Button, InputNumber } from "antd";
import { Form, Input, Modal } from "antd";
import { FaRegEdit } from "react-icons/fa";

export function CourseDetail() {
    const { state } = useLocation();
    const [button, setButton] = useState("Information");
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [noti, setNoti] = useState(null);

    const [showNewWeekModal, setShowNewWeekModal] = useState(false);
    const [form] = Form.useForm(); // Sử dụng form instance của Ant Design

    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [editCourseData, setEditCourseData] = useState({});

    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const handleBuy = () => {
        setShowBuyModal(true);
        setNoti(null);
    };
    const handleCloseBuy = () => setShowBuyModal(false);
    const handleCloseEdit = () => setShowEditModal(false);

    const handleEdit = () => {
        setEditCourseData({
            name: course.name,
            description: course.description,
            summary: course.summary,
            price: course.price,
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditCourseData({ ...editCourseData, [e.target.name]: e.target.value });
    };

    const saveEdit = () => {
        setModalLoading(true);
        axios
            .put(`${baseURL}/courses/${course.id}`, editCourseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setCourse(res.data);
                setShowEditModal(false);
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to update the course.");
            })
            .finally(() => {
                setModalLoading(false);
            });
    };

    const buy = () => {
        setModalLoading(true);
        axios
            .post(
                baseURL + "/enrollments",
                {
                    courseId: course.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            .then((res) => {
                setNoti("Successfully enrolled in the course");
            })
            .catch((err) => {
                setNoti("There was an error enrolling, or you're already enrolled");
            })
            .finally(() => {
                setModalLoading(false);
            });
    };

    useEffect(() => {
        setLoading(true);
        axios.get(baseURL + `/courses/${state}`).then((res) => {
            setCourse(res.data);
            setLoading(false);
        });
    }, []);

    const handleNewWeekSubmit = () => {
        form.validateFields() // Validate các trường
            .then((values) => {
                const newWeekData = {
                    ...values,
                    courseId: course?.id || 0,
                };

                axios
                    .post(`${baseURL}/weeks`, newWeekData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((res) => {
                        message.success("New week created successfully!");
                        setCourse((prev) => ({
                            ...prev,
                            weeks: [...prev.weeks, res.data],
                        }));
                        setShowNewWeekModal(false);
                        form.resetFields(); // Reset form sau khi thành công
                    })
                    .catch((err) => {
                        console.error(err);
                        message.error("Failed to create a new week.");
                    });
            })
            .catch((info) => {
                console.error("Validate Failed:", info);
            });
    };

    const toChapterDetail = (chapNumber, chapName, description, lessons, chapterId) => {
        
        navigate(`/chapter/${chapNumber}`, {
            state: { chapNumber, chapName, description, lessons, chapterId },
        });
    };

    if (loading) return <div>Loading...</div>;

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
                <h6>Duration: {course.totalDurationMinutes} minutes</h6>

                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button
                        style={{ backgroundColor: button === "Information" ? "#FF7800" : "#f0f0f0", borderRadius: 20 }}
                        onClick={() => setButton("Information")}
                    >
                        Information
                    </button>
                    <button
                        style={{ backgroundColor: button === "Content" ? "#FF7800" : "#f0f0f0", borderRadius: 20 }}
                        onClick={() => setButton("Content")}
                    >
                        Content
                    </button>
                    <button
                        style={{ backgroundColor: "#198754", color: "white", borderRadius: 20 }}
                        onClick={handleEdit}
                    >
                        Edit Course
                    </button>
                </div>

                {button === "Information" && <p style={{ padding: "12px 0" }}>{course.description}</p>}
                {button === "Content" && (
                    <div>
                        <h2 style={{ fontSize: 18, marginTop: 20 }}>All Chapters</h2>
                        <Button
                            type="primary"
                            onClick={() => setShowNewWeekModal(true)}
                        >
                            New chapter
                        </Button>
                        <Accordion alwaysOpen>
                            {course.weeks.map((week, index) => (
                                <Accordion.Item
                                    eventKey={index}
                                    key={index}
                                >
                                    <Accordion.Header>
                                        Chapter {week.weekNumber} - {week.title}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <FaRegEdit
                                            size={20}
                                            style={{ cursor: "pointer", margin: "12px" }}
                                            onClick={() =>
                                                toChapterDetail(
                                                    week.weekNumber,
                                                    week.title,
                                                    week.description,
                                                    week.learningItems,
                                                    week.id,
                                                )
                                            }
                                        />
                                        <p>{week.description}</p>
                                        <ul>
                                            {week.learningItems.map((item, idx) => (
                                                <li key={idx}>
                                                    <a>{item.title}</a>
                                                    <p>{item.content}</p>
                                                    <p>Duration: {item.durationMinutes} minutes</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                )}
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
                        backgroundColor: "#4C6FFF",
                        padding: 20,
                        color: "white",
                        borderRadius: 10,
                        margin: "10px 0",
                    }}
                    onClick={handleBuy}
                >
                    Buy Now
                </button>
                <h6 style={{ fontWeight: "bold", marginTop: 50 }}>What you will learn: </h6>
                <h6 style={{ color: "gray" }}>{course.summary}</h6>
                <h6 style={{ fontWeight: "bold", marginTop: 50 }}>This course includes: </h6>
                <ul>
                    <li>Video</li>
                    <li>Document</li>
                    <li>{course.numberOfLessons} lessons</li>
                    <li>Estimated {course.estimatedWeeks} weeks</li>
                    <li>Total {course.totalDurationMinutes} minutes</li>
                </ul>
            </div>

            <Modal
                title="Create New Week"
                visible={showNewWeekModal}
                onCancel={() => setShowNewWeekModal(false)}
                onOk={handleNewWeekSubmit}
                okText="Create"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            { required: true, message: "Please enter the title" },
                            { max: 100, message: "Title must be less than 100 characters" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            { required: true, message: "Please enter the description" },
                            { max: 500, message: "Description must be less than 500 characters" },
                        ]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        label="Week Number"
                        name="weekNumber"
                        rules={[
                            { required: true, message: "Please enter the week number" },
                            { type: "number", min: 1, message: "Week number must be greater than 0" },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Buy Modal */}
            <Modal
                show={showBuyModal}
                onHide={handleCloseBuy}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Buy a course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <h4>{course.name}</h4>
                        <p style={{ color: "gray" }}>By {course.teacherName}</p>
                        <p>Price: {course.price}</p>
                        {noti && <p style={{ color: "red" }}>{noti}</p>}
                        {modalLoading && <span>Loading...</span>}
                        <button
                            onClick={buy}
                            style={{ backgroundColor: "#4C6FFF", color: "white", padding: 10, borderRadius: 10 }}
                        >
                            Buy Now?
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Edit Modal */}
            <Modal
                show={showEditModal}
                onHide={handleCloseEdit}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Course</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                name="name"
                                value={editCourseData.name}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                                value={editCourseData.description}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Summary</Form.Label>
                            <Form.Control
                                name="summary"
                                value={editCourseData.summary}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={editCourseData.price}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <button
                            onClick={saveEdit}
                            className="btn btn-success mt-3"
                            disabled={modalLoading}
                        >
                            {modalLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
