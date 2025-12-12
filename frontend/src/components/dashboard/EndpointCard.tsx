import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { DashboardCard } from '../../types';

interface EndpointCardProps {
  card: DashboardCard;
  index: number;
}

const EndpointCard: React.FC<EndpointCardProps> = ({ card, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(card.route)}
      className="cursor-pointer group"
    >
      <div 
        className={`relative h-full p-8 rounded-2xl shadow-2xl transition-all duration-300 backdrop-blur-2xl border border-white/10 hover:border-white/30 ${card.color}`}
        style={{
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Icon with glow effect */}
        <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
          {card.icon}
        </div>
        
        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
          {card.title}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed">
          {card.description}
        </p>
        
        {/* Arrow indicator with animation */}
        <motion.div 
          className="absolute bottom-6 right-6 text-white/40 text-3xl"
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          →
        </motion.div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
};

export default EndpointCard;
