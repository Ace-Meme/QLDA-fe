import styles from "./style.module.css";
import img from "../../assets/image 2.png";
import { Button, message, Steps, theme } from "antd";
import { useState } from "react";
import UserType from "./components/UserType";
import PersonalInformation from "./components/PersonalInformation";
import ProfileData from "./components/ProfileData";
import Uploads from "./components/Uploads";
const steps = [
    {
        title: "Account Type",
        content: <UserType />,
    },
    {
        title: "Personal Infomation",
        content: <PersonalInformation />,
    },
    {
        title: "Profile Data",
        content: <ProfileData />,
    },
    {
        title: "Uploads",
        content: <Uploads />,
    },
];

function Signup() {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);
    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map((item) => ({ key: item.title, title: item.title }));
    const contentStyle = {
        // lineHeight: "260px",
        textAlign: "center",
        color: token.colorTextTertiary,
        // backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };
    return (
        <div className={styles.container}>
            <div className={styles.body}>
                <h1 className={styles.name}>LEARNING SYSTEM</h1>
                <p className={styles.title}>Create an account</p>
                <p className={styles.description}>
                    Welcome to Learning System! Create an account to access all of our features and content.{" "}
                </p>
                <Steps
                    current={current}
                    items={items}
                    labelPlacement="vertical"
                />
                <div style={contentStyle}>{steps[current].content}</div>
                <div style={{ marginTop: 24 }}>
                    {current < steps.length - 1 && (
                        <Button
                            type="primary"
                            onClick={() => next()}
                        >
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button
                            type="primary"
                            onClick={() => message.success("Processing complete!")}
                        >
                            Done
                        </Button>
                    )}
                    {current > 0 && (
                        <Button
                            style={{ margin: "0 8px" }}
                            onClick={() => prev()}
                        >
                            Previous
                        </Button>
                    )}
                </div>
                <p>
                    Already have an account? <a className={styles.login}>Login here</a>
                </p>
            </div>
            <img
                src={img}
                alt="Background"
                className={styles.background}
            ></img>
        </div>
    );
}

export default Signup;
