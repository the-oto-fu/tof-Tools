import { useEffect } from 'react'
import { Container, Header } from 'semantic-ui-react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

function Top() {
    const shapeRef = useRef();
    useEffect(() => {
      gsap.to(div.current, {
        backgroundImage: "linear-gradient(to left, #30CFD0, #330867)",
        duration: 5
      });
    }, [div]);

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

            <div class="content">
                <h1>tofTool</h1>
            </div>
            <p>
                サイトの説明を記載
            </p>
        </motion.div>
    )
}

export default Top
