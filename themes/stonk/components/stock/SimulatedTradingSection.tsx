"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Activity, Zap, Lock, Globe, TrendingUp, TrendingDown, Terminal, Layers, Eye, EyeOff, BarChart3, RefreshCw, CloudRain, Sun, Wind } from "lucide-react";
import { useSite } from "@/lib/site";

// --- 翻譯字典 (完整校對版) ---
// {SYM} is replaced at runtime with the ticker derived from profile.name.
const TRANSLATIONS = {
    en: {
        title: "QUANT X PRO",
        equity: "ASSETS",
        pnl: "UNREALIZED PNL",
        ma: "MA LINES",
        fib: "FIB LEVELS",
        pair: "{SYM} (7777)",
        terminalTitle: "AI STRATEGY LOG",
        processing: "CALCULATING",
        price: "Price",
        size: "Vol",
        leverage: "MARGIN",
        scanIdle: "RUN AI SCAN",
        scanRunning: "SCANNING...",
        buy: "BUY / LONG",
        sell: "SELL / SHORT",
        close: "TAKE PROFIT",
        entry: "AVG COST",
        recommended: "AI SIGNAL",
        marketVitals: "MARKET VITALS",
        sentiment: "SENTIMENT",
        h24: "24h High",
        l24: "24h Low",
        reset: "RESET SYSTEM",

        // Logs
        logReady: "Market Data Stream Connected.",
        logInit: "Analyzing {SYM}(7777) Ticker...",
        logMap: "Checking Institutional Order Flow...",
        logCalc: "Calculating RSI Divergence...",
        logSignal: "SIGNAL DETECTED",
        logFilled: "ORDER EXECUTED",
        logClosed: "POSITION CLOSED",
        logReset: "SYSTEM REBOOTED.",
        logWarn: "SYSTEM WARNING: ANOMALY DETECTED",

        // Regimes
        regimeBull: "REGIME: BULL MARKET",
        regimeBear: "REGIME: BEAR MARKET",
        regimeChop: "REGIME: CHOPPY / RANGE",

        // Scenarios & Tags (Keys must match scenario definitions)
        tagBreakout: "BREAKOUT", descBreakout: "VOLATILITY BREAKOUT", explBreakout: "Price breaking resistance.",
        tagDoubleBottom: "W-BOTTOM", descDoubleBottom: "DOUBLE BOTTOM", explDoubleBottom: "Bullish reversal confirmed.",
        tagCupHandle: "CUP & HANDLE", descCupHandle: "CUP & HANDLE", explCupHandle: "Continuation pattern detected.",
        tagPump: "PUMP", descPump: "MOMENTUM SPIKE", explPump: "Aggressive buying detected.",

        tagDoubleTop: "M-TOP", descDoubleTop: "DOUBLE TOP", explDoubleTop: "Bearish reversal confirmed.",
        tagHeadShoulders: "H&S TOP", descHeadShoulders: "HEAD & SHOULDERS", explHeadShoulders: "Trend reversal imminent.",
        tagBleed: "BLEED", descBleed: "SLOW BLEED", explBleed: "Support failing slowly.",

        tagBart: "BART", descBart: "LIQUIDITY TRAP", explBart: "High volatility manipulation.",
        tagSavior: "OVERSOLD", descSavior: "OVERSOLD BOUNCE", explSavior: "Technical rebound expected.",

        // Events
        tagCrash: "CRASH", evtCrash: "FLASH CRASH", explCrash: "Liquidity crisis detected.",
        tagNews: "NEWS", evtNews: "NEWS SPIKE", explNews: "Positive news catalyst.",
        tagWhale: "CHOP", evtWhale: "WHALE ACTIVITY", explWhale: "High volatility range.",

        // New Events
        tagGod: "GOD CANDLE", descGod: "INSTITUTIONAL BUYING", explGod: "Massive volume injection.",
        tagSqueeze: "SQUEEZE", descSqueeze: "SHORT SQUEEZE", explSqueeze: "Shorts forced to cover.",
        tagDeadCat: "DEAD CAT", descDeadCat: "DEAD CAT BOUNCE", explDeadCat: "Temporary recovery before fall.",
        tagStairsUp: "UPTREND", descStairsUp: "STAIRCASE UP", explStairsUp: "Steady algorithmic buying.",
        tagStairsDown: "DOWNTREND", descStairsDown: "STAIRCASE DOWN", explStairsDown: "Steady algorithmic selling.",

        // AI Scan Messages
        aiPattern: "PATTERN",
        aiHighVol: "HIGH VOLATILITY",
        aiUncertain: "UNCERTAIN",
        aiStrongMom: "STRONG MOMENTUM",
        aiTrendFollow: "TREND FOLLOWING",
        aiBearStruct: "BEARISH STRUCTURE",
        aiWeakness: "WEAKNESS DETECTED",
        aiScalp: "SCALPING OPPORTUNITY",
        aiQuickScalp: "QUICK SCALP",
        aiOversold: "OVERSOLD ZONE",
        aiPumpExhaust: "PUMP EXHAUSTION",
        aiMarketUnclear: "MARKET UNCLEAR, HOLD.",
        aiSignal: "AI SIGNAL",
    },
    zh: {
        title: "QUANT X 量化交易",
        equity: "總資產 (Assets)",
        pnl: "未實現損益 (PnL)",
        ma: "均線 (MA)",
        fib: "黃金分割 (Fib)",
        pair: "{SYM} (7777)",
        terminalTitle: "AI 策略日誌",
        processing: "運算中",
        price: "股價",
        size: "量",
        leverage: "融資槓桿",
        scanIdle: "啟動 AI 診斷",
        scanRunning: "全盤掃描中...",
        buy: "買進 (做多)",
        sell: "賣出 (放空)",
        close: "獲利了結",
        entry: "持有成本",
        recommended: "AI 強力建議",
        marketVitals: "市場即時概況",
        sentiment: "多空情緒",
        h24: "24h 最高",
        l24: "24h 最低",
        reset: "系統重置",

        logReady: "行情數據串流已連線...",
        logInit: "正在分析 {SYM}(7777) 盤勢...",
        logMap: "檢測主力籌碼流向...",
        logCalc: "計算 RSI 背離訊號...",
        logSignal: "AI 捕捉訊號",
        logFilled: "委託已成交",
        logClosed: "已平倉出場",
        logReset: "系統已重置，清除所有緩存。",
        logWarn: "系統警示：監測到異常數據波動...",

        regimeBull: "當前週期：牛市 (Bull)",
        regimeBear: "當前週期：熊市 (Bear)",
        regimeChop: "當前週期：震盪 (Choppy)",

        // Scenarios
        tagBreakout: "黃金交叉", descBreakout: "多頭突破確認", explBreakout: "【教學】均線向上發散，動能轉強。",
        tagDoubleBottom: "W 底成型", descDoubleBottom: "W 底確認", explDoubleBottom: "【教學】兩次探底不破，頸線突破。",
        tagCupHandle: "杯柄型態", descCupHandle: "杯柄型突破", explCupHandle: "【教學】洗盤結束，主力鎖碼。",
        tagPump: "主力吃貨", descPump: "巨鯨大單敲進", explPump: "【教學】底部爆量，主力吸籌。",

        tagDoubleTop: "M 頭成型", descDoubleTop: "M 頭反轉", explDoubleTop: "【教學】高檔壓力沉重，買盤力竭。",
        tagHeadShoulders: "頭肩頂", descHeadShoulders: "頭肩頂型態", explHeadShoulders: "【教學】右肩反彈無力，空方確立。",
        tagBleed: "陰跌不止", descBleed: "空方抵抗", explBleed: "【教學】多頭棄守，支撐位失效。",

        tagBart: "巴特圖", descBart: "巴特型態 (誘多)", explBart: "【警示】急漲後橫盤，提防崩跌。",
        tagSavior: "超跌反彈", descSavior: "乖離率過大", explSavior: "【AI護盤】嚴重超跌，搶反彈。",

        // Events
        tagCrash: "閃崩警報", evtCrash: "CRITICAL：市場閃崩", explCrash: "【系統】流動性枯竭，請注意風險。",
        tagNews: "突發利多", evtNews: "快訊：重磅消息", explNews: "【系統】利多政策發布，程式單追價。",
        tagWhale: "多空激戰", evtWhale: "巨鯨對決", explWhale: "【系統】關鍵價位多空互掛大單。",

        tagGod: "神之燭", descGod: "機構進場", explGod: "【訊號】爆量長紅，主力不計價買進。",
        tagSqueeze: "軋空秀", descSqueeze: "強勢軋空", explSqueeze: "【訊號】空頭停損踩踏，價格噴出。",
        tagDeadCat: "死貓跳", descDeadCat: "死貓反彈", explDeadCat: "【警示】弱勢反彈，逃命波。",
        tagStairsUp: "階梯上漲", descStairsUp: "階梯式多頭", explStairsUp: "【趨勢】量化程式單穩定推升。",
        tagStairsDown: "階梯下跌", descStairsDown: "階梯式空頭", explStairsDown: "【趨勢】量化程式單穩定出貨。",

        // AI Scan Messages
        aiPattern: "型態識別",
        aiHighVol: "高波動警示",
        aiUncertain: "方向不明",
        aiStrongMom: "動能強勁",
        aiTrendFollow: "順勢交易",
        aiBearStruct: "空頭結構",
        aiWeakness: "走勢疲弱",
        aiScalp: "短線頭皮單",
        aiQuickScalp: "極短線操作",
        aiOversold: "超賣區博反彈",
        aiPumpExhaust: "多頭力竭",
        aiMarketUnclear: "市場不明，建議觀望",
        aiSignal: "AI 訊號",
    }
};

