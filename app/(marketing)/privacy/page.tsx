import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-background dark:to-emerald-950/20" />

        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <FadeIn>
            <div className="mx-auto text-center space-y-4">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: December 15, 2025
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-12">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.2}>
            <Card className="border-2 shadow-lg mb-8">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-4">Our Commitment to Your Privacy</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  At The Career Bird, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Lock className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Secure</h3>
                      <p className="text-xs text-muted-foreground">Industry-standard encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Eye className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Transparent</h3>
                      <p className="text-xs text-muted-foreground">Clear data practices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <UserCheck className="h-6 w-6 text-purple-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Your Control</h3>
                      <p className="text-xs text-muted-foreground">Manage your data anytime</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <FadeIn delay={0.3}>
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">1.1 Information You Provide</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Register for an account</li>
                  <li>Create or update your profile</li>
                  <li>Apply to scholarships or positions</li>
                  <li>Communicate with other users or support</li>
                  <li>Participate in surveys or promotions</li>
                  <li>Subscribe to our newsletter</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This information may include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Personal identifiers: name, email address, phone number</li>
                  <li>Academic information: education history, test scores, transcripts</li>
                  <li>Professional information: research interests, publications, CV</li>
                  <li>Account credentials: username, password</li>
                  <li>Payment information: billing address, payment method details</li>
                  <li>Communications: messages, feedback, support requests</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">1.2 Automatically Collected Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you access our Service, we automatically collect certain information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Device information: IP address, browser type, operating system</li>
                  <li>Usage data: pages visited, time spent, click patterns</li>
                  <li>Location data: approximate geographic location based on IP</li>
                  <li>Cookies and tracking technologies: preferences, session data</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">1.3 Information from Third Parties</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may receive information about you from third parties, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Universities and institutions you interact with</li>
                  <li>Academic verification services</li>
                  <li>Social media platforms (if you connect your accounts)</li>
                  <li>Payment processors</li>
                  <li>Analytics providers</li>
                </ul>
              </section>
            </FadeIn>

            <FadeIn delay={0.4}>
              <section>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the collected information for various purposes:
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Service Provision</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Create and manage your account</li>
                  <li>Process your scholarship applications</li>
                  <li>Facilitate communication between users</li>
                  <li>Provide customer support</li>
                  <li>Process payments and transactions</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Service Improvement</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Analyze usage patterns to improve functionality</li>
                  <li>Develop new features and services</li>
                  <li>Conduct research and analytics</li>
                  <li>Test and troubleshoot issues</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Personalization</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide personalized scholarship recommendations</li>
                  <li>Customize your user experience</li>
                  <li>Send relevant notifications and updates</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.4 Communication</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Send administrative information and updates</li>
                  <li>Respond to your inquiries and support requests</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Notify you of important changes or opportunities</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">2.5 Security and Compliance</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Detect and prevent fraud, abuse, and security incidents</li>
                  <li>Verify identities and credentials</li>
                  <li>Comply with legal obligations</li>
                  <li>Enforce our terms and policies</li>
                </ul>
              </section>
            </FadeIn>

            <FadeIn delay={0.5}>
              <section>
                <h2 className="text-2xl font-bold mb-4">3. How We Share Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.1 With Your Consent</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We share your profile and application information with universities, professors, and institutions when you apply to their programs or positions.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Service Providers</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We work with third-party service providers who perform services on our behalf:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Cloud hosting and storage providers</li>
                  <li>Payment processors</li>
                  <li>Email and communication services</li>
                  <li>Analytics and data analysis tools</li>
                  <li>Customer support platforms</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Business Transfers</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.4 Legal Requirements</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may disclose your information if required by law or in response to valid legal requests, such as:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Court orders or subpoenas</li>
                  <li>Government or regulatory investigations</li>
                  <li>Protection of our rights and property</li>
                  <li>Protection of user safety</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.5 Aggregated Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may share aggregated, anonymized data that does not identify you personally for research, marketing, or other purposes.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.6}>
              <section>
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security assessments and audits</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.7}>
              <section>
                <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have certain rights regarding your personal information:
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Access and Portability</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to access your personal information and request a copy of your data in a portable format.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Correction</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can update or correct your personal information through your account settings or by contacting us.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Deletion</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may request deletion of your personal information, subject to certain exceptions (e.g., legal requirements, pending transactions).
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">5.4 Marketing Communications</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can opt out of marketing emails by clicking the unsubscribe link in any email or updating your communication preferences.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">5.5 Cookies</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can control cookies through your browser settings. Note that disabling cookies may affect your ability to use certain features.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.8}>
              <section>
                <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Maintain business records</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  When we no longer need your information, we will securely delete or anonymize it in accordance with our data retention policies.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.9}>
              <section>
                <h2 className="text-2xl font-bold mb-4">7. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We take appropriate safeguards to ensure your information receives adequate protection, including using standard contractual clauses approved by regulatory authorities.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.0}>
              <section>
                <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Service is not intended for individuals under the age of 16. We do not knowingly collect personal information from children under 16.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If we become aware that we have collected personal information from a child under 16, we will take steps to delete such information promptly.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.1}>
              <section>
                <h2 className="text-2xl font-bold mb-4">9. Third-Party Links</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We encourage you to read the privacy policies of any third-party sites you visit.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.2}>
              <section>
                <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Posting the new Privacy Policy on this page</li>
                  <li>Updating the "Last updated" date</li>
                  <li>Sending you an email notification (for significant changes)</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Your continued use of the Service after changes become effective constitutes acceptance of the revised policy.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.3}>
              <section>
                <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <Card className="bg-muted/50 border-2">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold mb-2">Data Protection Officer</p>
                        <p className="text-muted-foreground">The Career Bird</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Email: privacy@thecareerbird.com</p>
                        <p className="text-muted-foreground">Data Subject Requests: dpo@thecareerbird.com</p>
                        <p className="text-muted-foreground">General Support: support@thecareerbird.com</p>
                      </div>
                      <div>
                        <Link href="/contact" className="text-blue-600 hover:underline font-medium">
                          Submit a Privacy Request
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </FadeIn>

            <FadeIn delay={1.4}>
              <section>
                <h2 className="text-2xl font-bold mb-4">12. Regional Privacy Rights</h2>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">12.1 European Economic Area (EEA) & UK</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you are located in the EEA or UK, you have additional rights under GDPR, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Right to object to processing</li>
                  <li>Right to restrict processing</li>
                  <li>Right to lodge a complaint with a supervisory authority</li>
                  <li>Right to withdraw consent at any time</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 mt-6">12.2 California Residents</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  California residents have additional rights under the California Consumer Privacy Act (CCPA), including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to know if personal information is sold or disclosed</li>
                  <li>Right to opt-out of the sale of personal information</li>
                  <li>Right to non-discrimination for exercising CCPA rights</li>
                </ul>
              </section>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-muted/30">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 shadow-lg">
            <CardContent className="p-8 text-center">
              <Database className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Your Data, Your Rights</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                We believe in transparency and giving you control over your personal information. Have questions or want to exercise your privacy rights?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Contact Privacy Team
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center justify-center rounded-md border-2 px-6 py-3 text-sm font-medium hover:bg-muted transition-all"
                >
                  View Terms of Service
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
