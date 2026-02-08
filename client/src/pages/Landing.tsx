import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, Sparkles, CheckCircle2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
            <span>Learning reimagined for the modern age</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Unlock your potential with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              expert-led courses
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Master Math, Science, and Arabic with our premium curriculum. 
            Join thousands of students achieving their dreams today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all" asChild>
              <a href="/api/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full border-2" asChild>
              <a href="#features">Learn more</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Why choose ilearn?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We focus on quality over quantity. Our specialized courses are crafted by industry experts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-background rounded-2xl p-8 shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-display">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Students", value: "10k+" },
              { label: "Course Rating", value: "4.9/5" },
              { label: "Hours of Content", value: "500+" },
              { label: "Success Rate", value: "94%" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-display font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Expert Mathematics",
    description: "From algebra to calculus, master the fundamentals with our comprehensive math curriculum designed for all levels.",
    icon: Brain,
    color: "bg-blue-500",
  },
  {
    title: "Scientific Discovery",
    description: "Explore the wonders of physics, chemistry, and biology through interactive lessons and real-world experiments.",
    icon: Sparkles,
    color: "bg-purple-500",
  },
  {
    title: "Arabic Mastery",
    description: "Learn to speak, read, and write Arabic fluently with our immersive language program focused on practical usage.",
    icon: BookOpen,
    color: "bg-emerald-500",
  },
];