// --- 類型定義 ---
interface CandleData {
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    timestamp: number;
}

interface SignalMarker {
    candleIndex: number;
    price: number;
    type: "LONG" | "SHORT" | "ALERT";
    label: string;
}

interface LogEntry {
    text: string;
    type: "info" | "success" | "warning" | "alert" | "subtle";
    time: string;
}

type MarketRegime = "BULL" | "BEAR" | "CHOP";

// 確保這裡的類型與 TRANSLATIONS 的 Key 對應
type ScenarioType =
    | "breakout" | "double_bottom" | "cup_handle" | "savior_bounce"
    | "double_top" | "head_shoulders" | "slow_bleed"
    | "bart_simpson" | "pump_dump"
    | "chop" | "flash_crash" | "news_spike"
    | "god_candle" | "short_squeeze" | "dead_cat" | "staircase_up" | "staircase_down";

interface Position {
    type: "long" | "short";
    entryPrice: number;
    leverage: number;
    size: number;
}

// --- 輔助函數 ---
const calculateSMA = (data: CandleData[], period: number, index: number) => {
    if (index < period - 1) return null;
    let sum = 0;
    for (let i = 0; i < period; i++) sum += data[index - i].close;
    return sum / period;
};

const generateOrderBook = (currentPrice: number, volatility: number) => {
    const spreadPercent = 0.002;
    const asks = Array.from({ length: 7 }).map((_, i) => ({
        price: (currentPrice * (1 + spreadPercent + i * 0.001 + Math.random() * 0.001)).toFixed(2),
        size: (Math.random() * (volatility > 5 ? 50 : 10) + 1).toFixed(0),
        bg: `rgba(244, 63, 94, ${0.15 + Math.random() * 0.15})`
    })).reverse();

    const bids = Array.from({ length: 7 }).map((_, i) => ({
        price: (currentPrice * (1 - spreadPercent - i * 0.001 - Math.random() * 0.001)).toFixed(2),
        size: (Math.random() * (volatility > 5 ? 50 : 10) + 1).toFixed(0),
        bg: `rgba(16, 185, 129, ${0.15 + Math.random() * 0.15})`
    }));
    return { asks, bids };
};

