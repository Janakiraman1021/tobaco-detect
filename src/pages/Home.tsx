import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Database, Lock, FlaskRound as Flask, BarChart as ChartBar, Shield, Microscope } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background via-primary-900 to-background"
    >
      {/* Hero Section */}
      <div className="relative h-screen">
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)'
          }}
        />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-7xl font-bold mb-6 neon-glow bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-500"
            >
              Tobacco Usage Detection System
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
            >
              Revolutionizing tobacco usage detection with cutting-edge AI technology and real-time analysis
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cyberpunk-border px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold text-lg"
                onClick={() => navigate('/login')}
              >
                Get Started
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-16 neon-glow"
        >
          Advanced Detection Features
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Brain,
              title: "AI-Powered Analysis",
              description: "State-of-the-art machine learning algorithms for accurate detection and pattern recognition",
              image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            },
            {
              icon: Database,
              title: "Secure Data Management",
              description: "Enterprise-grade security protocols ensuring complete protection of sensitive medical data",
              image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            },
            {
              icon: Lock,
              title: "Role-Based Access",
              description: "Granular access control system with dedicated interfaces for different user roles",
              image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="glassmorphism p-6 rounded-xl overflow-hidden"
            >
              <div className="h-48 mb-6 overflow-hidden rounded-lg">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <feature.icon className="w-12 h-12 text-primary-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-16 neon-glow"
          >
            How It Works
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Upload Sample",
                description: "Submit your sample data through our secure interface"
              },
              {
                step: "2",
                title: "AI Processing",
                description: "Our advanced AI algorithms analyze the data in real-time"
              },
              {
                step: "3",
                title: "Result Analysis",
                description: "Get detailed insights and pattern recognition results"
              },
              {
                step: "4",
                title: "Report Generation",
                description: "Receive comprehensive reports with actionable insights"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="glassmorphism p-6 rounded-xl relative"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 mt-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center mb-16 neon-glow"
          >
            Key Benefits
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Cost-Effective Solution",
                description: "Reduce operational costs with automated detection systems",
                color: "from-blue-500 to-purple-500"
              },
              {
                title: "Time Efficiency",
                description: "Get instant results with our real-time processing capability",
                color: "from-green-500 to-teal-500"
              },
              {
                title: "High Accuracy",
                description: "Industry-leading precision in tobacco usage detection",
                color: "from-yellow-500 to-red-500"
              },
              {
                title: "Easy Integration",
                description: "Seamlessly integrate with existing healthcare systems",
                color: "from-purple-500 to-pink-500"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glassmorphism p-8 rounded-xl"
              >
                <div className={`h-2 w-20 mb-6 rounded bg-gradient-to-r ${benefit.color}`} />
                <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-400 text-lg">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-24">
          {[
            { icon: Flask, value: "99.8%", label: "Detection Accuracy" },
            { icon: ChartBar, value: "50K+", label: "Tests Conducted" },
            { icon: Shield, value: "100%", label: "Data Security" },
            { icon: Microscope, value: "24/7", label: "Real-time Analysis" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glassmorphism p-6 rounded-xl text-center"
            >
              <stat.icon className="w-10 h-10 text-primary-500 mb-4 mx-auto" />
              <div className="text-3xl font-bold mb-2 text-white">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 z-0" 
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.3)'
            }}
          />
          <div className="relative z-10 p-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-6 neon-glow"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Join the future of tobacco usage detection with our advanced AI-powered system
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cyberpunk-border px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold text-lg"
              onClick={() => navigate('/login')}
            >
              Start Detection Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}