
import { memo } from "react";

const Security = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-24">
        <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Security Policy</h1>
              <div className="h-1 w-20 bg-primary/50 rounded-full" />
            </div>

            {/* 1. General Provisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. General Provisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>1.1. This Security Policy (hereinafter referred to as the "Policy") defines the measures aimed at protecting users of the platform http://ftsoa.art (hereinafter referred to as the "Platform") and ensuring data security.</p>
                <p>1.2. By using the Platform, the user fully agrees to this Policy.</p>
                <p>1.3. The Platform Administration reserves the right to modify this Policy at any time without prior notice.</p>
              </div>
            </section>

            {/* 2. Data Security */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Data Security</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>2.1. The Platform employs modern security measures, including data encryption, multi-factor authentication, and user activity monitoring.</p>
                <p>2.2. Access to personal data is restricted and granted only to authorized personnel who adhere to strict confidentiality standards.</p>
                <p>2.3. Users must ensure the security of their account credentials and must not share them with third parties.</p>
              </div>
            </section>

            {/* 3. Transaction Protection */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Transaction Protection</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>3.1. All transactions on the Platform are processed through secure payment gateways and cryptographic protocols.</p>
                <p>3.2. The Platform monitors transactions for fraud and suspicious activities.</p>
                <p>3.3. If suspicious activities are detected, the Platform reserves the right to suspend the transaction and request additional information from the user.</p>
              </div>
            </section>

            {/* 4. Access Management and Authentication */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Access Management and Authentication</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>4.1. To protect user accounts, the Platform recommends enabling two-factor authentication (2FA).</p>
                <p>4.2. If a user suspects that their account has been compromised, they must immediately report it to customer support.</p>
                <p>4.3. The Platform reserves the right to temporarily block an account if suspicious activity is detected.</p>
              </div>
            </section>

            {/* 5. User Responsibilities */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. User Responsibilities</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>5.1. Users must take precautionary measures when using the Platform, including using strong passwords and keeping their software updated.</p>
                <p>5.2. It is strictly prohibited to use the Platform for distributing malware, phishing, or conducting other cybersecurity attacks.</p>
                <p>5.3. If the Security Policy is violated, the user's account may be blocked without prior notice.</p>
              </div>
            </section>

            {/* 6. Incident Response */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Incident Response</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>6.1. If a security threat is detected, the Platform will take measures to mitigate risks and notify users.</p>
                <p>6.2. Users can report security issues to the Platform's support team.</p>
                <p>6.3. The Platform reserves the right to conduct internal investigations of security incidents and take appropriate actions.</p>
              </div>
            </section>

            {/* 7. Contact Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Contact Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>7.1. All security-related inquiries can be directed to customer support via email at contact@ftsoa.art or through the feedback form.</p>
                <p>7.2. Last update date of this Policy: February 22, 2025.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(Security);
