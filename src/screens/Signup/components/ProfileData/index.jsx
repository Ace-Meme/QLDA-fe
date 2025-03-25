import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { updatePassword, updateUsername } from "../../../../redux/SignUpSlice";
import styles from "./style.module.css";

function ProfileData() {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const validateUsername = (rule, value) => {
        if (!value || value.length < 8) {
            return Promise.reject("Username must be at least 8 characters long.");
        }
        return Promise.resolve();
    };

    const validatePassword = (rule, value) => {
        if (!value || value.length < 8 || !/\d/.test(value) || !/[!@#$%^&*]/.test(value)) {
            return Promise.reject("Password must be at least 8 characters long and contain at least one number and one special character.");
        }
        return Promise.resolve();
    };

    return (
        <div className={styles.container}>
            <Form
                form={form}
                name="profile_data"
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    rules={[
                        { required: true, message: "Please input your username!" },
                        { validator: validateUsername },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Username"
                        onChange={(e) => dispatch(updateUsername(e.target.value))}
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: "Please input your password!" },
                        { validator: validatePassword },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Password"
                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        onChange={(e) => dispatch(updatePassword(e.target.value))}
                    />
                </Form.Item>
            </Form>
        </div>
    );
}

export default ProfileData;
