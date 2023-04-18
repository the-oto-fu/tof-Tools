import { motion } from 'framer-motion'

function Top() {
    return (
        <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <div class="shapes">
                <div class="shape shape1"></div>
                <div class="shape shape2"></div>
                <div class="shape shape3"></div>
            </div>

            <div className="toppage-content">
                <div>tofTool</div>
                <p>
                    工事中で〜す
                </p>
            </div>
        </motion.div>
    )
}

export default Top
