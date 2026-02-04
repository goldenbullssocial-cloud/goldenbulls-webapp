import React from 'react'
import styles from './certificatesList.module.scss';
const DemoImage = '/assets/images/demo.png';
export default function CertificatesList() {
  return (
    <div className={styles.certificatesList}>
      <div className='container-md'>
        <div className={styles.grid}>
          {
            [...Array(10)].map(() => {
              return (
                <div className={styles.items}>
                  <img src={DemoImage} alt='DemoImage' />
                </div>
              )
            })
          }
        </div>
        <div className={styles.buttonDesign}>
          <button>
            <span>See all</span> </button>
        </div>
      </div>
    </div>
  )
}
