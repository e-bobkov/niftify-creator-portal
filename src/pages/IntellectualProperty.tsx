
import { memo } from "react";

const IntellectualProperty = () => {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-24">
        <div className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Intellectual Property Policy</h1>
              <div className="h-1 w-20 bg-primary/50 rounded-full" />
            </div>

            {/* 1. General Provisions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. General Provisions</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>1.1. This Intellectual Property Policy (hereinafter referred to as the "Policy") governs issues related to copyright protection and other intellectual property rights on the platform http://ftsoa.art (hereinafter referred to as the "Platform").</p>
                <p>1.2. By using the Platform, users agree to comply with this Policy and not infringe upon the rights of third parties.</p>
                <p>1.3. The Platform Administration reserves the right to amend this Policy at any time without prior notice.</p>
              </div>
            </section>

            {/* 2. User Rights and Responsibilities */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. User Rights and Responsibilities</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>2.1. By uploading digital art to the Platform, creators confirm that they have all necessary rights to the content.</p>
                <p>2.2. Users agree not to upload, copy, or distribute content that infringes on copyrights, trademarks, or other third-party rights.</p>
                <p>2.3. In the event of a dispute over content ownership, the Platform reserves the right to suspend or remove the disputed material until the conflict is resolved.</p>
              </div>
            </section>

            {/* 3. Prohibited Content */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Prohibited Content</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>3.1. The following types of content are prohibited:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Content that infringes upon copyrights or trademarks of third parties;</li>
                  <li>Materials that are illegal under applicable law;</li>
                  <li>Content that includes elements obtained through unlawful means.</li>
                </ul>
                <p>3.2. The Platform reserves the right to remove any content that violates this Policy.</p>
              </div>
            </section>

            {/* 4. Filing a Copyright Infringement Complaint */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Filing a Copyright Infringement Complaint</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>4.1. If a user believes their rights have been violated, they may submit a complaint to the Platform's support team by providing:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A description of the violated right;</li>
                  <li>Proof of ownership (e.g., registration documents);</li>
                  <li>A link to the disputed content on the Platform.</li>
                </ul>
                <p>4.2. Upon receiving a complaint, the Platform will conduct an internal investigation and may take necessary measures, including removing the content and/or blocking the violator's account.</p>
              </div>
            </section>

            {/* 5. Limitation of Liability */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Limitation of Liability</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>5.1. The Platform is not responsible for user actions but takes measures to protect intellectual property rights within its capabilities.</p>
                <p>5.2. In the event of legal disputes between users, the Platform does not act as a party to the conflict but may assist by providing information in accordance with applicable laws.</p>
              </div>
            </section>

            {/* 6. Dispute Resolution */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Dispute Resolution</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>6.1. All intellectual property disputes should be resolved through negotiations between the involved parties.</p>
                <p>6.2. If a dispute cannot be resolved amicably, it shall be subject to legal proceedings in accordance with the laws of the Kingdom of Cambodia.</p>
              </div>
            </section>

            {/* 7. Contact Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Contact Information</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>7.1. Users may direct all intellectual property-related inquiries to the Platform's support team via email at contact@ftsoa.art or through the feedback form.</p>
                <p>7.2. Last update date of this Policy: February 22, 2025.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(IntellectualProperty);
