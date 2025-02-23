
import { memo } from 'react';
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  Shield, 
  DollarSign, 
  Scale, 
  RotateCcw, 
  ShieldCheck, 
  Calculator, 
  Copyright 
} from "lucide-react";
import { Separator } from "./ui/separator";

const PolicyLink = memo(({ 
  icon: Icon, 
  text, 
  href 
}: { 
  icon: typeof FileText; 
  text: string; 
  href: string;
}) => (
  <Link 
    to={href} 
    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
  >
    <div className="p-2 bg-secondary/30 rounded-lg group-hover:bg-primary/10 transition-colors">
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-sm">{text}</span>
  </Link>
));

PolicyLink.displayName = 'PolicyLink';

const ContactItem = memo(({ 
  icon: Icon, 
  text 
}: { 
  icon: typeof Building2; 
  text: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-primary/10 rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <span className="text-sm text-muted-foreground">{text}</span>
  </div>
));

ContactItem.displayName = 'ContactItem';

const Footer = () => {
  return (
    <footer className="mt-auto pt-24 pb-8">
      <div className="container">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Logo />
                <p className="text-sm font-medium text-muted-foreground">TLYSN INTERNATIONAL CO., LTD</p>
              </div>
              <div className="space-y-4">
                <ContactItem 
                  icon={Building2} 
                  text="House/Building No. D១៤, Street/Road No. ១៣៧K៣២, Trapeang Chrey, Kakab 2, Pur SenChey, Phnom Penh, Cambodia" 
                />
                <ContactItem 
                  icon={Mail} 
                  text="contact@ftsoa.art" 
                />
                <ContactItem 
                  icon={Phone} 
                  text="+855 31 203 6789" 
                />
              </div>
            </div>

            {/* Policies Column 1 */}
            <div className="space-y-4">
              <h3 className="font-semibold mb-6">Legal</h3>
              <div className="space-y-4">
                <PolicyLink 
                  icon={FileText} 
                  text="Terms of Service" 
                  href="/terms" 
                />
                <PolicyLink 
                  icon={Shield} 
                  text="Privacy Policy" 
                  href="/privacy" 
                />
                <PolicyLink 
                  icon={DollarSign} 
                  text="AML & KYC Policy" 
                  href="/aml-kyc" 
                />
              </div>
            </div>

            {/* Policies Column 2 */}
            <div className="space-y-4">
              <h3 className="font-semibold mb-6">Policies</h3>
              <div className="space-y-4">
                <PolicyLink 
                  icon={Scale} 
                  text="License Agreement" 
                  href="/license" 
                />
                <PolicyLink 
                  icon={RotateCcw} 
                  text="Refund Policy" 
                  href="/refund" 
                />
                <PolicyLink 
                  icon={ShieldCheck} 
                  text="Security Policy" 
                  href="/security" 
                />
              </div>
            </div>

            {/* Policies Column 3 */}
            <div className="space-y-4">
              <h3 className="font-semibold mb-6">Additional Info</h3>
              <div className="space-y-4">
                <PolicyLink 
                  icon={Calculator} 
                  text="Tax Policy" 
                  href="/tax" 
                />
                <PolicyLink 
                  icon={Copyright} 
                  text="Intellectual Property" 
                  href="/ip" 
                />
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-muted/20" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 FTSOA. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>Powered by</span>
              <Link 
                to="https://polygon.technology" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Polygon
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