export function SimulatedTradingSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const historyRef = useRef<CandleData[]>([]);
    const currentCandleRef = useRef<CandleData | null>(null);
    const candleProgressRef = useRef<number>(0);
    const MAX_PROGRESS = 240;
    const animationRef = useRef<number>(0);
    const basePriceRef = useRef<number>(777.00);
    const scenarioRef = useRef<{ type: ScenarioType, remaining: number, totalDuration: number } | null>(null);
    const signalMarkersRef = useRef<SignalMarker[]>([]);

    // 宏觀參數
    const marketRegimeRef = useRef<MarketRegime>("CHOP");
    const regimeTimerRef = useRef<number>(0);
    const organicTrendRef = useRef<number>(0);

    const lastOrderBookUpdateRef = useRef<number>(0);
    const lastPriceUpdateRef = useRef<number>(0);
    const nextRandomEventTimeRef = useRef<number>(Date.now() + 8000);

    // UI State
    const [lang, setLang] = useState<"en" | "zh">("zh");
    const { personal } = useSite();
    const t = {
        ...TRANSLATIONS[lang],
        pair: TRANSLATIONS[lang].pair.replace("{SYM}", personal.ticker),
        logInit: TRANSLATIONS[lang].logInit.replace("{SYM}", personal.ticker),
    };

    const [displayPrice, setDisplayPrice] = useState<string>("777.00");
    const [balance, setBalance] = useState<number>(100000);
    const [leverage, setLeverage] = useState<number>(2);
    const [position, setPosition] = useState<Position | null>(null);
    const [pnl, setPnl] = useState<number>(0);

    const [showMA, setShowMA] = useState(true);
    const [showFib, setShowFib] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const [aiState, setAiState] = useState<"idle" | "scanning" | "analyzed">("idle");
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [aiRecommendation, setAiRecommendation] = useState<"LONG" | "SHORT" | null>(null);
    const [orderBook, setOrderBook] = useState<{ asks: any[], bids: any[] }>({ asks: [], bids: [] });
    const [marketStats, setMarketStats] = useState({ high: 785.50, low: 768.20, vol: "125,400", sentiment: 50, regime: "CHOP" });
    const [candleDisplay, setCandleDisplay] = useState<{ o: string, h: string, l: string, c: string, v: string } | null>(null);

    const addLog = (text: string, type: LogEntry['type'] = "info") => {
        const time = new Date().toLocaleTimeString().split(' ')[0];
        setLogs(prev => [{ text, type, time }, ...prev].slice(0, 8));
    };

    useEffect(() => {
        setLogs([{ text: t.logReady, type: "info", time: new Date().toLocaleTimeString() }]);
    }, [lang]);

    // Mobile detection for responsive chart
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleReset = () => {
        historyRef.current = [];
        currentCandleRef.current = null;
        signalMarkersRef.current = [];
        scenarioRef.current = null;
        basePriceRef.current = 777.00;
        organicTrendRef.current = 0;
        marketRegimeRef.current = "CHOP";

        setBalance(100000);
        setPosition(null);
        setPnl(0);
        setAiState("idle");
        setAiRecommendation(null);
        setLogs([{ text: t.logReset, type: "warning", time: new Date().toLocaleTimeString() }]);
        setMarketStats({ high: 777.00, low: 777.00, vol: "0", sentiment: 50, regime: "CHOP" });
    };

    // --- 核心：價格引擎 v6.2 (Balanced Gravity) ---
    const updatePriceLogic = () => {
        if (!currentCandleRef.current) {
            const lastClose = historyRef.current.length > 0 ? historyRef.current[historyRef.current.length - 1].close : basePriceRef.current;
            currentCandleRef.current = { open: lastClose, close: lastClose, high: lastClose, low: lastClose, volume: 0, timestamp: Date.now() };
            candleProgressRef.current = 0;
        }

        const liveCandle = currentCandleRef.current!;
        const currentPrice = liveCandle.close;
        const now = Date.now();

        // 1. 市場週期 (Regime)
        if (regimeTimerRef.current <= 0) {
            regimeTimerRef.current = 3000 + Math.random() * 3000;
            const rand = Math.random();
            let newRegime: MarketRegime = "CHOP";
            if (currentPrice > 2000) newRegime = rand > 0.6 ? "BEAR" : "CHOP";
            else if (currentPrice < 300) newRegime = rand > 0.6 ? "BULL" : "CHOP";
            else newRegime = rand > 0.6 ? "BULL" : (rand > 0.3 ? "BEAR" : "CHOP");
            marketRegimeRef.current = newRegime;
        }
        regimeTimerRef.current--;

        // 2. 隨機突發事件 (背景自動觸發：高頻率)
        if (!scenarioRef.current && now > nextRandomEventTimeRef.current) {
            nextRandomEventTimeRef.current = now + 2000 + Math.random() * 5000; // 2-7秒檢查一次
            const regime = marketRegimeRef.current;
            const currentPrice = currentCandleRef.current ? currentCandleRef.current.close : basePriceRef.current;

            // 大幅提高事件觸發機率 (75% 機率觸發)
            if (Math.random() > 0.25) {
                // 定義所有可能的劇本 (新增更多劇本)
                const bullishScens: { type: ScenarioType, descKey: string, tagKey: string, explKey: string }[] = [
                    { type: "breakout", descKey: "descBreakout", tagKey: "tagBreakout", explKey: "explBreakout" },
                    { type: "double_bottom", descKey: "descDoubleBottom", tagKey: "tagDoubleBottom", explKey: "explDoubleBottom" },
                    { type: "cup_handle", descKey: "descCupHandle", tagKey: "tagCupHandle", explKey: "explCupHandle" },
                    { type: "news_spike", descKey: "evtNews", tagKey: "tagNews", explKey: "explNews" },
                    { type: "god_candle", descKey: "descGod", tagKey: "tagGod", explKey: "explGod" },
                    { type: "short_squeeze", descKey: "descSqueeze", tagKey: "tagSqueeze", explKey: "explSqueeze" },
                    { type: "staircase_up", descKey: "descStairsUp", tagKey: "tagStairsUp", explKey: "explStairsUp" }
                ];
                const bearishScens: { type: ScenarioType, descKey: string, tagKey: string, explKey: string }[] = [
                    { type: "double_top", descKey: "descDoubleTop", tagKey: "tagDoubleTop", explKey: "explDoubleTop" },
                    { type: "head_shoulders", descKey: "descHeadShoulders", tagKey: "tagHeadShoulders", explKey: "explHeadShoulders" },
                    { type: "slow_bleed", descKey: "descBleed", tagKey: "tagBleed", explKey: "explBleed" },
                    { type: "flash_crash", descKey: "evtCrash", tagKey: "tagCrash", explKey: "explCrash" },
                    { type: "dead_cat", descKey: "descDeadCat", tagKey: "tagDeadCat", explKey: "explDeadCat" },
                    { type: "staircase_down", descKey: "descStairsDown", tagKey: "tagStairsDown", explKey: "explStairsDown" }
                ];
                const trapScens: { type: ScenarioType, descKey: string, tagKey: string, explKey: string }[] = [
                    { type: "pump_dump", descKey: "descPump", tagKey: "tagPump", explKey: "explPump" },
                    { type: "bart_simpson", descKey: "descBart", tagKey: "tagBart", explKey: "explBart" },
                    { type: "chop", descKey: "evtWhale", tagKey: "tagWhale", explKey: "explWhale" }
                ];

                let possible: typeof bullishScens = [];
                // 根據趨勢權重調整
                if (regime === "BULL") possible = [...bullishScens, ...bullishScens, ...trapScens, ...bullishScens];
                else if (regime === "BEAR") possible = [...bearishScens, ...bearishScens, ...trapScens, ...bearishScens];
                else possible = [...bullishScens, ...bearishScens, ...trapScens, ...trapScens];

                // 過濾掉不合理的劇本
                if (currentPrice < 100) possible = possible.filter(s => !["flash_crash", "staircase_down", "slow_bleed"].includes(s.type));

                const result = possible[Math.floor(Math.random() * possible.length)];

                // 設定劇本長度
                let duration = 500;
                if (["bart_simpson", "head_shoulders", "cup_handle", "staircase_up", "staircase_down"].includes(result.type)) duration = 800;
                if (result.type === "god_candle") duration = 150; // 短時間爆發

                scenarioRef.current = { type: result.type, remaining: duration, totalDuration: duration };

                // 只有部分大事件發 Log，可以稍微多一點
                const isMajor = ["flash_crash", "news_spike", "pump_dump", "breakout", "god_candle", "short_squeeze"].includes(result.type);

                if (isMajor || Math.random() > 0.6) {
                    const tagLabel = t[result.tagKey as keyof typeof t] || result.tagKey;
                    const logMsg = t[result.descKey as keyof typeof t] || result.descKey;
                    const logExpl = t[result.explKey as keyof typeof t] || result.explKey;
                    const logType = (result.type === "flash_crash" || result.type === "bart_simpson") ? "alert" : "warning";

                    // 延遲顯示，讓圖先走一點
                    setTimeout(() => {
                        addLog(`>> ${logMsg}`, logType);
                        // 50% 機率解釋
                        if (Math.random() > 0.5) setTimeout(() => addLog(logExpl, "subtle"), 400);
                        signalMarkersRef.current.push({ candleIndex: historyRef.current.length, price: liveCandle.close, type: "ALERT", label: tagLabel });
                    }, 1500);
                }
            }
        }

        // 3. 價格計算
        let biasPercent = 0;
        let volatilityPercent = 0.0015; // 基礎波動率再降低

        if (scenarioRef.current) {
            if (scenarioRef.current.remaining > 0) {
                const { type, remaining, totalDuration } = scenarioRef.current;
                scenarioRef.current.remaining--;

                // End scenario if finished
                if (scenarioRef.current.remaining <= 0) {
                    scenarioRef.current = null;
                }

                const progress = remaining / totalDuration;
                const isDoubtPhase = progress > 0.75;

                // 劇本慣性延續
                if (remaining === 1) {
                    if (["breakout", "pump_dump", "news_spike", "double_bottom", "cup_handle", "god_candle", "staircase_up"].includes(type)) organicTrendRef.current = 0.4;
                    else if (["flash_crash", "slow_bleed", "double_top", "head_shoulders", "dead_cat", "staircase_down"].includes(type)) organicTrendRef.current = -0.4;
                }

                // 劇本物理學
                switch (type) {
                    case "breakout": case "double_bottom": case "cup_handle": case "savior_bounce":
                        if (isDoubtPhase) { biasPercent = -0.00005; volatilityPercent = 0.001; }
                        else if (progress > 0.4) { biasPercent = 0.0006; volatilityPercent = 0.0025; }
                        else { biasPercent = 0.0001; }
                        break;
                    case "double_top": case "head_shoulders": case "slow_bleed":
                        if (isDoubtPhase) { biasPercent = 0.00005; volatilityPercent = 0.001; }
                        else { biasPercent = -0.0006; volatilityPercent = 0.0025; }
                        break;
                    case "pump_dump": case "bart_simpson":
                        if (progress > 0.6) { biasPercent = 0.0012; } // Pump
                        else if (progress > 0.4) { biasPercent = 0; } // Top
                        else { biasPercent = -0.0015; } // Dump
                        break;
                    case "flash_crash": biasPercent = -0.002; volatilityPercent = 0.006; break;
                    case "news_spike": biasPercent = 0.0015; volatilityPercent = 0.005; break;
                    case "chop": biasPercent = (Math.random() - 0.5) * 0.0005; volatilityPercent = 0.002; break;

                    // --- New Scenarios ---
                    case "god_candle": // 暴力拉升
                        biasPercent = 0.003; volatilityPercent = 0.002;
                        break;
                    case "short_squeeze": // 先緩跌後急拉
                        if (progress > 0.3) { biasPercent = 0.002; volatilityPercent = 0.004; }
                        else { biasPercent = -0.0005; }
                        break;
                    case "dead_cat": // 先小反彈後跌
                        if (progress > 0.6) { biasPercent = 0.0005; }
                        else { biasPercent = -0.001; }
                        break;
                    case "staircase_up": // 階梯式上漲 (走一步退半步)
                        if (remaining % 60 < 30) biasPercent = 0.0008;
                        else biasPercent = -0.0001;
                        break;
                    case "staircase_down": // 階梯式下跌
                        if (remaining % 60 < 30) biasPercent = -0.0008;
                        else biasPercent = 0.0001;
                        break;
                }
            } else {
                scenarioRef.current = null;
            }
        }

        if (!scenarioRef.current) {
            // ... (organic drift code in next block)
            // --- 有機漂移 (修正版：更溫和的地心引力) ---
            let regimeBias = 0;
            if (marketRegimeRef.current === "BULL") regimeBias = 0.00005;
            else if (marketRegimeRef.current === "BEAR") regimeBias = -0.00005;

            // Gravity
            let gravity = 0;
            if (currentPrice > 1500) {
                const gravityStrength = marketRegimeRef.current === "BULL" ? 0.000005 : 0.000015;
                gravity = -gravityStrength * (currentPrice / 1500);
            }
            if (currentPrice < 100) gravity = 0.0002 * (100 / currentPrice);

            // Trend Update
            organicTrendRef.current *= 0.98; // 增加阻尼
            organicTrendRef.current += (Math.random() - 0.5) * 0.02 + (regimeBias * 1.5) + (gravity * 3);

            // Clamp
            if (organicTrendRef.current > 1.5) organicTrendRef.current = 1.5;
            if (organicTrendRef.current < -1.5) organicTrendRef.current = -1.5;

            biasPercent = organicTrendRef.current * 0.00015;
            volatilityPercent = 0.0008 + Math.abs(organicTrendRef.current) * 0.0005;
        }

        const jitter = (Math.random() - 0.5) * volatilityPercent;
        const percentChange = biasPercent + jitter;

        let newClose = liveCandle.close * (1 + percentChange);
        if (newClose < 0.01) newClose = 0.01;

        liveCandle.close = newClose;
        liveCandle.high = Math.max(liveCandle.high, liveCandle.close);
        liveCandle.low = Math.min(liveCandle.low, liveCandle.close);

        // Volume correlates with volatility + random bursts (Order Book Matching Simulation)
        let baseVol = Math.abs(percentChange * 10000) * 50;
        if (baseVol < 5) baseVol = 5; // Minimum churn
        if (Math.random() > 0.85) baseVol *= 3; // Occasional large block trades

        let tickVol = baseVol + Math.random() * 20;
        liveCandle.volume += tickVol;

        candleProgressRef.current += 1;

        // ... (K線完成邏輯保持不變)
        if (candleProgressRef.current >= MAX_PROGRESS) {
            historyRef.current.push({ ...liveCandle });
            currentCandleRef.current = null;
            if (historyRef.current.length > 100) {
                historyRef.current.shift();
                signalMarkersRef.current = signalMarkersRef.current
                    .map(marker => ({ ...marker, candleIndex: marker.candleIndex - 1 }))
                    .filter(marker => marker.candleIndex >= 0);
            }
        }

        // 計算情緒
        let sentimentBase = 50;
        if (marketRegimeRef.current === "BULL") sentimentBase = 65;
        if (marketRegimeRef.current === "BEAR") sentimentBase = 35;
        const shortTermTrend = percentChange * 2000;
        const newSentiment = Math.min(100, Math.max(0, sentimentBase + shortTermTrend * 20 + (Math.random() - 0.5) * 2));

        return { price: liveCandle.close, sentiment: newSentiment, regime: marketRegimeRef.current };
    };

    // --- AI 掃描 (主動分析) ---
    const startScanning = () => {
        if (aiState === "scanning" || position) return;
        setAiState("scanning");
        setAiRecommendation(null);

        // 動畫 Log
        addLog(t.logInit, "info");
        if (!showFib) setTimeout(() => setShowFib(true), 1500);
        setTimeout(() => addLog(t.logMap, "info"), 800);
        setTimeout(() => addLog(t.logCalc, "info"), 1600);

        setTimeout(() => {
            const currentPrice = currentCandleRef.current?.close || basePriceRef.current;
            const trend = organicTrendRef.current;
            const scenario = scenarioRef.current;
            const regime = marketRegimeRef.current;

            let recType: "LONG" | "SHORT" | null = null;
            let logMsg = "";
            let confidenceVal = 60 + Math.random() * 30;

            // 1. 強制給出意見 (Aggressive Mode)

            if (scenario) {
                const sType = scenario.type;

                // Helper to get translation key
                const getDescKey = (t: ScenarioType) => {
                    const map: Record<string, string> = {
                        breakout: "descBreakout", double_bottom: "descDoubleBottom", cup_handle: "descCupHandle",
                        savior_bounce: "descSavior", news_spike: "evtNews", god_candle: "descGod",
                        staircase_up: "descStairsUp", short_squeeze: "descSqueeze",
                        double_top: "descDoubleTop", head_shoulders: "descHeadShoulders", slow_bleed: "descBleed",
                        flash_crash: "evtCrash", dead_cat: "descDeadCat", staircase_down: "descStairsDown",
                        pump_dump: "descPump", bart_simpson: "descBart", chop: "evtWhale"
                    };
                    return map[t] || t.toUpperCase();
                };

                // 劇本分析
                if (["breakout", "double_bottom", "cup_handle", "savior_bounce", "news_spike", "god_candle", "staircase_up", "short_squeeze"].includes(sType)) {
                    const key = getDescKey(sType);
                    const patternName = t[key as keyof typeof t] || sType.toUpperCase();
                    recType = "LONG"; logMsg = `${t.aiPattern}: ${patternName}`;
                } else if (["double_top", "head_shoulders", "slow_bleed", "flash_crash", "dead_cat", "staircase_down"].includes(sType)) {
                    const key = getDescKey(sType);
                    const patternName = t[key as keyof typeof t] || sType.toUpperCase();
                    recType = "SHORT"; logMsg = `${t.aiPattern}: ${patternName}`;
                } else if (sType === "pump_dump") {
                    recType = scenario.remaining > scenario.totalDuration * 0.5 ? "LONG" : "SHORT";
                    logMsg = t.aiHighVol; // Use translation
                } else {
                    recType = null; logMsg = t.aiUncertain; // Use translation
                }
                if (recType) confidenceVal += 15;
            } else {
                // 2. 有機趨勢分析 (門檻調低)
                // 只要不是完全 0，就給方向
                if (trend > 0.1 || regime === "BULL") {
                    recType = "LONG";
                    logMsg = trend > 0.5 ? t.aiStrongMom : t.aiTrendFollow; // Use translation
                } else if (trend < -0.1 || regime === "BEAR") {
                    recType = "SHORT";
                    logMsg = trend < -0.5 ? t.aiBearStruct : t.aiWeakness; // Use translation
                } else {
                    // 真的完全不確定時，隨機挑一個短線方向 (Scalping)
                    if (Math.random() > 0.5) { recType = "LONG"; logMsg = t.aiScalp; confidenceVal = 55; }
                    else { recType = "SHORT"; logMsg = t.aiQuickScalp; confidenceVal = 55; }
                }

                // 觸底反彈偵測
                if (currentPrice < 300) { recType = "LONG"; logMsg = t.aiOversold; confidenceVal = 95; }
            }

            setAiState("analyzed");
            setAiRecommendation(recType);

            const confidence = Math.min(100, confidenceVal).toFixed(1);
            if (recType) {
                addLog(`>> ${t.logSignal}: ${logMsg} (${confidence}% CONF)`, "success");
                signalMarkersRef.current.push({
                    candleIndex: historyRef.current.length,
                    price: currentPrice,
                    type: recType,
                    label: "AI SIGNAL"
                });
            } else {
                addLog(`>> MARKET UNCLEAR, HOLD.`, "warning");
            }

        }, 2200); // 稍微縮短等待時間
    };



    const executeTrade = (type: "long" | "short") => {
        const price = currentCandleRef.current ? currentCandleRef.current.close : basePriceRef.current;
        setPosition({ type, entryPrice: price, leverage, size: 50000 });
        const dirText = type === "long" ? (lang === 'en' ? "LONG" : "買進") : (lang === 'en' ? "SHORT" : "賣出");
        addLog(`${t.logFilled}: ${dirText} @ ${price.toFixed(2)}`, "success");
    };

    const closePosition = () => {
        if (!position) return;
        setBalance(b => b + pnl);
        addLog(`${t.logClosed}. PNL: ${pnl.toFixed(2)}`, pnl >= 0 ? "success" : "alert");
        setPosition(null);
        setPnl(0);
        setAiState("idle");
        setAiRecommendation(null);
    };

    // --- 繪圖 (Standard) ---
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; ctx.scale(dpr, dpr);
        }
        const width = rect.width; const height = rect.height;

        // Responsive parameters
        const paddingRight = isMobile ? 45 : 65;
        const viewCount = isMobile ? 30 : 60;
        const gridLineCount = isMobile ? 4 : 6;
        const fontSize = isMobile ? 9 : 10;
        const markerHeight = isMobile ? 14 : 18;

        const chartWidth = width - paddingRight;

        ctx.fillStyle = "#09090b"; ctx.fillRect(0, 0, width, height);

        const { price: currentPrice, sentiment } = updatePriceLogic();

        const allCandles = [...historyRef.current];
        if (currentCandleRef.current) allCandles.push(currentCandleRef.current);
        if (allCandles.length === 0) return;

        const startIndex = Math.max(0, allCandles.length - viewCount);
        const visibleCandles = allCandles.slice(startIndex);

        const prices = visibleCandles.flatMap(c => [c.high, c.low]);
        if (position) prices.push(position.entryPrice);
        let minPrice = Math.min(...prices); let maxPrice = Math.max(...prices);
        const padding = (maxPrice - minPrice) * 0.25; minPrice -= padding; maxPrice += padding;
        const priceRange = maxPrice - minPrice || 1;

        const chartHeight = height - 40;

        const candleWidth = (chartWidth / viewCount) * 0.6;
        const candleSpacing = chartWidth / viewCount;
        const getX = (i: number) => i * candleSpacing + (candleSpacing / 2);
        const getY = (p: number) => chartHeight - ((p - minPrice) / priceRange) * chartHeight + 20;

        // Grid lines - responsive count
        ctx.strokeStyle = "#18181b"; ctx.lineWidth = 1; ctx.beginPath();
        for (let i = 0; i <= gridLineCount; i++) {
            const y = (chartHeight / gridLineCount) * i + 20;
            ctx.moveTo(0, y);
            ctx.lineTo(chartWidth, y);

            // Y-Axis Labels - skip every other on mobile
            if (!isMobile || i % 2 === 0) {
                const priceLevel = maxPrice - (i * (maxPrice - minPrice) / gridLineCount);
                ctx.fillStyle = "#52525b";
                ctx.font = `${fontSize}px monospace`;
                ctx.textAlign = "left";
                ctx.fillText(priceLevel.toFixed(isMobile ? 1 : 2), chartWidth + 4, y + 3);
            }
        }
        ctx.stroke();

        if (showMA) {
            ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2; ctx.beginPath(); let started = false;
            visibleCandles.forEach((c, i) => { const ma = calculateSMA(allCandles, 7, startIndex + i); if (ma) { const x = getX(i); const y = getY(ma); if (!started) { ctx.moveTo(x, y); started = true; } else { ctx.lineTo(x, y); } } }); ctx.stroke();
        }
        if (showFib) {
            const visibleHigh = Math.max(...prices); const visibleLow = Math.min(...prices); const diff = visibleHigh - visibleLow;
            [0, 0.382, 0.5, 0.618, 1].forEach(level => {
                const y = getY(visibleHigh - diff * level);
                ctx.beginPath(); ctx.strokeStyle = level === 0.618 ? "rgba(234, 179, 8, 0.4)" : "rgba(255, 255, 255, 0.08)";
                ctx.lineWidth = level === 0.618 ? 1.5 : 1; ctx.setLineDash([4, 2]); ctx.moveTo(0, y); ctx.lineTo(chartWidth, y); ctx.stroke(); ctx.setLineDash([]);
            });
        }

        visibleCandles.forEach((candle, i) => {
            const x = getX(i); const isGreen = candle.close >= candle.open; const color = isGreen ? "#10b981" : "#f43f5e";

            // Draw Wicks (Thicker)
            ctx.strokeStyle = color; ctx.lineWidth = 2.0; ctx.beginPath(); ctx.moveTo(x, getY(candle.high)); ctx.lineTo(x, getY(candle.low)); ctx.stroke();

            // Draw Body
            const bodyH = Math.max(Math.abs(getY(candle.open) - getY(candle.close)), 1);
            ctx.fillStyle = color; ctx.fillRect(x - candleWidth / 2, Math.min(getY(candle.open), getY(candle.close)), candleWidth, bodyH);

            // Draw Volume
            const maxVol = 40000; // Increased max volume to prevent capping
            let volH = (candle.volume / maxVol) * 80; // Allow taller bars
            if (volH > 80) volH = 80;

            // More opaque volume bars with border
            ctx.fillStyle = isGreen ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)";
            ctx.fillRect(x - candleWidth / 2, height - volH, candleWidth, volH);
            ctx.strokeStyle = isGreen ? "rgba(16, 185, 129, 0.6)" : "rgba(244, 63, 94, 0.6)"; // Slightly darker border
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x - candleWidth / 2, height - volH, candleWidth, volH);
        });

        signalMarkersRef.current.forEach(marker => {
            const relativeIndex = marker.candleIndex - startIndex;
            if (relativeIndex >= 0 && relativeIndex < viewCount) {
                const x = getX(relativeIndex);
                const isTop = marker.type === "SHORT" || marker.type === "ALERT";
                const y = getY(marker.price) + (isTop ? -25 : 25);
                ctx.beginPath(); ctx.strokeStyle = marker.type === "ALERT" ? "#f59e0b" : (marker.type === "LONG" ? "#10b981" : "#f43f5e");
                ctx.setLineDash([2, 2]); ctx.moveTo(x, y); ctx.lineTo(x, getY(marker.price)); ctx.stroke(); ctx.setLineDash([]);
                const labelText = marker.label; ctx.font = `bold ${fontSize}px monospace`;
                const w = ctx.measureText(labelText).width + 10; const h = markerHeight;
                ctx.fillStyle = ctx.strokeStyle; ctx.beginPath();
                if (isTop) { ctx.moveTo(x, y + 5); ctx.lineTo(x - 4, y); ctx.lineTo(x + 4, y); }
                else { ctx.moveTo(x, y - 5); ctx.lineTo(x - 4, y); ctx.lineTo(x + 4, y); } ctx.fill();
                ctx.fillStyle = marker.type === "ALERT" ? "rgba(245, 158, 11, 0.9)" : (marker.type === "LONG" ? "rgba(6, 78, 59, 0.9)" : "rgba(136, 19, 55, 0.9)");
                const rectY = isTop ? y - h : y; ctx.fillRect(x - w / 2, rectY, w, h);
                ctx.strokeStyle = marker.type === "ALERT" ? "#fcd34d" : (marker.type === "LONG" ? "#10b981" : "#f43f5e");
                ctx.strokeRect(x - w / 2, rectY, w, h);
                ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(labelText, x, rectY + h / 2);
            }
        });

        if (position) {
            const y = getY(position.entryPrice); ctx.strokeStyle = "#eab308"; ctx.lineWidth = 1; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(chartWidth, y); ctx.stroke(); ctx.setLineDash([]);
            ctx.fillStyle = "#eab308"; ctx.font = "10px monospace"; ctx.fillText(`${t.entry}`, chartWidth - 60, y - 5);
        }
        const curY = getY(currentPrice); ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(0, curY); ctx.lineTo(chartWidth, curY); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = currentPrice >= visibleCandles[visibleCandles.length - 1].open ? "#10b981" : "#f43f5e"; ctx.fillRect(chartWidth, curY - 10, paddingRight, 20);
        ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.fillText(currentPrice.toFixed(2), chartWidth + (paddingRight / 2), curY + 4);

        if (Math.random() > 0.8) {
            setMarketStats(prev => ({
                high: Math.max(prev.high, currentPrice),
                low: Math.min(prev.low, currentPrice),
                vol: prev.vol,
                sentiment: sentiment,
                regime: marketRegimeRef.current
            }));
        }

    }, [position, showMA, showFib, lang, isMobile]);

    useEffect(() => {
        const loop = () => {
            const now = Date.now();
            draw();
            if (now - lastPriceUpdateRef.current > 200 && currentCandleRef.current) {
                const p = currentCandleRef.current.close;
                setDisplayPrice(p.toFixed(2));
                setCandleDisplay({
                    o: currentCandleRef.current.open.toFixed(2),
                    h: currentCandleRef.current.high.toFixed(2),
                    l: currentCandleRef.current.low.toFixed(2),
                    c: currentCandleRef.current.close.toFixed(2),
                    v: currentCandleRef.current.volume.toFixed(0)
                });
                if (position) { const diff = p - position.entryPrice; const raw = position.type === "long" ? diff : -diff; setPnl((raw / position.entryPrice) * position.size * position.leverage); }
                lastPriceUpdateRef.current = now;
            }
            if (now - lastOrderBookUpdateRef.current > 400 && currentCandleRef.current) {
                const p = currentCandleRef.current.close;
                setOrderBook(generateOrderBook(p, 2 + Math.random() * 2));
                lastOrderBookUpdateRef.current = now;
            }
            animationRef.current = requestAnimationFrame(loop);
        };
        animationRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationRef.current);
    }, [draw, position]);

    const getRegimeIcon = () => {
        switch (marketStats.regime) {
            case "BULL": return <Sun size={14} className="text-yellow-500" />;
            case "BEAR": return <CloudRain size={14} className="text-blue-400" />;
            default: return <Wind size={14} className="text-zinc-400" />;
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 bg-zinc-950 font-sans text-zinc-300 select-none mb-24">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-zinc-800 pb-3 gap-3 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                    <Activity className="text-indigo-500" size={18} />
                    <span className="text-base sm:text-lg font-bold text-white tracking-wide font-mono">{t.title}</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono">
                        <div className="flex flex-col items-end">
                            <span className="text-zinc-500 hidden sm:inline">{t.equity}</span>
                            <span className="text-white font-bold">${balance.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-zinc-500 hidden sm:inline">{t.pnl}</span>
                            <span className={`${pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'} font-bold`}>{pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="h-6 w-px bg-zinc-800 hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleReset} className="p-2 rounded-full bg-zinc-900 border border-zinc-700 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-all text-zinc-500" title={t.reset}><RefreshCw size={14} /></button>
                        <button onClick={() => setLang(prev => prev === 'en' ? 'zh' : 'en')} className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-bold transition-all"><Globe size={14} className="text-indigo-400" /><span className="hidden sm:inline">{lang === 'en' ? 'EN' : '中'}</span></button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* Left Area - Chart Only */}
                <div className="lg:col-span-3 flex flex-col gap-3 h-full">

                    {/* Chart */}
                    <div className="h-[400px] lg:h-[450px] bg-zinc-900 border border-zinc-800 rounded-sm relative overflow-hidden group">


                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2 items-center opacity-80 z-20">
                            <div className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold font-mono">
                                {t.pair}
                            </div>
                            {candleDisplay && (
                                <div className="flex flex-wrap gap-x-2 sm:gap-x-4 gap-y-1 text-[9px] sm:text-xs font-mono text-zinc-300 font-bold bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                                    <span>O: <span className="text-white">{candleDisplay.o}</span></span>
                                    <span>H: <span className="text-white">{candleDisplay.h}</span></span>
                                    <span>L: <span className="text-white">{candleDisplay.l}</span></span>
                                    <span>C: <span className={Number(candleDisplay.c) >= Number(candleDisplay.o) ? "text-emerald-400" : "text-rose-400"}>{candleDisplay.c}</span></span>
                                    <span className="text-zinc-400 hidden sm:inline">V: <span className="text-zinc-200">{candleDisplay.v}</span></span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Controls */}
                <div className="lg:col-span-1 flex flex-col gap-3 h-full">

                    {/* Indicator Toggle Buttons - Above order book */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowMA(!showMA)}
                            className={`flex-1 px-2.5 py-2 rounded text-[10px] sm:text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${showMA ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}
                        >
                            {showMA ? <Eye size={14} /> : <EyeOff size={14} />}
                            <span className="whitespace-nowrap">{t.ma}</span>
                        </button>
                        <button
                            onClick={() => setShowFib(!showFib)}
                            className={`flex-1 px-2.5 py-2 rounded text-[10px] sm:text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${showFib ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}
                        >
                            <Layers size={14} />
                            <span className="whitespace-nowrap">{t.fib}</span>
                        </button>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-sm p-2 flex flex-col h-[200px] lg:h-[240px] transition-all">

                        <div className="flex justify-between text-[10px] text-zinc-500 uppercase mb-1"><span>{t.price}</span><span>{t.size}</span></div>
                        <div className="flex-1 flex flex-col-reverse overflow-hidden text-[10px] font-mono gap-[1px]">{orderBook.asks.map((item, i) => (<div key={i} className="flex justify-between relative px-1"><span className="text-rose-500 z-10">{item.price}</span><span className="text-zinc-500 z-10">{item.size}</span><div className="absolute right-0 top-0 bottom-0 bg-rose-900/20 z-0" style={{ width: `${parseFloat(item.size) * 2}%` }} /></div>))}</div>
                        <div className="py-1 text-center font-bold text-white text-sm border-y border-zinc-800 my-1 bg-zinc-800/30">{displayPrice}</div>
                        <div className="flex-1 flex flex-col overflow-hidden text-[10px] font-mono gap-[1px]">{orderBook.bids.map((item, i) => (<div key={i} className="flex justify-between relative px-1"><span className="text-emerald-500 z-10">{item.price}</span><span className="text-zinc-500 z-10">{item.size}</span><div className="absolute right-0 top-0 bottom-0 bg-emerald-900/20 z-0" style={{ width: `${parseFloat(item.size) * 2}%` }} /></div>))}</div>
                    </div>

                    <div className="flex-1 min-h-fit bg-zinc-900 border border-zinc-800 rounded-sm p-4 flex flex-col justify-between">


                        <div>
                            <div className="flex justify-between text-xs text-zinc-400 mb-2"><span>{t.leverage}</span><span className="text-yellow-500 font-bold">{leverage}x</span></div>
                            <input type="range" min="1" max="10" value={leverage} onChange={(e) => setLeverage(Number(e.target.value))} disabled={!!position} className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                        </div>

                        <div className="my-4 space-y-2 border-t border-b border-zinc-800/50 py-3">
                            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2"><BarChart3 size={10} /> {t.marketVitals}</div>

                            {/* Regime Display */}
                            <div className="flex justify-between items-center bg-zinc-950 p-2 rounded border border-zinc-800/50 mb-2">
                                <div className="flex items-center gap-2">
                                    {getRegimeIcon()}
                                    <span className="text-[10px] font-bold text-zinc-300">
                                        {marketStats.regime === "BULL" ? t.regimeBull : marketStats.regime === "BEAR" ? t.regimeBear : t.regimeChop}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] text-zinc-400"><span>{t.sentiment}</span><span className={marketStats.sentiment > 50 ? "text-emerald-500" : "text-rose-500"}>{Math.floor(marketStats.sentiment)}%</span></div>
                                <div className="h-1.5 w-full bg-rose-900/30 rounded-full overflow-hidden flex"><div className="h-full bg-emerald-500 transition-all duration-1000 ease-out" style={{ width: `${marketStats.sentiment}%` }} /></div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button onClick={startScanning} disabled={aiState === "scanning" || !!position} className={`w-full py-3 rounded text-xs font-bold flex items-center justify-center gap-2 transition-all ${aiState === "scanning" ? "bg-zinc-800 text-zinc-500" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"}`}>
                                {aiState === "scanning" ? <Activity size={14} className="animate-spin" /> : <Zap size={14} />} {aiState === "scanning" ? t.scanRunning : t.scanIdle}
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => executeTrade("long")} disabled={!!position} className={`py-4 rounded flex flex-col items-center justify-center gap-1 transition-all border border-transparent relative overflow-hidden group ${!!position ? "opacity-20 cursor-not-allowed bg-zinc-800" : "bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500"} ${aiRecommendation === "LONG" && !position ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : ""}`}>
                                    {aiRecommendation === "LONG" && !position && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />}
                                    <TrendingUp size={18} className={aiRecommendation === "LONG" && !position ? "text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" : ""} />
                                    <span className="text-xs font-black relative z-10">{t.buy}</span>
                                </button>
                                <button onClick={() => executeTrade("short")} disabled={!!position} className={`py-4 rounded flex flex-col items-center justify-center gap-1 transition-all border border-transparent relative overflow-hidden group ${!!position ? "opacity-20 cursor-not-allowed bg-zinc-800" : "bg-rose-600/10 hover:bg-rose-600/20 text-rose-500"} ${aiRecommendation === "SHORT" && !position ? "border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)]" : ""}`}>
                                    {aiRecommendation === "SHORT" && !position && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />}
                                    <TrendingDown size={18} className={aiRecommendation === "SHORT" && !position ? "text-rose-400 drop-shadow-[0_0_5px_rgba(251,113,133,0.8)]" : ""} />
                                    <span className="text-xs font-black relative z-10">{t.sell}</span>
                                </button>
                            </div>
                            {position && (<div className="mt-2 pt-4 border-t border-zinc-800 animate-in slide-in-from-bottom-2"><div className="flex justify-between items-center mb-2 text-xs"><span className="text-zinc-500">{t.entry}</span><span className="text-white font-mono">{position.entryPrice.toFixed(2)}</span></div><button onClick={closePosition} className="w-full py-3 bg-zinc-100 hover:bg-white text-black font-bold text-xs rounded flex items-center justify-center gap-2"><Lock size={14} /> {t.close}</button></div>)}
                        </div>
                    </div>
                </div>

            </div>

            {/* Terminal (Now Full Width Below) */}
            <div className="w-full mt-4 min-h-[12rem] bg-black border border-zinc-800 rounded-sm p-3 font-mono text-xs overflow-hidden flex flex-col shadow-inner shadow-black/50">

                <div className="flex items-center gap-2 text-zinc-500 mb-2 border-b border-zinc-900 pb-1">
                    <Terminal size={12} />
                    <span className="uppercase tracking-widest text-[10px]">{t.terminalTitle}</span>
                    {aiState === "scanning" && <span className="animate-pulse text-indigo-500">● {t.processing}</span>}
                </div>
                <div className="flex-1 overflow-hidden flex flex-col-reverse gap-1">
                    {logs.map((log, i) => (
                        <div key={i} className={`flex gap-2`}>
                            <span className="text-zinc-700">[{log.time}]</span>
                            <span className={
                                log.type === "alert" ? "text-rose-500 font-bold" :
                                    log.type === "success" ? "text-emerald-400 font-bold" :
                                        log.type === "subtle" ? "text-zinc-500 italic block pl-6 border-l-2 border-zinc-800" :
                                            log.type === "warning" ? "text-yellow-400" : "text-zinc-400"
                            }>
                                {(i === 0 && log.type !== "subtle") && <span className="mr-2">➜</span>}
                                {log.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}