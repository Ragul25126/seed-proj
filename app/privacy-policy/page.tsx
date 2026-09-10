import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for SEED Engineering Consultants website.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">
      {/* HERO BANNER */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5 bg-[#0b0f19]">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 block">
            Legal & Compliance
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Effective Date & Terms of Service Information
          </p>
        </div>
      </section>

      {/* POLICY CONTENT BODY */}
      <section className="py-20 bg-[#0f172a] border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="bg-[#0b0f19] border border-white/10 p-8 md:p-14 rounded-sm shadow-2xl space-y-10">

            {/* HEADER INTRO */}
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6">
                Privacy Policy
              </h2>
              <div className="space-y-4 text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                <p>
                  SEED we operates the <a href="https://www.seedengineering.com/" className="text-gold hover:underline">https://www.seedengineering.com/</a> website (the “Service”).
                </p>
                <p>
                  This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                </p>
                <p>
                  We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from <a href="https://www.seedengineering.com/" className="text-gold hover:underline">https://www.seedengineering.com/</a>
                </p>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* INFORMATION COLLECTION AND USE */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Information collection and Use
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed mb-6">
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>

              <h4 className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
                TYPES OF DATA COLLECTED
              </h4>

              {/* PERSONAL DATA */}
              <div className="mb-8">
                <h5 className="text-lg font-serif font-bold text-white mb-3">
                  Personal Data
                </h5>
                <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed mb-4">
                  While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (“Personal Data”). Personally, identifiable information may include, but is not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm md:text-[15px] font-light pl-2">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Cookies and Usage Data</li>
                </ul>
              </div>

              {/* TRACKING & COOKIES DATA */}
              <div>
                <h5 className="text-lg font-serif font-bold text-white mb-3">
                  Tracking & Cookies Data
                </h5>
                <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyse our Service. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                </p>
                <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed mb-3">
                  Examples of Cookies we use:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm md:text-[15px] font-light pl-2">
                  <li>We use Session Cookies to operate our Service.</li>
                  <li>We use Preference Cookies to remember your preferences and various settings.</li>
                  <li>We use Security Cookies for security purposes.</li>
                </ul>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* USE OF DATA */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Use of Data
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed mb-4">
                SEED uses the collected data for various purposes:
              </p>
              <ul className="space-y-2 text-slate-300 text-sm md:text-[15px] font-light pl-2">
                <li>· To provide and maintain the Service</li>
                <li>· To notify you about changes to our Service</li>
                <li>· To allow you to participate in interactive features of our Service when you choose to do so</li>
                <li>· To provide analysis or valuable information so that we can improve the Service</li>
                <li>· To monitor the usage of the Service</li>
                <li>· To detect, prevent and address technical issues</li>
              </ul>
            </div>

            <hr className="border-white/5" />

            {/* TRANSFER OF DATA */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Transfer of Data
              </h3>
              <div className="space-y-4 text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                <p>
                  Your information, including Personal Data, may be transferred to and maintained on computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
                </p>
                <p>
                  If you are located outside United Arab Emirates and choose to provide information to us, please note that we transfer the data, including Personal Data, to United Arab Emirates and process it there.
                </p>
                <p>
                  Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
                </p>
                <p>
                  SEED will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organisation or a country unless there are adequate controls in place including the security of your data and other personal information.
                </p>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* DISCLOSURE OF DATA */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Disclosure of Data
              </h3>
              <h4 className="text-lg font-serif font-bold text-white mb-3">
                Legal Requirements
              </h4>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed mb-4">
                SEED may disclose your Personal Data in the good faith belief that such action is necessary to:
              </p>
              <ul className="space-y-2 text-slate-300 text-sm md:text-[15px] font-light pl-2">
                <li>· To comply with a legal obligation</li>
                <li>· To protect and defend the rights or property of SEED</li>
                <li>· To prevent or investigate possible wrongdoing in connection with the Service</li>
                <li>· To protect the personal safety of users of the Service or the public</li>
                <li>· To protect against legal liability</li>
              </ul>
            </div>

            <hr className="border-white/5" />

            {/* SECURITY OF DATA */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Security of Data
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                The security of your data is important to us but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* SERVICE PROVIDERS */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Service Providers
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                We may employ third party companies and individuals to facilitate our Service (“Service Providers”), to provide the Service on our behalf, to perform Service-related services or to assist us in analysing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </div>

            <hr className="border-white/5" />

            {/* LINKS TO OTHER SITES */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Links to other Sites
              </h3>
              <div className="space-y-4 text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                <p>
                  Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit.
                </p>
                <p>
                  We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
                </p>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* CHILDREN'S PRIVACY */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Children's Privacy
              </h3>
              <div className="space-y-4 text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                <p>
                  Our Service does not address anyone under the age of 18 (“Children”).
                </p>
                <p>
                  We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
                </p>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* CHANGE TO THIS PRIVACY POLICY */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Change to this Privacy Policy
              </h3>
              <div className="space-y-4 text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>
                <p>
                  We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the “effective date” at the top of this Privacy Policy.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes.
                </p>
                <p>
                  Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* CONTACT US */}
            <div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-4">
                Contact Us
              </h3>
              <p className="text-slate-300 text-sm md:text-[15px] font-light leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us by email: <a href="mailto:contact@seedengineering.com" className="text-gold hover:underline font-normal">contact@seedengineering.com</a>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
