
import { memo } from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-24">
        <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
              <div className="h-1 w-20 bg-primary/50 rounded-full" />
            </div>

            {/* 1. General Provisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. General Provisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>1.1. This Privacy Policy governs the collection, use, and protection of users' personal data on the platform http://ftsoa.art (hereinafter referred to as the "Platform").</p>
                <p>1.2. By using the Platform, the user agrees to the terms of this Policy.</p>
                <p>1.3. The Platform Administration reserves the right to modify this Policy at any time without prior notice.</p>
              </div>
            </section>

            {/* 2. Data Collection and Use */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Data Collection and Use</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>2.1. The Platform collects the following categories of personal data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact details (email, phone number);</li>
                  <li>Payment information (cryptocurrency wallets, bank details);</li>
                  <li>Information provided by the user during verification (KYC/AML);</li>
                  <li>Technical data (IP address, browser, and device information).</li>
                </ul>
                <p>2.2. The data is collected to ensure the proper functioning of the Platform, fulfill obligations to users, and comply with legal requirements.</p>
              </div>
            </section>

            {/* 3. Data Sharing with Third Parties */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Data Sharing with Third Parties</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>3.1. The Platform does not sell or share personal data with third parties without the user's consent, except as required by law.</p>
                <p>3.2. Data may be shared with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Government authorities in accordance with legal requirements;</li>
                  <li>Partner services for payment processing and identity verification (KYC/AML);</li>
                  <li>In the event of reorganization or sale of the Platform, if necessary for continued service provision.</li>
                </ul>
              </div>
            </section>

            {/* 4. Personal Data Protection */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Personal Data Protection</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>4.1. The Platform employs modern data protection methods, including encryption and authentication.</p>
                <p>4.2. Access to personal data is granted only to authorized personnel who are required to maintain confidentiality.</p>
                <p>4.3. In case of a data breach, the Platform will notify users and take all possible measures to minimize damage.</p>
              </div>
            </section>

            {/* 5. Data Storage */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Data Storage</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>5.1. Personal data is stored no longer than necessary for processing purposes.</p>
                <p>5.2. Users may request the deletion of their data unless it conflicts with legal requirements.</p>
              </div>
            </section>

            {/* 6. User Rights */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. User Rights</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>6.1. Users have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request access to their data;</li>
                  <li>Request correction or deletion of their data;</li>
                  <li>Withdraw consent for data processing (if applicable);</li>
                  <li>File complaints with regulatory authorities in case of rights violations.</li>
                </ul>
              </div>
            </section>

            {/* 7. Contact Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Contact Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>7.1. For questions related to personal data processing, users can contact the Platform's support team via email at contact@ftsoa.art or through the feedback form.</p>
                <p>7.2. Last update date of this Policy: February 22, 2025.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(Privacy);
