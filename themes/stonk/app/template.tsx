'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div 
                className="min-h-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                    duration: 0.3, 
                    ease: "easeInOut"
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}
