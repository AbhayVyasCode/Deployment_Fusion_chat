import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const Card = ({ className, children, hover = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={hover ? { y: -5, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)" } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
