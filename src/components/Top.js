import { Container, Header } from 'semantic-ui-react'
import { motion } from 'framer-motion'

function Top() {
    return (
        <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Container className='main'>
                <Header as='h2'>Welcome！</Header>
                <p>
                    サイトの説明を記載
                </p>
            </Container>
        </motion.div>
    )
}

export default Top
