"use client";
import React, { useState, useEffect } from "react";
import styles from "./pipValueCalculator.module.scss";
import marketDataService from "@/services/marketpricedata";

const currencyPairs =  [
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
  "NZD/CAD"
];

const accountCurrencies = [
  "USD",
  "EUR",
  "JPY",
  "GBP",
  "CHF",
  "AUD",
  "CAD",
  "NZD"
];

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
  const [errors, setErrors] = useState({
    askPrice: "",
    positionSize: "",
    conversionPrice: "",
    calculation: "",
  });

  // Fetch price when currency pair changes
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setErrors((prev) => ({ ...prev, askPrice: "" }));
        const priceData = await marketDataService.fetchPrice(
          formData.currencyPair
        );
        setFormData((prev) => ({
          ...prev,
          askPrice: priceData.price.toFixed(5),
        }));
      } catch (error) {
        setFormData((prev) => ({ ...prev, askPrice: "" }));
        setErrors((prev) => ({ 
          ...prev, 
          askPrice: "Failed to fetch price. Please enter manually." 
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [formData.currencyPair]);

  // Check if conversion field is needed and fetch conversion price
  useEffect(() => {
    const [baseCurrency, quoteCurrency] = formData.currencyPair.split("/");
    // No conversion needed if account currency matches either base or quote currency
    const needsConversion = 
      quoteCurrency !== formData.accountCurrency && 
      baseCurrency !== formData.accountCurrency;
    
    setShowConversionField(needsConversion);

    if (needsConversion) {
      const conversionPair = `${formData.accountCurrency}/${quoteCurrency}`;
      setConversionPairLabel(`Price for ${conversionPair}`);
      
      // Fetch conversion price
      const fetchConversionPrice = async () => {
        try {
          setErrors((prev) => ({ ...prev, conversionPrice: "" }));
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
            setFormData((prev) => ({ ...prev, conversionPrice: "" }));
            setErrors((prev) => ({ 
              ...prev, 
              conversionPrice: "Failed to fetch conversion price. Please enter manually." 
            }));
          }
        }
      };

      fetchConversionPrice();
    } else {
      setFormData((prev) => ({ ...prev, conversionPrice: "" }));
      setErrors((prev) => ({ ...prev, conversionPrice: "" }));
    }
  }, [formData.currencyPair, formData.accountCurrency]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e) => {
    // Prevent 'e', 'E', '+', '-' from being entered in number inputs
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  };

  const getPipSize = (pair) => {
    // JPY pairs have pip size of 0.01, others 0.0001
    return pair.includes("JPY") ? 0.01 : 0.0001;
  };

  const handleCalculate = async () => {
    const { currencyPair, askPrice, positionSize, accountCurrency, conversionPrice } = formData;

    // Clear previous errors
    setErrors({
      askPrice: "",
      positionSize: "",
      conversionPrice: "",
      calculation: "",
    });

    // Validation
    let hasError = false;
    const newErrors = {};

    if (!askPrice || askPrice === "0" || isNaN(parseFloat(askPrice))) {
      newErrors.askPrice = "Ask price is required";
      hasError = true;
    }

    if (!positionSize || positionSize === "0" || isNaN(parseFloat(positionSize))) {
      newErrors.positionSize = "Position size is required";
      hasError = true;
    }

    const [baseCurrency, quoteCurrency] = currencyPair.split("/");
    const needsConversion = 
      quoteCurrency !== accountCurrency && 
      baseCurrency !== accountCurrency;

    if (needsConversion && (!conversionPrice || conversionPrice === "0" || isNaN(parseFloat(conversionPrice)))) {
      newErrors.conversionPrice = "Conversion price is required";
      hasError = true;
    }

    if (hasError) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    try {
      setLoading(true);
      const pipSize = getPipSize(currencyPair);
      const position = parseFloat(positionSize);
      const price = parseFloat(askPrice);

      // Calculate pip value in quote currency
      // For all pairs: Pip Value = Pip Size × Position Size
      // This gives us the value in the quote currency (second currency in pair)
      let pipValueInQuote = pipSize * position;

      // Convert to account currency if needed
      let pipValueInAccount = pipValueInQuote;

      if (quoteCurrency === accountCurrency) {
        // Account currency matches quote currency - no conversion needed
        pipValueInAccount = pipValueInQuote;
      } else if (baseCurrency === accountCurrency) {
        // Account currency matches base currency
        // Convert using the exchange rate directly
        // For USD/CHF with USD account: CHF value / (USD/CHF rate) = USD value
        pipValueInAccount = pipValueInQuote / price;
      } else {
        // Account currency is different from both base and quote
        const conversion = parseFloat(conversionPrice);

        // If conversion pair is AccountCurrency/QuoteCurrency (e.g., USD/JPY)
        // We multiply: JPY value × (USD/JPY rate) = USD value
        if (conversionPairLabel.includes(`${accountCurrency}/${quoteCurrency}`)) {
          pipValueInAccount = pipValueInQuote * conversion;
        } 
        // If conversion pair is QuoteCurrency/AccountCurrency (e.g., JPY/USD)
        // We divide: JPY value / (JPY/USD rate) = USD value
        else {
          pipValueInAccount = pipValueInQuote / conversion;
        }
      }

      setResult(pipValueInAccount.toFixed(5));
    } catch (error) {
      setErrors((prev) => ({ 
        ...prev, 
        calculation: "Failed to calculate pip value. Please check your inputs." 
      }));
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
            onKeyDown={handleKeyDown}
            placeholder="0.00000"
            className={styles.input}
            readOnly
          />
          {errors.askPrice && (
            <span className={styles.errorMessage}>{errors.askPrice}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Position Size (units)</label>
          <input
            type="number"
            value={formData.positionSize}
            onChange={(e) => handleInputChange("positionSize", e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0"
            className={styles.input}
          />
          {errors.positionSize && (
            <span className={styles.errorMessage}>{errors.positionSize}</span>
          )}
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
              onKeyDown={handleKeyDown}
              placeholder="0.00000"
              className={styles.input}
              readOnly
            />
            {errors.conversionPrice && (
              <span className={styles.errorMessage}>{errors.conversionPrice}</span>
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
