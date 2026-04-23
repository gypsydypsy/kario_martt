import styles from "./debug.module.scss"; 

const Debug = () => {
    return (
        <div className={styles.debug}>
            <p>Appuyez sur "R" pour débugger</p>
        </div>
    )
}

export default Debug