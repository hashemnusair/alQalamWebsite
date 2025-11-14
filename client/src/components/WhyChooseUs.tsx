import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, DollarSign, Wrench, Clock } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Quality Assured",
      description: "Every vehicle thoroughly inspected and certified for your peace of mind",
    },
    {
      icon: DollarSign,
      title: "Competitive Pricing",
      description: "Best value in the market with transparent pricing and no hidden fees",
    },
    {
      icon: Wrench,
      title: "Full Service History",
      description: "Comprehensive maintenance records for all our vehicles",
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Quick and efficient service to get you on the road faster",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-mono mb-4">
            Why Choose Al Qalam Motors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your trusted partner for premium vehicles in Amman
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
