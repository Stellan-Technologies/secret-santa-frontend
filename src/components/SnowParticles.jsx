import { motion } from "framer-motion";

function SnowLayer({ count, sizeRange, speedRange, drift, opacity }) {
  const flakes = Array.from({ length: count });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((_, i) => {
        const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
        const left = Math.random() * 100; // viewport width in %
        const duration = Math.random() * (speedRange[1] - speedRange[0]) + speedRange[0];
        const delay = Math.random() * duration;

        return (
          <motion.div
            key={i}
            initial={{
              y: -20,
              x: 0,
              opacity: 0,
            }}
            animate={{
              y: "110vh",
              x: drift ? Math.random() * drift - drift / 2 : 0,
              opacity: [0, opacity, opacity, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bg-white rounded-full shadow-md"
            style={{
              width: size,
              height: size,
              left: `${left}vw`,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
}

export default function SnowParticles() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Background — tiny, fast */}
      <SnowLayer
        count={60}
        sizeRange={[2, 4]}
        speedRange={[6, 10]}
        drift={10}
        opacity={0.4}
      />

      {/* Midground — medium */}
      <SnowLayer
        count={40}
        sizeRange={[4, 7]}
        speedRange={[8, 14]}
        drift={20}
        opacity={0.7}
      />

      {/* Foreground — big and slow */}
      <SnowLayer
        count={25}
        sizeRange={[7, 12]}
        speedRange={[10, 18]}
        drift={30}
        opacity={1}
      />
    </div>
  );
}
