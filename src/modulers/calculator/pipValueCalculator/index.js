"use client";
import React, { useState, useEffect } from "react";
import styles from "./pipValueCalculator.module.scss";
import marketDataService from "@/services/marketpricedata";

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

export default function PipValueCalculator() {
  const [formData, setFormData] = useState({
    currencyPair: "EUR/USD",
    askPrice: "",
    positionSize: "",
    accountCurrency: "USD",
    conversionPrice: "",
  });

  const [result, setResult] = useState("0.00000");
  const [loading, setLoading] = useState(false);
  const [showConversionField, setShowConversionField] = useState(false);
  const [conversionPairLabel, setConversionPairLabel] = useState("");
  const [conversionType, setConversionType] = useState(null);
  // DIRECT = Quote/Account
  // REVERSE = Account/Quote

  const [errors, setErrors] = useState({
    askPrice: "",
    positionSize: "",
    conversionPrice: "",
    calculation: "",
  });

  // -------------------------
  // Fetch Main Pair Price
  // -------------------------
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const priceData = await marketDataService.fetchPrice(
          formData.currencyPair,
        );

        setFormData((prev) => ({
          ...prev,
          askPrice: priceData.price.toFixed(5),
        }));
      } catch {
        setFormData((prev) => ({ ...prev, askPrice: "" }));
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [formData.currencyPair]);

  // -------------------------
  // Fetch Conversion Price
  // -------------------------
  useEffect(() => {
    const [base, quote] = formData.currencyPair.split("/");

    const needsConversion =
      quote !== formData.accountCurrency && base !== formData.accountCurrency;

    setShowConversionField(needsConversion);

    if (!needsConversion) {
      setFormData((prev) => ({ ...prev, conversionPrice: "" }));
      return;
    }

    const directPair = `${quote}/${formData.accountCurrency}`;
    const reversePair = `${formData.accountCurrency}/${quote}`;

    const fetchConversion = async () => {
      try {
        const data = await marketDataService.fetchPrice(directPair);

        setConversionPairLabel(`Price for ${directPair}`);
        setConversionType("DIRECT");

        setFormData((prev) => ({
          ...prev,
          conversionPrice: data.price.toFixed(5),
        }));
      } catch {
        try {
          const data = await marketDataService.fetchPrice(reversePair);

          setConversionPairLabel(`Price for ${reversePair}`);
          setConversionType("REVERSE");

          setFormData((prev) => ({
            ...prev,
            conversionPrice: data.price.toFixed(5),
          }));
        } catch {
          setFormData((prev) => ({ ...prev, conversionPrice: "" }));
        }
      }
    };

    fetchConversion();
  }, [formData.currencyPair, formData.accountCurrency]);

  // -------------------------
  // Helpers
  // -------------------------
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

  const getPipSize = (pair) => (pair.includes("JPY") ? 0.01 : 0.0001);

  // -------------------------
  // Calculation
  // -------------------------
  const handleCalculate = () => {
    const {
      currencyPair,
      askPrice,
      positionSize,
      accountCurrency,
      conversionPrice,
    } = formData;

    setErrors({
      askPrice: "",
      positionSize: "",
      conversionPrice: "",
      calculation: "",
    });

    if (!askPrice || !positionSize) return;

    try {
      setLoading(true);

      const [base, quote] = currencyPair.split("/");

      const pipSize = getPipSize(currencyPair);
      const position = parseFloat(positionSize);
      const price = parseFloat(askPrice);

      // Step 1: Pip value in QUOTE currency
      let pipValueInQuote = pipSize * position;

      let pipValueInAccount;

      // CASE 1: Account = Quote
      if (accountCurrency === quote) {
        pipValueInAccount = pipValueInQuote;
      }

      // CASE 2: Account = Base
      else if (accountCurrency === base) {
        pipValueInAccount = pipValueInQuote / price;
      }

      // CASE 3: Cross Currency
      else {
        const conversion = parseFloat(conversionPrice);

        if (conversionType === "DIRECT") {
          pipValueInAccount = pipValueInQuote * conversion;
        } else {
          pipValueInAccount = pipValueInQuote / conversion;
        }
      }

      setResult(pipValueInAccount.toFixed(5));
    } catch {
      setErrors((prev) => ({
        ...prev,
        calculation: "Calculation failed.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className={styles.pipValueCalculator}>
      <div className={styles.formSection}>
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
          <label>Ask Price</label>
          <input
            type="number"
            value={formData.askPrice}
            readOnly
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Position Size (units)</label>
          <input
            type="number"
            value={formData.positionSize}
            onChange={(e) => handleInputChange("positionSize", e.target.value)}
            onKeyDown={handleKeyDown}
            onWheel={handleWheel}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Account Currency</label>
          <select
            value={formData.accountCurrency}
            onChange={(e) =>
              handleInputChange("accountCurrency", e.target.value)
            }
            className={styles.select}
          >
            {accountCurrencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        {showConversionField && (
          <div className={styles.formGroup}>
            <label>{conversionPairLabel}</label>
            <input
              type="number"
              value={formData.conversionPrice}
              readOnly
              className={styles.input}
            />
          </div>
        )}

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
            <span>Pip Value</span>
            <strong>
              {formData.accountCurrency} {result}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
