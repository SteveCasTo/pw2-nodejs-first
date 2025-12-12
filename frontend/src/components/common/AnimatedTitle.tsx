import { motion } from 'framer-motion';
import { useState } from 'react';

const AnimatedTitle = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const title = "FormifyX";

  return (
    <div className="flex items-center justify-center">
      {title.split('').map((char, index) => (
        <motion.span
          key={index}
          className="text-6xl md:text-8xl font-bold inline-block cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          animate={{
            rotateY: hoveredIndex === index ? 360 : 0,
            scale: hoveredIndex === index ? 1.2 : 1,
            color: hoveredIndex === index ? '#667eea' : '#764ba2',
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedTitle;
