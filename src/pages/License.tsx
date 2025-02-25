
import { memo } from "react";

const License = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-24">
        <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">License Agreement</h1>
              <div className="h-1 w-20 bg-primary/50 rounded-full" />
            </div>

            {/* 1. General Provisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. General Provisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>1.1. This License Agreement (hereinafter referred to as the "Agreement") governs the relationship between the platform http://ftsoa.art (hereinafter referred to as the "Platform") and users who utilize it for listing and selling digital art in NFT format.</p>
                <p>1.2. Using the Platform signifies full acceptance of the terms of this Agreement.</p>
                <p>1.3. The Platform Administration reserves the right to amend the Agreement at any time without prior notice.</p>
              </div>
            </section>

            {/* 2. License Grant */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. License Grant</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>2.1. Creators who list digital art on the Platform retain all rights to their work but grant the Platform a limited, non-exclusive, worldwide license to host, display, and sell it.</p>
                <p>2.2. Buyers acquire an NFT that confirms ownership of the digital asset but do not receive copyright to the content itself unless otherwise stipulated in a separate agreement.</p>
                <p>2.3. The creator guarantees that the uploaded content does not infringe upon the rights of third parties and does not contain illegal materials.</p>
              </div>
            </section>

            {/* 3. Restrictions and Liability */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Restrictions and Liability</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>3.1. The Platform is not responsible for the subsequent use of purchased NFTs.</p>
                <p>3.2. The Platform does not guarantee the originality, quality, or legality of the content uploaded by users.</p>
                <p>3.3. Users bear full responsibility for complying with copyright and intellectual property laws when creating and selling NFTs.</p>
              </div>
            </section>

            {/* 4. Payment Terms and Fees */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Payment Terms and Fees</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>4.1. A commission is charged for using the Platform and conducting transactions, with the amount specified in the relevant sections of the Platform.</p>
                <p>4.2. All payments on the Platform are processed through integrated payment systems that meet security requirements.</p>
                <p>4.3. The Platform is not responsible for user errors in fund transfers.</p>
              </div>
            </section>

            {/* 5. Prohibited Actions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Prohibited Actions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>5.1. Users are prohibited from:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Uploading content that infringes on third-party copyrights;</li>
                  <li>Using the Platform for fraudulent or other illegal activities;</li>
                  <li>Impersonating another person or company.</li>
                </ul>
                <p>5.2. In the event of a violation, the Platform reserves the right to block the user's account without a refund.</p>
              </div>
            </section>

            {/* 6. Dispute Resolution */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Dispute Resolution</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>6.1. All disputes between users and the Platform shall be resolved through pre-trial negotiations.</p>
                <p>6.2. If a dispute cannot be resolved amicably, it shall be subject to legal proceedings under the laws of the Kingdom of Cambodia.</p>
              </div>
            </section>

            {/* 7. Final Provisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Final Provisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>7.1. This Agreement takes effect upon acceptance by the user.</p>
                <p>7.2. If any provision of the Agreement is found to be invalid, the remaining provisions shall remain in full force and effect.</p>
                <p>7.3. All notifications and communications shall be conducted through the official communication channels of the Platform.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(License);
