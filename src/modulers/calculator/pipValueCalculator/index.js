"use client";
import React, { useState, useEffect } from "react";
import styles from "./pipValueCalculator.module.scss";
import marketDataService from "@/services/marketpricedata";

const currencyPairs = [
  "EUR/USD",
  "GBP/USD",
  "USD/JPY",
  "USD/CHF",
  "AUD/USD",
  "USD/CAD",
  "NZD/USD",
];

const accountCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"];

export default function PipValueCalculator() {
  const [formData, setFormData] = useState({
    currencyPair: "EUR/USD",
    askPrice: "",
    positionSize: "",
    accountCurrency: "USD",
    conversionPrice: "",
  });
  const [result, setResult] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [showConversionField, setShowConversionField] = useState(false);
  const [conversionPairLabel, setConversionPairLabel] = useState("");

  // Fetch price when currency pair changes
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const priceData = await marketDataService.fetchPrice(
          formData.currencyPair
        );
        setFormData((prev) => ({
          ...prev,
          askPrice: priceData.price.toFixed(5),
        }));
      } catch (error) {
        console.error("Failed to fetch price:", error);
        setFormData((prev) => ({ ...prev, askPrice: "" }));
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [formData.currencyPair]);

  // Check if conversion field is needed and fetch conversion price
  useEffect(() => {
    const quoteCurrency = formData.currencyPair.split("/")[1];
    const needsConversion = quoteCurrency !== formData.accountCurrency;
    
    setShowConversionField(needsConversion);

    if (needsConversion) {
      const conversionPair = `${formData.accountCurrency}/${quoteCurrency}`;
      setConversionPairLabel(`Price for ${conversionPair}`);
      
      // Fetch conversion price
      const fetchConversionPrice = async () => {
        try {
          const priceData = await marketDataService.fetchPrice(conversionPair);
          setFormData((prev) => ({
            ...prev,
            conversionPrice: priceData.price.toFixed(5),
          }));
        } catch (error) {
          // Try reverse pair
          const reversePair = `${quoteCurrency}/${formData.accountCurrency}`;
          try {
            const priceData = await marketDataService.fetchPrice(reversePair);
            setConversionPairLabel(`Price for ${reversePair}`);
            setFormData((prev) => ({
              ...prev,
              conversionPrice: priceData.price.toFixed(5),
            }));
          } catch (err) {
            console.error("Failed to fetch conversion price:", err);
            setFormData((prev) => ({ ...prev, conversionPrice: "" }));
          }
        }
      };

      fetchConversionPrice();
    } else {
      setFormData((prev) => ({ ...prev, conversionPrice: "" }));
    }
  }, [formData.currencyPair, formData.accountCurrency]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getPipSize = (pair) => {
    // JPY pairs have pip size of 0.01, others 0.0001
    return pair.includes("JPY") ? 0.01 : 0.0001;
  };

  const handleCalculate = async () => {
    const { currencyPair, askPrice, positionSize, accountCurrency, conversionPrice } = formData;

    if (!askPrice || !positionSize) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const pipSize = getPipSize(currencyPair);
      const position = parseFloat(positionSize);
      const price = parseFloat(askPrice);

      // Get base and quote currency
      const [baseCurrency, quoteCurrency] = currencyPair.split("/");

      // Calculate pip value in quote currency
      // Standard formula: Pip Value = (Pip Size / Exchange Rate) × Position Size
      let pipValueInQuote;
      
      if (quoteCurrency === "JPY") {
        // For JPY pairs: Pip Value = Pip Size × Position Size
        pipValueInQuote = pipSize * position;
      } else {
        // For non-JPY pairs: Pip Value = (Pip Size / Exchange Rate) × Position Size
        pipValueInQuote = (pipSize / price) * position;
      }

      console.log("Pip value in quote currency:", pipValueInQuote, quoteCurrency);

      // Convert to account currency if needed
      let pipValueInAccount = pipValueInQuote;

      if (quoteCurrency !== accountCurrency) {
        if (!conversionPrice) {
          alert("Conversion price not available");
          setLoading(false);
          return;
        }

        const conversion = parseFloat(conversionPrice);
        
        // If conversion pair is AccountCurrency/QuoteCurrency (e.g., NZD/JPY)
        // We multiply: JPY value × (NZD/JPY rate) = NZD value
        if (conversionPairLabel.includes(`${accountCurrency}/${quoteCurrency}`)) {
          pipValueInAccount = pipValueInQuote * conversion;
        } 
        // If conversion pair is QuoteCurrency/AccountCurrency (e.g., JPY/NZD)
        // We divide: JPY value / (JPY/NZD rate) = NZD value
        else {
          pipValueInAccount = pipValueInQuote / conversion;
        }
      }

      //console.log("Pip value in account currency:", pipValueInAccount, accountCurrency);
      setResult(pipValueInAccount.toFixed(2));
    } catch (error) {
      console.error("Calculation error:", error);
      alert("Failed to calculate pip value");
    } finally {
      setLoading(false);
    }
  };

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
            step="0.00001"
            value={formData.askPrice}
            onChange={(e) => handleInputChange("askPrice", e.target.value)}
            placeholder="0.00000"
            className={styles.input}
            readOnly
          />
        </div>

        <div className={styles.formGroup}>
          <label>Position Size (units)</label>
          <input
            type="number"
            value={formData.positionSize}
            onChange={(e) => handleInputChange("positionSize", e.target.value)}
            placeholder="0"
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
            {accountCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {showConversionField && (
          <div className={styles.formGroup}>
            <label>{conversionPairLabel}</label>
            <input
              type="number"
              step="0.00001"
              value={formData.conversionPrice}
              onChange={(e) => handleInputChange("conversionPrice", e.target.value)}
              placeholder="0.00000"
              className={styles.input}
              readOnly
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
          <p className={styles.helpText}>
            Planning your next trade? Don't forget to calculate your optimal{" "}
            <span className={styles.highlight}>position size</span> to manage risk effectively.
          </p>
        </div>
      </div>
    </div>
  );
}
