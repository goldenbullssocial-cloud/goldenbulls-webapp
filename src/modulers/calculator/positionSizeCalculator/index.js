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
    // Prevent 'e', 'E', '+', '-' from being entered in number inputs
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  };

  // Check if ask price is needed
  const isAskPriceNeeded = () => {
    const [baseCurrency, quoteCurrency] = formData.currencyPair.split("/");
    // Ask price is NOT needed when account currency matches the quote currency
    return formData.accountCurrency !== quoteCurrency;
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

    // Clear previous errors
    setErrors({
      accountBalance: "",
      riskPercentage: "",
      stopLoss: "",
      askPrice: "",
      calculation: "",
    });

    // Validation
    let hasError = false;
    const newErrors = {};

    if (
      !accountBalance ||
      accountBalance === "0" ||
      isNaN(parseFloat(accountBalance))
    ) {
      newErrors.accountBalance = "Account balance is required";
      hasError = true;
    }

    if (
      !riskPercentage ||
      riskPercentage === "0" ||
      isNaN(parseFloat(riskPercentage))
    ) {
      newErrors.riskPercentage = "Risk percentage is required";
      hasError = true;
    }

    if (!stopLoss || stopLoss === "0" || isNaN(parseFloat(stopLoss))) {
      newErrors.stopLoss = "Stop loss is required";
      hasError = true;
    }

    // Check if ask price is required
    const [baseCurrency, quoteCurrency] = currencyPair.split("/");
    const needsAskPrice = accountCurrency !== quoteCurrency;

    if (
      needsAskPrice &&
      (!askPrice || askPrice === "0" || isNaN(parseFloat(askPrice)))
    ) {
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
      const price = parseFloat(askPrice) || 0;

      // Calculate amount at risk
      const amountAtRisk = balance * (risk / 100);

      // Get base and quote currency
      const [baseCurrency, quoteCurrency] = currencyPair.split("/");

      // Calculate pip value per unit in quote currency
      const pipSize = currencyPair.includes("JPY") ? 0.01 : 0.0001;

      // Pip value per unit is simply the pip size
      // For EUR/USD: 1 unit = 0.0001 USD per pip
      // For USD/JPY: 1 unit = 0.01 JPY per pip
      let pipValuePerUnit = pipSize;

      // Convert pip value to account currency if needed
      let pipValueInAccount = pipValuePerUnit;

      if (quoteCurrency !== accountCurrency) {
        // If quote currency doesn't match account currency, we need conversion
        if (!price || isNaN(price)) {
          setErrors((prev) => ({
            ...prev,
            askPrice: "Ask price is required for currency conversion",
          }));
          setLoading(false);
          return;
        }

        // Convert using the exchange rate
        // This is a simplified conversion - in production you'd need proper conversion rates
        pipValueInAccount = pipValuePerUnit / price;
      }

      // Calculate position size in units
      // Position Size = Amount at Risk / (Stop Loss in Pips × Pip Value per Unit)
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
      setErrors((prev) => ({
        ...prev,
        calculation:
          "Failed to calculate position size. Please check your inputs.",
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
            <label>Current {formData.currencyPair} Ask Price</label>
            <input
              type="number"
              step="0.00001"
              value={formData.askPrice}
              onChange={(e) => handleInputChange("askPrice", e.target.value)}
              onKeyDown={handleKeyDown}
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
