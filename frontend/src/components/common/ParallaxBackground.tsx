import { motion } from 'framer-motion';

const ParallaxBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 z-10" />
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x" />
      
      {/* Parallax image with animation */}
      <motion.img
        initial={{ scale: 1.2, y: 0 }}
        animate={{ 
          scale: [1.2, 1.3, 1.2],
          y: [0, 50, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072"
        alt="Background"
        className="w-full h-full object-cover opacity-20"
      />
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default ParallaxBackground;
