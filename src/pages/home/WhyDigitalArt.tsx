
export const WhyDigitalArt = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl" />
      <div className="glass-card rounded-3xl p-12 md:p-16 lg:p-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
            Why Digital Art is the
            <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
              Future of Collecting
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Digital art represents a new frontier in collecting, offering unique opportunities for ownership and appreciation in the digital age
          </p>
        </div>
      </div>
    </div>
  );
};
