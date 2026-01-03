import { Link } from 'react-router-dom';
import { 
  Users, Calendar, DollarSign, TrendingUp, Shield, 
  BarChart3, Clock, FileText, CheckCircle2, Zap,
  ArrowRight, Menu, X, Star
} from 'lucide-react';
import { useState } from 'react';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Employee Management",
      description: "Comprehensive employee profiles, onboarding, and organizational hierarchy management."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Attendance",
      description: "Biometric and geo-fenced attendance tracking with real-time monitoring."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Automated Payroll",
      description: "Intelligent payroll calculation with tax slabs and automated payslip generation."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Performance Appraisal",
      description: "OKR-based performance tracking with peer feedback and 360-degree reviews."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "AI Analytics",
      description: "Predictive analytics for leave patterns and attrition risk assessment."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "JWT authentication, RBAC, audit logs, and compliance-ready architecture."
    }
  ];

  const stats = [
    { label: "Active Users", value: "10K+" },
    { label: "Companies", value: "500+" },
    { label: "Countries", value: "50+" },
    { label: "Uptime", value: "99.9%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Dayflow HRMS
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
              <a href="#analytics" className="text-slate-300 hover:text-white transition">Analytics</a>
              <a href="#security" className="text-slate-300 hover:text-white transition">Security</a>
              <Link to="/login" className="text-slate-300 hover:text-white transition">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
            
            <button 
              className="md:hidden text-slate-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-700/50">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-slate-300 hover:text-white">Features</a>
              <a href="#analytics" className="block text-slate-300 hover:text-white">Analytics</a>
              <a href="#security" className="block text-slate-300 hover:text-white">Security</a>
              <Link to="/login" className="block text-slate-300 hover:text-white">Login</Link>
              <Link to="/register" className="block btn-primary text-center">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 animate-fade-in">
            <Star className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm text-indigo-300">Trusted by 500+ Companies Worldwide</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent animate-slide-up">
            Transform Your HR Operations
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              With AI-Powered Insights
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto animate-fade-in">
            The complete Human Resource Management System that streamlines attendance, payroll, 
            performance, and analytics—all in one intelligent platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center group">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 border-2 border-slate-600 rounded-xl font-semibold hover:border-indigo-500 hover:text-indigo-400 transition-all">
              Watch Demo
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="text-4xl font-bold text-indigo-400 mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="text-indigo-400">Manage Your Workforce</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Powerful features designed to simplify HR operations and drive organizational success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="card hover:border-indigo-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 group"
              >
                <div className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Real-Time <span className="text-indigo-400">Analytics & Insights</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8">
                Make data-driven decisions with comprehensive dashboards, attendance heat-maps, 
                leave trend analysis, and AI-powered predictions.
              </p>
              <ul className="space-y-4">
                {[
                  "Attendance heat-maps and patterns",
                  "Leave trend forecasting",
                  "Attrition risk prediction",
                  "Performance metrics visualization",
                  "Custom KPI dashboards"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/30">
              <div className="h-64 flex items-center justify-center">
                <BarChart3 className="w-32 h-32 text-indigo-400/50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Enterprise-Grade <span className="text-indigo-400">Security</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built with security and compliance at its core.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <Shield className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">JWT Authentication</h3>
              <p className="text-slate-400">Secure token-based authentication with refresh tokens.</p>
            </div>
            <div className="card text-center">
              <Users className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-slate-400">Granular permissions and role management (RBAC).</p>
            </div>
            <div className="card text-center">
              <FileText className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Audit Logs</h3>
              <p className="text-slate-400">Complete activity tracking for compliance and security.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card bg-gradient-to-r from-indigo-600 to-purple-600 border-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your HR Operations?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of companies using Dayflow HRMS to streamline their workforce management.
            </p>
            <Link to="/register" className="inline-flex items-center bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Dayflow HRMS</span>
            </div>
            <div className="text-slate-400 text-sm">
              © 2024 Dayflow HRMS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

