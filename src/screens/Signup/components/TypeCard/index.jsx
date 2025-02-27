import React from "react";
import styles from "./style.module.css";

function TypeCard({ img, title, description }) {
    return (
        <div className={styles.container}>
            <img
                className={styles.avt}
                src={img}
                alt="Avatar"
            ></img>
            <div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
        </div>
    );
}

export default TypeCard;
