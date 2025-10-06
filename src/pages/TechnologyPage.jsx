// src/pages/TechnologyPage.jsx
import React from 'react';
import { BrainCircuit, BarChartHorizontal, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion'; // 1. Import motion

const TechnologyPage = () => {
  // 2. Define a simple animation variant
  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeInOut" }
    },
  };

  return (
    <div className="relative min-h-screen pt-32 pb-16 px-4 overflow-hidden">
      <div className="aurora-background"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        
        <h1 className="text-5xl font-bold text-center text-white mb-4 tracking-tight">
          The DeepShield Forensic Engine
        </h1>
        <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-16">
          Our system unmasks digital deception through a proprietary, multi-layered analysis pipeline. Each layer examines the media from a different vector, ensuring unparalleled accuracy and depth.
        </p>

        {/* 3. Wrap each card in a motion.div */}
        <div className="space-y-8">
          <motion.div
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Layer 1: Micro-Artifact Analysis */}
            <div className="border border-white/10 bg-panel backdrop-blur-lg rounded-2xl p-8 flex items-start space-x-6">
              {/* ... content of card 1 ... */}
               <div className="bg-sky-500/20 p-3 rounded-full shrink-0">
                  <BarChartHorizontal className="text-sky-400" size={28} />
               </div>
               <div>
                  <h3 className="text-gray-400 font-semibold">LAYER 1</h3>
                  <h2 className="text-2xl font-bold text-white mt-1">Micro-Artifact Analysis</h2>
                  <p className="mt-3 text-gray-300">
                    Our initial defense is a specialized Convolutional Neural Network (CNN) trained to hunt for microscopic imperfections. It performs a quantitative scan for pixel-level inconsistencies, compression ghosts, and GAN fingerprintssubtle artifacts left by generation tools that are invisible to the naked eye. This provides a rapid, data-driven integrity score.
                  </p>
               </div>
            </div>
          </motion.div>

          {/* Add more motion.div wrappers for the other cards similarly... */}
           <motion.div
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="border border-white/10 bg-panel backdrop-blur-lg rounded-2xl p-8 flex items-start space-x-6">
              <div className="bg-sky-500/20 p-3 rounded-full shrink-0">
                <BrainCircuit className="text-sky-400" size={28} />
              </div>
              <div>
                <h3 className="text-gray-400 font-semibold">LAYER 2</h3>
                <h2 className="text-2xl font-bold text-white mt-1">Cognitive & Contextual Forensics</h2>
                <p className="mt-3 text-gray-300">
                  Suspicious media is escalated to our proprietary heuristic engine. This advanced model moves beyond pixels to perform a cognitive analysis of the content's semantic integrity. It cross-references dozens of contextual vectorssuch as impossible lighting, unnatural physics, micro-expression anomalies, and audio-visual desynchronizationto determine if the scene is logically and physically plausible.
                </p>
              </div>
            </div>
          </motion.div>

       

          {/* Layer 3: Wrapped in motion.div */}
          <motion.div
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="border border-white/10 bg-panel backdrop-blur-lg rounded-2xl p-8 flex items-start space-x-6">
              <div className="bg-sky-500/20 p-3 rounded-full shrink-0">
                <ShieldCheck className="text-sky-400" size={28} />
              </div>
              <div>
                <h3 className="text-gray-400 font-semibold">LAYER 3</h3>
                <h2 className="text-2xl font-bold text-white mt-1">Verdict Synthesis Engine</h2>
                <p className="mt-3 text-gray-300">
                  The final stage is adjudication. The DeepShield engine synthesizes the quantitative data from the micro-artifact scan with the qualitative insights from the cognitive forensic engine. By weighing all evidence, it delivers a final, high-confidence verdict, complete with a detailed forensic report outlining precisely why the media was flagged.
                </p>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};

export default TechnologyPage;