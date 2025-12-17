"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Globe, HeartHandshake } from "lucide-react";

interface CommunitySectionProps {
  title?: string;
  subtitle?: string;
  paragraph1?: string;
  paragraph2?: string;
  highlights?: Record<string, string>;
}

export default function CommunitySection({
  title = "About Our Community",
  subtitle = "A Family United by Faith",
  paragraph1,
  paragraph2,
  highlights,
}: CommunitySectionProps) {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          <p className="text-xl text-muted-foreground font-medium">{subtitle}</p>
          <div className="space-y-4 text-left md:text-center pt-4">
            <p className="leading-relaxed">{paragraph1}</p>
            <p className="leading-relaxed">{paragraph2}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-muted/50 border-none shadow-sm">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{highlights?.highlight1_title}</h3>
              <p className="text-muted-foreground">{highlights?.highlight1_description}</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-none shadow-sm">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{highlights?.highlight2_title}</h3>
              <p className="text-muted-foreground">{highlights?.highlight2_description}</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-none shadow-sm">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">{highlights?.highlight3_title}</h3>
              <p className="text-muted-foreground">{highlights?.highlight3_description}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}