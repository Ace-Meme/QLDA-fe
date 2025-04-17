import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { baseURL } from "../utils/Link";
import {
    Button,
    Modal,
    Form,
    Input,
    InputNumber,
    Checkbox,
    message,
} from "antd";
import { HiOutlineSearch } from "react-icons/hi";
import "./style.css";

export function CoursesList() {
    const [courses, setCourses] = useState([]);
    const [keyword, setKeyword] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await axios.get(baseURL + '/courses');
            setCourses(res.data.content);
        } catch (err) {
            console.error(err);
            message.error("Failed to fetch courses.");
        } finally {
            setLoading(false);
        }
    };

    const onSearch = (name) => {
        if (keyword) {
            return name.search(new RegExp(keyword, "i")) !== -1;
        }
        return true;
    };

    const onCourseDetail = (id) => {
        navigate("/coursedetail", { state: id });
    };

    const handleCreateCourse = async (values) => {
        try {
            await axios.post(`${baseURL}/courses`, values);
            message.success("Course created successfully!");
            setIsModalOpen(false);
            form.resetFields();
            fetchCourses();
        } catch (err) {
            console.error(err);
            message.error("Failed to create course.");
        }
    };

    if (loading) return <div>Loading ...</div>;

    return (
        <div style={{ textAlign: 'start', padding: '20px', backgroundColor: '#F5F7F9' }}>
            <p style={{ fontWeight: 'bold', color: '#646cff', fontSize: 20, marginBottom: '20px' }}>
                Discover new courses
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '20px' }}>
                <input
                    id="search"
                    placeholder="Key word..."
                    style={{ width: 200, padding: '10px', borderRadius: 10, backgroundColor: 'white' }}
                />
                <button
                    style={{ color: 'whitesmoke', backgroundColor: 'green', padding: '6px 12px', borderRadius: 5 }}
                    onClick={() => setKeyword(document.getElementById("search").value)}
                >
                    <HiOutlineSearch style={{ marginRight: 5 }} />
                    Search
                </button>

                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    + Add New Course
                </Button>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'start',
                gap: '30px',
                height: '80vh',
                overflowY: "scroll",
                flexWrap: 'wrap'
            }}>
                {courses.map((course, index) => {
                    if (onSearch(course.name)) {
                        return (
                            <div
                                className="card"
                                key={index}
                                style={{ padding: '10px', borderRadius: '10px', backgroundColor: 'white', cursor: 'pointer' }}
                                onClick={() => onCourseDetail(course.id)}
                            >
                                <img
                                    src={course.thumbnailUrl || "https://th.bing.com/th/id/OIP.2NiZfQzNy6BKq7hUHycxbAHaE8?rs=1&pid=ImgDetMain"}
                                    alt="course"
                                    style={{ width: '220px', height: '125px', objectFit: 'cover', borderRadius: '10px' }}
                                />
                                <h6 style={{ fontWeight: 'bold', marginBottom: '10px', marginTop: '10px' }}>
                                    {course.name.length > 25 ? course.name.substring(0, 25) + '...' : course.name}
                                </h6>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                                    <p style={{ color: 'gray' }}>
                                        {course.numberOfLessons} Lessons ({course.totalDurationMinutes} minutes)
                                    </p>
                                    <p style={{ color: 'orange' }}>
                                        {course.price === 0 ? "Free" : `$${course.price}`}
                                    </p>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            <Modal
                title="Add New Course"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Create"
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateCourse}
                    initialValues={{ isFree: false, isDraft: false }}
                >
                    <Form.Item
                        label="Course Name"
                        name="name"
                        rules={[{ required: true, message: "Please enter course name" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: "Please enter category" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[
                            { required: true, message: "Please enter price" },
                            { type: "number", min: 0, message: "Price must be >= 0" },
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="isFree" valuePropName="checked">
                        <Checkbox>Is Free</Checkbox>
                    </Form.Item>

                    <Form.Item name="isDraft" valuePropName="checked">
                        <Checkbox>Is Draft</Checkbox>
                    </Form.Item>

                    <Form.Item
                        label="Estimated Weeks"
                        name="estimatedWeeks"
                        rules={[
                            { required: true, message: "Please enter estimated weeks" },
                            { type: "number", min: 1, message: "Must be at least 1 week" },
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Summary"
                        name="summary"
                        rules={[
                            { required: true, message: "Please enter summary" },
                            { max: 500, message: "Summary must be less than 500 characters" },
                        ]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please enter description" }]}
                    >
                        <Input.TextArea rows={5} />
                    </Form.Item>

                    <Form.Item
                        label="Thumbnail URL"
                        name="thumbnailUrl"
                        rules={[{ required: true, message: "Please enter thumbnail URL" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
