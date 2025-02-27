import React from "react";
import styles from "./style.module.css";
import TypeCard from "../TypeCard";
import student from "../../../../assets/student.svg";
import teacher from "../../../../assets/teacher.svg";
function UserType() {
    return (
        <div className={styles.container}>
            <p>Choose your account type</p>
            <div className={styles.cards}>
                <TypeCard
                    img={student}
                    title="Student Account"
                    description="Tài khoản dành cho học sinh đã tham gia hệ thống."
                />
                <TypeCard
                    img={teacher}
                    title="Teacher Account"
                    description="Tài khoản dành cho giáo viên."
                />
            </div>
        </div>
    );
}

export default UserType;
