import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { baseURL } from "../../utils/Link";
import { Button, Modal, Form, Input, InputNumber, Checkbox, message, Spin } from "antd";
import { HiOutlineSearch, HiOutlinePlus } from "react-icons/hi";
import { FiClock, FiBook } from "react-icons/fi";
import styles from "./style.module.css";
import { useSelector } from "react-redux";

export function CourseList() {
    const [courses, setCourses] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const { userRole } = useSelector((state) => state.authentication);
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await axios.get(baseURL + "/courses");
            setCourses(res.data.content);
        } catch (err) {
            console.error(err);
            message.error("Failed to fetch courses.");
        } finally {
            setLoading(false);
        }
    };

    const onSearch = (name) => {
        return keyword ? name.toLowerCase().includes(keyword.toLowerCase()) : true;
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

    // const handleDeleteCourse = async (id) => {
    //     Modal.confirm({
    //         title: "Are you sure you want to delete this course?",
    //         okText: "Yes, delete",
    //         okType: "danger",
    //         cancelText: "Cancel",
    //         onOk: async () => {
    //             try {
    //                 await axios.delete(`${baseURL}/courses/${id}`);
    //                 message.success("Course deleted successfully!");
    //                 fetchCourses();
    //             } catch (err) {
    //                 console.error(err);
    //                 message.error("Failed to delete course.");
    //             }
    //         },
    //     });
    // };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Discover New Courses</h1>
                <p className={styles.subtitle}>Expand your knowledge with our curated collection</p>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <HiOutlineSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search courses..."
                        className={styles.searchInput}
                    />
                </div>
                {userRole === "TEACHER" && (
                    <Button
                        type="primary"
                        icon={<HiOutlinePlus />}
                        onClick={() => setIsModalOpen(true)}
                        className={styles.addButton}
                    >
                        New Course
                    </Button>
                )}
            </div>

            {loading ? (
                <div className={styles.loadingContainer}>
                    <Spin size="large" />
                </div>
            ) : (
                <div className={styles.coursesGrid}>
                    {courses
                        .filter((course) => onSearch(course.name))
                        .map((course) => (
                            <div
                                key={course.id}
                                className={styles.courseCard}
                                onClick={() => onCourseDetail(course.id)}
                            >
                                <div className={styles.imageContainer}>
                                    <img
                                        src={
                                            course.thumbnailUrl ||
                                            "https://cdn.tgdd.vn/Files/2021/08/21/1376834/Nhung-cach-giup-ban-hoc-online-hieu-qua-652x367.jpg"
                                        }
                                        alt={course.name}
                                        className={styles.courseImage}
                                    />
                                    {course.isFree && <span className={styles.freeBadge}>FREE</span>}
                                </div>
                                <div className={styles.courseContent}>
                                    <h3 className={styles.courseTitle}>{course.name}</h3>
                                    <p className={styles.courseSummary}>
                                        {course.summary?.substring(0, 80) + (course.summary?.length > 80 ? "..." : "")}
                                    </p>
                                    <div className={styles.meta}>
                                        <span className={styles.metaItem}>
                                            <FiBook className={styles.metaIcon} />
                                            {course.numberOfLessons} Lessons
                                        </span>
                                        <span className={styles.metaItem}>
                                            <FiClock className={styles.metaIcon} />
                                            {course.totalDurationMinutes} mins
                                        </span>
                                    </div>
                                    <div className={styles.footer}>
                                        <span className={styles.category}>{course.category}</span>
                                        {!course.isFree && <span className={styles.price}>${course.price}</span>}
                                    </div>
                                    <div className={styles.actions}>
                                        {/* <Button
                                            size="small"
                                            type="link"
                                            onClick={() => onCourseDetail(course.id)}
                                        >
                                            View
                                        </Button> */}
                                        {/* <Button
                                            size="small"
                                            type="link"
                                            danger
                                            onClick={() => handleDeleteCourse(course.id)}
                                        >
                                            Delete
                                        </Button> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            <Modal
                title="Create New Course"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Create Course"
                cancelText="Cancel"
                width={800}
                destroyOnClose
                className={styles.modal}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateCourse}
                    initialValues={{ isFree: false, isDraft: false }}
                >
                    <div className={styles.formColumns}>
                        <div className={styles.formColumn}>
                            <Form.Item
                                label="Course Name"
                                name="name"
                                rules={[{ required: true, message: "Please enter course name" }]}
                            >
                                <Input placeholder="e.g. Advanced React Patterns" />
                            </Form.Item>

                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: "Please enter category" }]}
                            >
                                <Input placeholder="e.g. Web Development" />
                            </Form.Item>

                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[
                                    { required: true, message: "Please enter price" },
                                    { type: "number", min: 0, message: "Price must be >= 0" },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="0.00"
                                />
                            </Form.Item>

                            <div className={styles.checkboxGroup}>
                                <Form.Item
                                    name="isFree"
                                    valuePropName="checked"
                                >
                                    <Checkbox>Free Course</Checkbox>
                                </Form.Item>
                                <Form.Item
                                    name="isDraft"
                                    valuePropName="checked"
                                >
                                    <Checkbox>Save as Draft</Checkbox>
                                </Form.Item>
                            </div>
                        </div>

                        <div className={styles.formColumn}>
                            <Form.Item
                                label="Estimated Weeks"
                                name="estimatedWeeks"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter estimated weeks",
                                    },
                                    {
                                        type: "number",
                                        min: 1,
                                        message: "Must be at least 1 week",
                                    },
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder="4"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Thumbnail URL"
                                name="thumbnailUrl"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter thumbnail URL",
                                    },
                                ]}
                            >
                                <Input placeholder="https://example.com/image.jpg" />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        label="Summary"
                        name="summary"
                        rules={[
                            { required: true, message: "Please enter summary" },
                            {
                                max: 500,
                                message: "Summary must be less than 500 characters",
                            },
                        ]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Brief description (max 500 characters)"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please enter description" }]}
                    >
                        <Input.TextArea
                            rows={5}
                            placeholder="Detailed course description"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
