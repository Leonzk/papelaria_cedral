import Image from "next/image";
import styles from "./page.module.css";
import Cabecalho from "./components/cabecalho/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <Cabecalho/>
      <main className={styles.main}>
        
      </main>
      
    </div>
  );
}
