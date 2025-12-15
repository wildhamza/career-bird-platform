import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollText, Shield, AlertCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-950/20 dark:via-background dark:to-gray-950/20" />

        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <FadeIn>
            <div className="mx-auto text-center space-y-4">
              <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-600 to-gray-600 items-center justify-center mb-4">
                <ScrollText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: December 15, 2025
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.2}>
            <Card className="border-2 shadow-lg mb-8">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Important Notice</h3>
                    <p className="text-muted-foreground">
                      Please read these Terms of Service carefully before using The Career Bird platform. By accessing or using our service, you agree to be bound by these terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <FadeIn delay={0.3}>
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By accessing and using The Career Bird platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  These terms apply to all visitors, users, and others who access or use the Service, including but not limited to students, professors, universities, and institutions.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.4}>
              <section>
                <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Career Bird is a platform that connects students seeking graduate education opportunities (MS and PhD programs) with professors, universities, and scholarship programs worldwide. Our services include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Scholarship and opportunity listings</li>
                  <li>Application tracking and management</li>
                  <li>Profile creation and verification</li>
                  <li>Communication tools between students and institutions</li>
                  <li>AI-powered matching and recommendations</li>
                  <li>Educational resources and guidance</li>
                </ul>
              </section>
            </FadeIn>

            <FadeIn delay={0.5}>
              <section>
                <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Account Creation</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                
                <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Account Security</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party and to notify us immediately of any unauthorized use of your account.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Account Types</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong>Student Accounts:</strong> For individuals seeking graduate education opportunities</li>
                  <li><strong>Professor Accounts:</strong> For academic professionals posting research positions</li>
                  <li><strong>University Accounts:</strong> For institutions managing scholarship programs</li>
                </ul>
              </section>
            </FadeIn>

            <FadeIn delay={0.6}>
              <section>
                <h2 className="text-2xl font-bold mb-4">4. User Conduct and Responsibilities</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Post false, inaccurate, misleading, or fraudulent information</li>
                  <li>Impersonate any person or entity</li>
                  <li>Harass, abuse, or harm another person</li>
                  <li>Transmit any viruses, malware, or other malicious code</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Collect or harvest any personally identifiable information</li>
                  <li>Use automated systems to access the Service without permission</li>
                  <li>Sell or transfer your account to another party</li>
                </ul>
              </section>
            </FadeIn>

            <FadeIn delay={0.7}>
              <section>
                <h2 className="text-2xl font-bold mb-4">5. Content and Intellectual Property</h2>
                <h3 className="text-xl font-semibold mb-3 mt-6">5.1 User Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You retain ownership of any content you post on the Service ("User Content"). By posting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content in connection with the Service.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Platform Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Service and its original content (excluding User Content), features, and functionality are owned by The Career Bird and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Prohibited Content</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may not post content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of privacy, hateful, or racially or ethnically objectionable.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.8}>
              <section>
                <h2 className="text-2xl font-bold mb-4">6. Payment and Subscriptions</h2>
                <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Fees</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Certain features of the Service may require payment of fees. You agree to pay all fees associated with your use of paid features. All fees are non-refundable unless otherwise stated.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Billing</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For subscription services, you will be billed in advance on a recurring basis (monthly or annually, as applicable). Your subscription will automatically renew unless you cancel it before the renewal date.
                </p>

                <h3 className="text-xl font-semibold mb-3 mt-6">6.3 Cancellation</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may cancel your subscription at any time through your account settings. Cancellation will be effective at the end of the current billing period.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={0.9}>
              <section>
                <h2 className="text-2xl font-bold mb-4">7. Verification and Accuracy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  While we strive to verify academic credentials and scholarship listings, we cannot guarantee the accuracy or completeness of all information on the platform. Users are responsible for conducting their own due diligence before applying to programs or accepting positions.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to verify any information provided by users and may suspend or terminate accounts that provide false or misleading information.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.0}>
              <section>
                <h2 className="text-2xl font-bold mb-4">8. Privacy and Data Protection</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you agree to our collection and use of information as described in the Privacy Policy.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                    Read our Privacy Policy
                  </Link>
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.1}>
              <section>
                <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We do not warrant that the Service will be uninterrupted, timely, secure, or error-free. We make no guarantees regarding the results that may be obtained from the use of the Service or the accuracy or reliability of any information obtained through the Service.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.2}>
              <section>
                <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE CAREER BIRD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our total liability to you for any claims arising from or related to the Service shall not exceed the amount you have paid to us in the twelve (12) months prior to the claim, or $100, whichever is greater.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.3}>
              <section>
                <h2 className="text-2xl font-bold mb-4">11. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify, defend, and hold harmless The Career Bird, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the Service, your User Content, or your violation of these Terms.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.4}>
              <section>
                <h2 className="text-2xl font-bold mb-4">12. Termination</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Upon termination, your right to use the Service will immediately cease. All provisions of the Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.5}>
              <section>
                <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which The Career Bird is registered, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of that jurisdiction.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.6}>
              <section>
                <h2 className="text-2xl font-bold mb-4">14. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By continuing to access or use the Service after revisions become effective, you agree to be bound by the revised terms.
                </p>
              </section>
            </FadeIn>

            <FadeIn delay={1.7}>
              <section>
                <h2 className="text-2xl font-bold mb-4">15. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <Card className="bg-muted/50 border-2">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="font-semibold">The Career Bird</p>
                      <p className="text-muted-foreground">Email: legal@thecareerbird.com</p>
                      <p className="text-muted-foreground">Support: support@thecareerbird.com</p>
                      <p className="text-muted-foreground">
                        <Link href="/contact" className="text-blue-600 hover:underline">
                          Contact Form
                        </Link>
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Questions About Our Terms?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you understand our policies and answer any questions.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Contact Support
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
