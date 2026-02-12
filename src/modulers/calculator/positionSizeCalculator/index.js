"use client";
import React, { useState } from "react";
import styles from "./positionSizeCalculator.module.scss";

const currencyPairs = [
  "EUR/USD",
  "GBP/USD",
  "USD/CHF",
  "USD/CAD",
  "USD/JPY",
  "NZD/USD",
  "AUD/USD",
  "EUR/AUD",
  "EUR/GBP",
  "EUR/JPY",
  "EUR/CAD",
  "EUR/CHF",
  "EUR/NZD",
  "GBP/CAD",
  "GBP/CHF",
  "GBP/JPY",
  "GBP/AUD",
  "GBP/NZD",
  "AUD/CAD",
  "AUD/JPY",
  "AUD/CHF",
  "AUD/NZD",
  "CHF/JPY",
  "CAD/CHF",
  "CAD/JPY",
  "NZD/CHF",
  "NZD/JPY",
  "NZD/CAD",
];

const accountCurrencies = [
  "USD",
  "EUR",
  "JPY",
  "GBP",
  "CHF",
  "AUD",
  "CAD",
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
  const [errors, setErrors] = useState({
    accountBalance: "",
    riskPercentage: "",
    stopLoss: "",
    askPrice: "",
    calculation: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

  const handleWheel = (e) => {
    e.target.blur();
    e.preventDefault();
  };

  // ✅ FIXED LOGIC
  const isAskPriceNeeded = () => {
    const [base, quote] = formData.currencyPair.split("/");
    const acc = formData.accountCurrency;

    // Need price when:
    // 1. Account = Base
    // 2. Account ≠ Base AND ≠ Quote (cross currency)
    return acc === base || (acc !== base && acc !== quote);
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

    setErrors({
      accountBalance: "",
      riskPercentage: "",
      stopLoss: "",
      askPrice: "",
      calculation: "",
    });

    let hasError = false;
    const newErrors = {};

    if (!accountBalance || isNaN(parseFloat(accountBalance))) {
      newErrors.accountBalance = "Account balance is required";
      hasError = true;
    }

    if (!riskPercentage || isNaN(parseFloat(riskPercentage))) {
      newErrors.riskPercentage = "Risk percentage is required";
      hasError = true;
    }

    if (!stopLoss || isNaN(parseFloat(stopLoss))) {
      newErrors.stopLoss = "Stop loss is required";
      hasError = true;
    }

    const [baseCurrency, quoteCurrency] = currencyPair.split("/");
    const needsAskPrice = isAskPriceNeeded();

    if (needsAskPrice && (!askPrice || isNaN(parseFloat(askPrice)))) {
      newErrors.askPrice = "Ask price is required";
      hasError = true;
    }

    if (hasError) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    try {
      setLoading(true);

      const balance = parseFloat(accountBalance);
      const risk = parseFloat(riskPercentage);
      const stopLossPips = parseFloat(stopLoss);
      const price = parseFloat(askPrice);

      const amountAtRisk = balance * (risk / 100);

      const pipSize = currencyPair.includes("JPY") ? 0.01 : 0.0001;
      let pipValuePerUnit = pipSize;

      let pipValueInAccount;

      // ✅ CASE 1: Account = Quote
      if (accountCurrency === quoteCurrency) {
        pipValueInAccount = pipValuePerUnit;
      }

      // ✅ CASE 2: Account = Base
      else if (accountCurrency === baseCurrency) {
        pipValueInAccount = pipValuePerUnit / price;
      }

      // ✅ CASE 3: Cross Currency
      else {
        // askPrice should be Quote → Account conversion rate
        pipValueInAccount = pipValuePerUnit * price;
      }

      const positionSizeUnits =
        amountAtRisk / (stopLossPips * pipValueInAccount);

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
      setErrors((prev) => ({
        ...prev,
        calculation: "Failed to calculate position size.",
      }));
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
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
            placeholder="0"
            className={styles.input}
          />
          {errors.accountBalance && (
            <span className={styles.errorMessage}>{errors.accountBalance}</span>
          )}
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
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
            placeholder="0"
            className={styles.input}
          />
          {errors.riskPercentage && (
            <span className={styles.errorMessage}>{errors.riskPercentage}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Stop Loss (pips)</label>
          <input
            type="number"
            value={formData.stopLoss}
            onChange={(e) => handleInputChange("stopLoss", e.target.value)}
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
            placeholder="0"
            className={styles.input}
          />
          {errors.stopLoss && (
            <span className={styles.errorMessage}>{errors.stopLoss}</span>
          )}
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

        {isAskPriceNeeded() && (
          <div className={styles.formGroup}>
            <label>
              Conversion / Pair Price{" "}
              <span className={styles.pairName}>({formData.currencyPair})</span>
            </label>
            <input
              type="number"
              step="0.00001"
              value={formData.askPrice}
              onChange={(e) => handleInputChange("askPrice", e.target.value)}
              onKeyDown={handleKeyDown}
              onWheel={handleWheel}
              placeholder="0.00000"
              className={styles.input}
            />
            {errors.askPrice && (
              <span className={styles.errorMessage}>{errors.askPrice}</span>
            )}
          </div>
        )}

        <button
          onClick={handleCalculate}
          className={styles.calculateBtn}
          disabled={loading}
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>

        {errors.calculation && (
          <div className={styles.calculationError}>{errors.calculation}</div>
        )}
      </div>

      {/* ✅ RESULT CARD NOT TOUCHED */}
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
            Remember to always manage your risk properly.
          </p>
        </div>
      </div>
    </div>
  );
}
