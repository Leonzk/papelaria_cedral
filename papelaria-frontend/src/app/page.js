import Image from "next/image";
import styles from "./page.module.css";
import Cabecalho from "./components/cabecalho/page";
import './page.css'
import notcell from './assets/Note_Cell.svg'
import gpbadge from './assets/google-play-badge.svg'
import asbadge from './assets/app_store_badge.svg'

export default function Home() {
  return (
    <div>
      <Cabecalho/>
      <main>
      <div className='backgroundPag1'>
        <div className='containerPag1'>
            <div className='textpag1'>            
                <p className='textwelcome'>PDV</p>
                <p className='textrubbank'>Papelaria<br />Cedral</p>
                <div className='badges'>
              </div>
            </div>
        </div>
      </div>
      </main>
      
    </div>
  );
}
