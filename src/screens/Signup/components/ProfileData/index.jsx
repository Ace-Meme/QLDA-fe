import styles from "./style.module.css";
import { Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updatePassword, updateUsername } from "../../../../redux/SignUpSlice";
function ProfileData() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    return (
        <div className={styles.container}>
            <Form
                form={form}
                name="personal_information"
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: "Please input your username!" }]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Username"
                        onChange={(e) => dispatch(updateUsername(e.target.value))}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input
                        prefix={<LockOutlined />}
                        placeholder="Password"
                        onChange={(e) => dispatch(updatePassword(e.target.value))}
                    />
                </Form.Item>
                {/* <Form.Item
                    name="confirmPassword"
                    rules={[{ required: true, message: "Please confirm your password!" }]}
                >
                    <Input
                        prefix={<LockOutlined />}
                        placeholder="Confirm password"
                    />
                </Form.Item> */}
            </Form>
        </div>
    );
}

export default ProfileData;
