import styles from "./styles/DefeatedPawns.module.css";
export const DefeatedPawns = () => {
	return (
		<div className="flex flex-col space-between items-center w-1/12 mr-2">
			<div className="h-1/2 w-8 flex flex-col justify-evenly pb-4">
				<div className={`${styles.defeated} ${styles.sil} aspect-square`}></div>
				<div className={`${styles.defeated} ${styles.sil} aspect-square`}></div>
				<div className={`${styles.defeated} ${styles.sil} aspect-square`}></div>
				<div className={`${styles.defeated} ${styles.sil} aspect-square`}></div>
			</div>
			<div className="h-1/2 w-8 flex flex-col justify-evenly pt-4">
				<div className={`${styles.defeated} ${styles.sil} aspect-square`}></div>
				<div className={`${styles.defeated} ${styles.sil} aspect-square`}></div>
				<div className={`${styles.defeated} ${styles.sil} aspect-square`}></div>
				<div className={`${styles.defeated} ${styles.sil} aspect-square`}></div>
			</div>
		</div>
	);
}