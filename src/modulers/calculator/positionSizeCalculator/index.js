"use client";
import React, { useState } from "react";
import styles from "./positionSizeCalculator.module.scss";

const currencyPairs = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "USD/CHF",
  "AUD/USD",
  "USD/CAD",
  "NZD/USD",
];

const accountCurrencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "NZD",
];

export default function PositionSizeCalculator() {
  const [formData, setFormData] = useState({
    accountCurrency: "USD",
    accountBalance: "",
    riskPercentage: "",
    stopLoss: "",
    currencyPair: "EUR/USD",
    askPrice: "",
  });
  const [results, setResults] = useState({
    amountAtRisk: "0",
    positionSizeUnits: "0",
    standardLots: "0",
    miniLots: "0",
    microLots: "0",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPipValue = (pair, askPrice) => {
    // Determine pip size based on pair
    const pipSize = pair.includes("JPY") ? 0.01 : 0.0001;

    // For most pairs: pip value = pip size
    // For JPY pairs: pip value = pip size
    return pipSize;
  };

  const handleCalculate = () => {
    const {
      accountBalance,
      riskPercentage,
      stopLoss,
      currencyPair,
      accountCurrency,
      askPrice,
    } = formData;

    if (!accountBalance || !riskPercentage || !stopLoss || !askPrice) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const balance = parseFloat(accountBalance);
      const risk = parseFloat(riskPercentage);
      const stopLossPips = parseFloat(stopLoss);
      const price = parseFloat(askPrice);

      // Calculate amount at risk
      const amountAtRisk = balance * (risk / 100);

      // Get base and quote currency
      const [baseCurrency, quoteCurrency] = currencyPair.split("/");

      // Calculate pip value in quote currency
      const pipSize = currencyPair.includes("JPY") ? 0.01 : 0.0001;

      let pipValueInQuote;
      if (quoteCurrency === "JPY") {
        // For JPY pairs: pip value = pip size
        pipValueInQuote = pipSize;
      } else {
        // For non-JPY pairs: pip value = (pip size / exchange rate)
        pipValueInQuote = pipSize / price;
      }

      // Convert pip value to account currency if needed
      let pipValueInAccount = pipValueInQuote;

      if (quoteCurrency !== accountCurrency) {
        // Simplified: assume 1:1 conversion for now
        // In real scenario, you'd need conversion rates
        pipValueInAccount = pipValueInQuote;
      }

      // Calculate position size in units
      // Position Size = Amount at Risk / (Stop Loss in Pips × Pip Value)
      const positionSizeUnits =
        amountAtRisk / (stopLossPips * pipValueInAccount);

      // Convert to lot sizes
      const standardLots = positionSizeUnits / 100000;
      const miniLots = positionSizeUnits / 10000;
      const microLots = positionSizeUnits / 1000;

      setResults({
        amountAtRisk: amountAtRisk.toFixed(2),
        positionSizeUnits: positionSizeUnits.toFixed(0),
        standardLots: standardLots.toFixed(2),
        miniLots: miniLots.toFixed(2),
        microLots: microLots.toFixed(2),
      });
    } catch (error) {
      console.error("Calculation error:", error);
      alert("Failed to calculate position size");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.positionSizeCalculator}>
      <div className={styles.formSection}>
        <div className={styles.formGroup}>
          <label>Account Currency</label>
          <select
            value={formData.accountCurrency}
            onChange={(e) =>
              handleInputChange("accountCurrency", e.target.value)
            }
            className={styles.select}
          >
            {accountCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Account Balance</label>
          <input
            type="number"
            value={formData.accountBalance}
            onChange={(e) =>
              handleInputChange("accountBalance", e.target.value)
            }
            placeholder="0"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Risk Percentage</label>
          <input
            type="number"
            step="0.1"
            value={formData.riskPercentage}
            onChange={(e) =>
              handleInputChange("riskPercentage", e.target.value)
            }
            placeholder="0"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Stop Loss (pips)</label>
          <input
            type="number"
            value={formData.stopLoss}
            onChange={(e) => handleInputChange("stopLoss", e.target.value)}
            placeholder="0"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Currency Pair</label>
          <select
            value={formData.currencyPair}
            onChange={(e) => handleInputChange("currencyPair", e.target.value)}
            className={styles.select}
          >
            {currencyPairs.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Current {formData.currencyPair} Ask Price</label>
          <input
            type="number"
            step="0.00001"
            value={formData.askPrice}
            onChange={(e) => handleInputChange("askPrice", e.target.value)}
            placeholder="0.00000"
            className={styles.input}
          />
        </div>

        <button
          onClick={handleCalculate}
          className={styles.calculateBtn}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </div>

      <div className={styles.resultsSection}>
        <div className={styles.results}>
          <h3>Results</h3>

          <div className={styles.resultItem}>
            <span>Amount at Risk</span>
            <strong>
              {formData.accountCurrency} {results.amountAtRisk}
            </strong>
          </div>

          <div className={styles.resultItem}>
            <span>Position Size (units)</span>
            <strong>{results.positionSizeUnits}</strong>
          </div>

          <div className={styles.resultItem}>
            <span>Standard Lots</span>
            <strong>{results.standardLots}</strong>
          </div>

          <div className={styles.resultItem}>
            <span>Mini Lots</span>
            <strong>{results.miniLots}</strong>
          </div>

          <div className={styles.resultItem}>
            <span>Micro Lots</span>
            <strong>{results.microLots}</strong>
          </div>

          <p className={styles.helpText}>
            Remember to always manage your risk properly. Never risk more than
            you can afford to lose.
          </p>
        </div>
      </div>
    </div>
  );
}
