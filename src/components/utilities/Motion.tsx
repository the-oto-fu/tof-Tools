import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

//引数childrenはこのコンポーネントで囲った内容となる
//childrenをreturn内で使うことでJSXをラップするコンポーネントを定義できる
type propsType = {
    children: ReactNode
};

export const OpacityMotion = (props: propsType) => {
    return (
            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {props.children}
            </motion.div>
    )
}

export const SpringUpMotion = (props: propsType) => {
    return (
        <motion.div
            initial={{ y: "100vh" }}
            animate={{
                y: "0",
                transitionEnd: {
                    transform: "none"
                }
            }}
            transition={{ type: "spring", stiffness: 80 }}
        >
            {props.children}
        </motion.div>
    )
}