import { Experience } from '@/data/experience'

export interface StockDataPoint {
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
    event?: Experience
    annotated?: boolean
}

/**
 * Transforms experience data into a continuous time-series "stock chart" with OHLC data
 */
export function transformExperienceToStockData(experiences: Experience[]): StockDataPoint[] {
    if (experiences.length === 0) return []
    // Sort experiences by start date
    const sorted = [...experiences].sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    const dataPoints: StockDataPoint[] = []
    let currentPrice = 100 // Starting "stock price"
    let currentDate = new Date(sorted[0].startDate)
    // Start a bit before the first job to show entry
    currentDate.setMonth(currentDate.getMonth() - 2)

    const endDate = new Date() // Today

    // Iterate month by month until today
    while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().slice(0, 7) // YYYY-MM

        // Check if any job started this month
        const startingJob = sorted.find(exp => {
            const expStart = exp.startDate
            return expStart.getFullYear() === currentDate.getFullYear() && expStart.getMonth() === currentDate.getMonth()
        })

        const open = currentPrice
        let close = currentPrice
        let high = currentPrice
        let low = currentPrice
        let volume = Math.floor(Math.random() * 1000) + 500
        let event: Experience | undefined = undefined
        let isAnnotated = false

        // Base monthly movement
        let change = (Math.random() - 0.4) * 5 // Slight upward bias

        if (startingJob) {
            // Big jump for new job
            change = 20 + Math.random() * 10
            volume += 5000 // High volume on "IPO" or "Earnings"
            event = startingJob
            isAnnotated = true
        } else {
            // Continuous employment growth
            change += 1
        }

        close = open + change

        // Calculate High/Low based on Open/Close with some wicks
        high = Math.max(open, close) + Math.random() * 2
        low = Math.min(open, close) - Math.random() * 2

        // Ensure no negative prices
        if (low < 0) low = 0
        if (close < 0) close = 0

        currentPrice = close

        dataPoints.push({
            date: dateStr,
            open: Number(open.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            close: Number(close.toFixed(2)),
            event: event,
            volume: volume,
            annotated: isAnnotated
        })

        // Next month
        currentDate.setMonth(currentDate.getMonth() + 1)
    }

    return dataPoints
}
