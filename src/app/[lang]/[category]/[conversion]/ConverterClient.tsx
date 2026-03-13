'use client';

import { useState, useCallback, useRef } from 'react';

interface UnitInfo {
    id: string;
    name: string;
    symbol: string;
}

interface ConverterClientProps {
    categoryId: string;
    fromUnitId: string;
    toUnitId: string;
    units: UnitInfo[];
    defaultValue: number;
    defaultResult: number;
    formula: string;
    isTemperature: boolean;
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: any;
}

export default function ConverterClient({
    categoryId,
    fromUnitId,
    toUnitId,
    units,
    defaultValue,
    defaultResult,
    formula,
    isTemperature,
    lang,
    dict,
}: ConverterClientProps) {
    const [value, setValue] = useState(defaultValue.toString());
    const [fromId, setFromId] = useState(fromUnitId);
    const [toId, setToId] = useState(toUnitId);
    const [result, setResult] = useState(defaultResult);
    const [currentFormula, setCurrentFormula] = useState(formula);
    const [copied, setCopied] = useState(false);

    // Debounce timer for URL updates
    const urlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fromUnit = units.find((u) => u.id === fromId)!;
    const toUnit = units.find((u) => u.id === toId)!;

    // Update the browser URL to reflect the current conversion
    const updateUrl = useCallback(
        (val: string, from: string, to: string) => {
            // Clear any pending URL update
            if (urlTimerRef.current) {
                clearTimeout(urlTimerRef.current);
            }

            // Debounce URL updates by 500ms to avoid spamming history
            urlTimerRef.current = setTimeout(() => {
                const numVal = parseFloat(val);
                if (isNaN(numVal) || numVal === 0) return;

                let newSlug: string;
                // Use value-prefixed URL if value != 1, otherwise standard slug
                if (numVal === 1) {
                    newSlug = `${from}-to-${to}`;
                } else {
                    // Use clean number (remove trailing zeros)
                    const cleanVal = parseFloat(numVal.toFixed(10)).toString();
                    newSlug = `${cleanVal}-${from}-to-${to}`;
                }

                const newPath = `/${lang}/${categoryId}/${newSlug}`;

                // Only update if path actually changed
                if (window.location.pathname !== newPath) {
                    window.history.replaceState(
                        { value: val, from, to },
                        '',
                        newPath
                    );
                }
            }, 500);
        },
        [lang, categoryId]
    );

    const doConvert = useCallback(
        async (val: string, from: string, to: string) => {
            const numVal = parseFloat(val);
            if (isNaN(numVal)) {
                setResult(0);
                return;
            }
            try {
                const res = await fetch(
                    `/api/convert?category=${categoryId}&from=${from}&to=${to}&value=${numVal}`
                );
                if (res.ok) {
                    const data = await res.json();
                    setResult(data.result);
                    setCurrentFormula(data.formula);
                }
            } catch {
                // Fallback: API unavailable
            }

            // Update URL to match the current conversion
            updateUrl(val, from, to);
        },
        [categoryId, updateUrl]
    );

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        doConvert(e.target.value, fromId, toId);
    };

    const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFromId(e.target.value);
        doConvert(value, e.target.value, toId);
    };

    const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setToId(e.target.value);
        doConvert(value, fromId, e.target.value);
    };

    const handleSwap = () => {
        const newFrom = toId;
        const newTo = fromId;
        setFromId(newFrom);
        setToId(newTo);
        doConvert(value, newFrom, newTo);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(formatNum(result) + ' ' + (toUnit?.symbol || ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: document.title, url });
        } else {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatNum = (n: number): string => {
        if (Number.isInteger(n)) return n.toString();
        if (Math.abs(n) >= 1) return parseFloat(n.toFixed(6)).toString();
        if (Math.abs(n) >= 0.001) return parseFloat(n.toFixed(8)).toString();
        return n.toExponential(6);
    };

    return (
        <div className="converter-widget">
            <div className="converter-grid">
                {/* From */}
                <div className="converter-field">
                    <label>{dict.converter.value}</label>
                    <input
                        type="number"
                        className="input"
                        value={value}
                        onChange={handleValueChange}
                        placeholder={dict.converter.enterValue}
                        id="converter-value"
                    />
                    <div style={{ marginTop: 'var(--space-sm)' }}>
                        <label>{dict.converter.from}</label>
                        <select className="select" value={fromId} onChange={handleFromChange} id="converter-from">
                            {units.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Swap button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button className="converter-swap-btn" onClick={handleSwap} title={dict.converter.swap} id="converter-swap">
                        ⇄
                    </button>
                </div>

                {/* To */}
                <div className="converter-field">
                    <label>{dict.converter.result}</label>
                    <input
                        type="text"
                        className="input"
                        value={formatNum(result)}
                        readOnly
                        id="converter-result"
                        style={{ fontWeight: 600 }}
                    />
                    <div style={{ marginTop: 'var(--space-sm)' }}>
                        <label>{dict.converter.to}</label>
                        <select className="select" value={toId} onChange={handleToChange} id="converter-to">
                            {units.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Result display */}
            <div className="converter-result">
                <div className="converter-result-value">
                    {value || '0'} {fromUnit?.symbol} = {formatNum(result)} {toUnit?.symbol}
                </div>
                <div className="converter-result-label">
                    {fromUnit?.name} → {toUnit?.name}
                </div>
            </div>

            {/* Actions */}
            <div className="converter-actions">
                <button className="btn btn-secondary" onClick={handleCopy} id="copy-btn">
                    📋 {copied ? dict.converter.copied : dict.converter.copy}
                </button>
                <button className="btn btn-secondary" onClick={handleShare} id="share-btn">
                    🔗 {dict.converter.share}
                </button>
            </div>

            {/* Formula */}
            <div className="converter-formula">
                <h3>{dict.converter.formula}</h3>
                <code>{currentFormula}</code>
            </div>
        </div>
    );
}
