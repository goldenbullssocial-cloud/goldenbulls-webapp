import React from 'react'
import Link from 'next/link'
import styles from './economicCalendarCard.module.scss';
const LineImage = "/assets/images/line.png";
const Currency = "/assets/icons/Currency.svg";
const Value = "/assets/icons/Value.svg";
const Forex = "/assets/icons/Forex.svg";
const Position = "/assets/icons/Position.svg";

export default function EconomicCalendarCard() {
    return (
        <div className={styles.economicCalendarCardAlignment}>
            <div className='container-md'>
                <div className={styles.grid}>
                    <Link href="/calculators/currency-correlation" className={styles.griditems}>
                        <div className={styles.lineImage}>
                            <img src={LineImage} alt="Line" />
                        </div>
                        <div className={styles.iconCenter}>
                            <img src={Currency} alt='Currency' />
                        </div>
                        <div className={styles.details}>
                            <h3>
                                Currency Correlation Calculator
                            </h3>
                            <p>
                                Analyze how different currency pairs move in relation
                                to each other.
                            </p>
                        </div>
                    </Link>
                    <Link href="/calculators/forex-market-hours" className={styles.griditems}>
                        <div className={styles.lineImage}>
                            <img src={LineImage} alt="Line" />
                        </div>
                        <div className={styles.iconCenter}>
                            <img src={Forex} alt='Forex' />
                        </div>
                        <div className={styles.details}>
                            <h3>
                                Forex Market Hours Converter
                            </h3>
                            <p>
                                Convert global forex market sessions to your local time zone easily.
                            </p>
                        </div>
                    </Link>
                    <Link href="/calculators/risk-meter" className={styles.griditems}>
                        <div className={styles.lineImage}>
                            <img src={LineImage} alt="Line" />
                        </div>
                        <div className={styles.iconCenter}>
                            <img src={Forex} alt='Forex' />
                        </div>
                        <div className={styles.details}>
                            <h3>
                                Risk-on/Risk-off Meter
                            </h3>
                            <p>
                                Gauge overall market sentiment to understand risk appetite across assets.
                            </p>
                        </div>
                    </Link>
                    </div>
                    <div className={styles.twoCol}>
                    <Link href="/calculators/pip-value" className={styles.griditems}>
                        <div className={styles.lineImage}>
                            <img src={LineImage} alt="Line" />
                        </div>
                        <div className={styles.iconCenter}>
                            <img src={Value} alt='Value' />
                        </div>
                        <div className={styles.details}>
                            <h3>
                                Pip Value Calculator
                            </h3>
                            <p>
                                Calculate the monetary value of each pip for any trade setup.
                            </p>
                        </div>
                    </Link>
                    <Link href="/calculators/position-size" className={styles.griditems}>
                        <div className={styles.lineImage}>
                            <img src={LineImage} alt="Line" />
                        </div>
                        <div className={styles.iconCenter}>
                            <img src={Position} alt='Position' />
                        </div>
                        <div className={styles.details}>
                            <h3>
                                Position Size Calculator
                            </h3>
                            <p>
                                Determine the correct trade size based on risk and account balance.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
