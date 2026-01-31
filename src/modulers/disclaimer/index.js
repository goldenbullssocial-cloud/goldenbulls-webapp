import React from 'react'
import styles from './disclaimer.module.scss';
export default function Disclaimer() {
    return (
        <div className={styles.disclaimerAlignment}>
            <div className='container-md'>
                <h1>
                    Disclaimer
                </h1>
                <p>
                    Golden Bulls International provides market-related news, insights, analysis, and educational content for informational purposes only. All content made available on our website and across our official digital and social media channels is derived
                    from sources believed to be reliable and publicly available.
                </p>
                <p>
                    However, Golden Bulls International does not guarantee the accuracy, adequacy, completeness, reliability, timeliness, or suitability of any information presented. All content is provided on an “as is” basis without any express or implied warranties, including but not limited to warranties of merchantability or fitness for
                    a particular purpose.
                </p>
                <p>
                    The information published on our platform and associated social media channels is not intended to be financial, investment, legal, or professional advice. It may not be appropriate for all individuals or circumstances, and users are advised to exercise their own independent judgment and seek professional
                    guidance where necessary.
                </p>
                <p>
                    By accessing or using any information from Golden Bulls International, you acknowledge and agree that you do so at your own risk. Golden Bulls International shall not be held responsible or liable for any direct, indirect, incidental, consequential, or other losses or damages—including financial loss, emotional distress, or otherwise—arising from the use of, reliance upon, or inability to use
                    the information provided.
                </p>
                <p>
                    This limitation of liability applies regardless of the form of action, whether in contract, negligence, tort, or any other legal theory, and extends to any individual or entity that relies on the content made available through our platform or
                    social networking channels.
                </p>
            </div>
        </div>
    )
}
