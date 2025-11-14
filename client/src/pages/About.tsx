import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiWhatsapp } from "react-icons/si";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function About() {
  const whatsappNumber = "+962791234567";
  const whatsappMessage = "Hello! I'd like to know more about Al Qalam Motors.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pt-24 pb-16 flex-1">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-primary">Al Qalam Motors</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Your trusted partner for premium vehicles in Amman, Jordan
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Al Qalam Motors has been serving the Amman community for years, providing exceptional quality vehicles and outstanding customer service. We take pride in offering a carefully curated selection of premium cars from trusted brands.
                </p>
                <p>
                  Our commitment to excellence means every vehicle in our inventory undergoes thorough inspection and comes with complete service history. We believe in transparency, integrity, and building long-lasting relationships with our customers.
                </p>
                <p>
                  Whether you're looking for a reliable family sedan, a powerful SUV, or a luxury vehicle, our knowledgeable team is here to help you find the perfect match for your needs and budget.
                </p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Visit Our Showroom</h2>
                <div className="aspect-video rounded-md overflow-hidden mb-6 bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.8261841475144!2d35.86643831519313!3d31.963157581244785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1c0d8d4f36d%3A0x5c2cf66f9c8c8c8c!2sMecca%20St%2C%20Amman%2C%20Jordan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Address</p>
                      <p className="text-sm text-muted-foreground">
                        Mecca Street, Amman, Jordan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Business Hours</p>
                      <p className="text-sm text-muted-foreground">
                        Sunday - Thursday: 9:00 AM - 8:00 PM<br />
                        Friday - Saturday: 10:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Phone</p>
                    <a
                      href="tel:+962791234567"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      +962 79 123 4567
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">Email</p>
                    <a
                      href="mailto:info@alqalammotors.jo"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      info@alqalammotors.jo
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#00a884] to-[#25D366] flex items-center justify-center shrink-0 shadow-md">
                    <SiWhatsapp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">WhatsApp</p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Chat with us
                    </a>
                  </div>
                </div>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#00a884] to-[#25D366] hover:from-[#008c6f] hover:to-[#20BD5A] text-white border-0 shadow-md"
                data-testid="button-contact-whatsapp"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <SiWhatsapp className="w-5 h-5 mr-2" />
                  Start a Conversation
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
