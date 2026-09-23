import { Suspense } from "react";
import Header from "../components/Header";

export const metadata = {
  title: "Privacy Policy — WENS Force",
  description:
    "Privacy policy for subscription.wensforce.com, operated by WENS Force International Private Limited.",
};

const TOC = [
  { id: "information-we-collect", label: "Information we collect" },
  { id: "how-we-collect", label: "How we collect it" },
  { id: "use-of-information", label: "Use of your information" },
  { id: "sharing", label: "Sharing with third parties" },
  { id: "email-opt-out", label: "Email opt-out" },
  { id: "third-party-sites", label: "Third party sites" },
  { id: "empanelment", label: "Empanelment policy" },
  { id: "grievance-officer", label: "Grievance officer" },
  { id: "updates", label: "Updates" },
  { id: "jurisdiction", label: "Jurisdiction" },
];

const COLLECTED = [
  {
    title: "Contact information.",
    body: "We might collect your name, email, mobile number, phone number, street, city, state, pincode, country and ip address.",
  },
  {
    title: "Payment and billing information.",
    body: "We might collect your billing name, billing address and payment method when you buy a ticket. We NEVER collect your credit card number or credit card expiry date or other details pertaining to your credit card on our website. Credit card information will be obtained and processed by our online payment partner CC Avenue.",
  },
  {
    title: "Information you post.",
    body: "We collect information you post in a public space on our website or on a third-party social media site belonging to subscription.wensforce.com.",
  },
  {
    title: "Demographic information.",
    body: "We may collect demographic information about you, events you like, events you intend to participate in, tickets you buy, or any other information provided by your during the use of our website. We might collect this as a part of a survey also.",
  },
  {
    title: "Other information.",
    body: "If you use our website, we may collect information about your IP address and the browser you’re using. We might look at what site you came from, duration of time spent on our website, pages accessed or what site you visit when you leave us. We might also collect the type of mobile device you are using, or the version of the operating system your computer or device is running.",
  },
];

const COLLECTION_METHODS = [
  {
    title: "We collect information directly from you.",
    body: "We collect information directly from you when you register for an event or buy tickets. We also collect information if you post a comment on our websites or ask us a question through phone or email.",
  },
  {
    title: "We collect information from you passively.",
    body: "We use tracking tools like Google Analytics, Google Webmaster, browser cookies and web beacons for collecting information about your usage of our website.",
  },
  {
    title: "We get information about you from third parties.",
    body: "For example, if you use an integrated social media feature on our websites. The third-party social media site will give us certain information about you. This could include your name and email address.",
  },
];

const USES = [
  {
    title: "We use information to contact you:",
    body: "We might use the information you provide to contact you for confirmation of a purchase on our website or for other promotional purposes.",
  },
  {
    title: "We use information to respond to your requests or questions.",
    body: "We might use your information to confirm your registration for an event or contest.",
  },
  {
    title: "We use information to improve our products and services.",
    body: "We might use your information to customize your experience with us. This could include displaying content based upon your preferences.",
  },
  {
    title: "We use information to look at site trends and customer interests.",
    body: "We may use your information to make our website and products better. We may combine information we get from you with information about you we get from third parties.",
  },
  {
    title: "We use information for security purposes.",
    body: "We may use information to protect our company, our customers, or our websites.",
  },
  {
    title: "We use information for marketing purposes.",
    body: "We might send you information about special promotions or offers. We might also tell you about new features or products. These might be our own offers or products, or third-party offers or products we think you might find interesting. Or, for example, if you buy tickets from us we’ll enroll you in our newsletter.",
  },
  {
    title: "We use information to send you transactional communications.",
    body: "We might send you emails or SMS about your account or a ticket purchase.",
  },
];

const SHARING = [
  {
    title: "We will share information with third parties who perform services on our behalf.",
    body: "We share information with vendors who help us manage our online registration process or payment processors or transactional message processors. Some vendors may be located outside of India.",
  },
  {
    title: "We will share information with the event organizers.",
    body: "We share your information with event organizers and other parties responsible for fulfilling the purchase obligation. The event organizers and other parties may use the information we give them as described in their privacy policies.",
  },
  {
    title: "We will share information with our business partners.",
    body: "This includes a third party who provide or sponsor an event, or who operates a venue where we hold events. Our partners use the information we give them as described in their privacy policies.",
  },
  {
    title: "We may share information if we think we have to in order to comply with the law or to protect ourselves.",
    body: "We will share information to respond to a court order or subpoena. We may also share it if a government agency or investigatory body requests. Or, we might also share information when we are investigating potential fraud.",
  },
  {
    title: "We may share information with any successor to all or part of our business.",
    body: "For example, if part of our business is sold we may give our customer list as part of that transaction.",
  },
  {
    title: "We may share your information for reasons not described in this policy.",
    body: "We will tell you before we do this.",
  },
];

const FILE_REQUIREMENTS = [
  [
    "Character and antecedent verification",
    "Verification in the prescribed form, routed through the District Superintendent of Police or the Deputy Commissioner of Police in charge of the Zone in a Commissionerate area",
    "Statutory eligibility",
  ],
  [
    "Security training certificate",
    "Certificate from a recognised training institute, conforming to National Skill Qualification Framework standards",
    "Statutory eligibility",
  ],
  [
    "Identity verification (KYC)",
    "Aadhaar and PAN, verified electronically",
    "Establishes that verification relates to you",
  ],
  [
    "Universal Account Number (UAN)",
    "Existing UAN, or details enabling us to generate one for you",
    "Provident fund credit",
  ],
  [
    "Insured Person number",
    "Existing ESIC number, or details enabling registration",
    "Medical and sickness benefit",
  ],
  [
    "Bank account verification",
    "Account verified by penny-drop confirmation",
    "All wages are paid by bank transfer only",
  ],
];

const WAGE_ITEMS = [
  [
    "Wages",
    "WENS Force",
    "Paid by bank transfer to your verified account only. No cash payment is made in any circumstances",
  ],
  [
    "Provident fund — employee share",
    "You, by deduction",
    "Credited to your UAN, which follows you across all employers for life",
  ],
  [
    "Provident fund — employer share",
    "WENS Force",
    "Credited to your UAN",
  ],
  [
    "Employees’ state insurance — employee share",
    "You, by deduction",
    "Entitles you and your dependants to medical benefit",
  ],
  [
    "Employees’ state insurance — employer share",
    "WENS Force",
    "Remitted with the employee share",
  ],
  [
    "Payslip",
    "WENS Force",
    "Issued digitally for every assignment, itemising wages, deductions and contributions",
  ],
];

function SectionHeading({ id, children }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 font-serif-display text-[1.65rem] leading-tight text-[#0B1E3F] pb-3 mb-6 border-b border-[#E7DFD0]"
    >
      {children}
    </h2>
  );
}

function Points({ items, trailing }) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <div
          key={item.title}
          className="py-5 border-b border-[#F0EBE1] last:border-b-0"
        >
          <h3 className="text-[15px] font-semibold text-[#0B1E3F] mb-1.5">
            {item.title}
          </h3>
          <p className="text-[15px] leading-7 text-[#4A5568]">{item.body}</p>
        </div>
      ))}
      {trailing ? (
        <p className="pt-5 text-[15px] leading-7 text-[#4A5568]">{trailing}</p>
      ) : null}
    </div>
  );
}

function PolicyTable({ headers, rows }) {
  return (
    <div className="my-5">
      <div className="hidden md:block overflow-hidden rounded-xl border border-[#E6DFD0]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#0B1E3F] text-white">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 font-semibold align-bottom text-[13px] tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row[0]}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#FBF8F2]"}
              >
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${index}`}
                    className={`px-4 py-3.5 align-top leading-6 text-[#3D4A5C] ${
                      index === 0 ? "font-medium text-[#0B1E3F] w-[28%]" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row[0]}
            className="rounded-xl border border-[#E6DFD0] bg-[#FBF8F2] p-4"
          >
            {headers.map((header, index) => (
              <div key={header} className={index === 0 ? "" : "mt-3"}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A08030]">
                  {header}
                </p>
                <p
                  className={`mt-1 text-sm leading-6 ${
                    index === 0
                      ? "font-semibold text-[#0B1E3F]"
                      : "text-[#3D4A5C]"
                  }`}
                >
                  {row[index]}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Clause({ number, title, children, caution = false }) {
  return (
    <article
      className={`flex gap-4 sm:gap-5 py-7 border-b border-[#F0EBE1] last:border-b-0 ${
        caution ? "bg-[#FBF6EA] -mx-5 sm:-mx-8 px-5 sm:px-8 rounded-2xl border border-[#E8D7A8]" : ""
      }`}
    >
      <span className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-[#0B1E3F] text-[#C9A24B] text-xs font-bold flex items-center justify-center">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif-display text-xl text-[#0B1E3F] mb-3">
          {title}
        </h3>
        <div className="flex flex-col gap-3 text-[15px] leading-7 text-[#4A5568]">
          {children}
        </div>
      </div>
    </article>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1A202C]">
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <header className="rounded-3xl bg-[#0B1E3F] text-white px-6 py-10 sm:px-10 sm:py-12 mb-8 relative">
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div
                className="absolute -top-16 -right-10 w-64 h-64"
                style={{
                  background:
                    "radial-gradient(circle, rgba(201,162,75,0.28) 0%, transparent 70%)",
                }}
              />
            </div>
            <p className="relative text-[11px] font-semibold tracking-[0.42em] uppercase text-[#C9A24B] mb-4">
              WENS Force
            </p>
            <h1 className="relative font-serif-display text-[1.7rem] leading-snug sm:text-4xl sm:leading-tight max-w-3xl [overflow-wrap:anywhere]">
              This Privacy Policy applies to the subscription.wensforce.com
            </h1>
            <p className="relative mt-4 text-sm text-white/70">
              Last updated 02.09.2026
            </p>
          </header>

          <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8 items-start">
            <nav className="mb-6 lg:mb-0 lg:sticky lg:top-24">
              <p className="hidden lg:block text-[11px] font-semibold tracking-[0.18em] uppercase text-[#A08030] mb-3">
                On this page
              </p>
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0">
                {TOC.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="shrink-0 rounded-full lg:rounded-lg border border-[#E6DFD0] bg-white px-3 py-2 text-[13px] text-[#3D4A5C] hover:border-[#C9A24B] hover:text-[#0B1E3F] transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>

            <article className="min-w-0 bg-white rounded-3xl border border-[#E6DFD0] shadow-[0_12px_40px_rgba(11,30,63,0.05)] px-5 py-8 sm:px-8 sm:py-10 [overflow-wrap:anywhere]">
              <div className="flex flex-col gap-4 text-[15px] leading-7 text-[#4A5568] mb-10">
                <p>
                  subscription.wensforce.com recognizes the importance of
                  maintaining your privacy. We value your privacy and appreciate
                  your trust in us. This Policy describes how we treat user
                  information we collect on https://subscription.wensforce.com
                  and other offline sources. This Privacy Policy applies to
                  current and former visitors to our website and to our online
                  customers. By visiting and/or using our website, you agree to
                  this Privacy Policy.
                </p>
                <p>
                  subscription.wensforce.com is a property of WENS Force
                  International Private Limited, an Indian Company registered
                  under the Companies Act, 2013 having its registered office at
                  89 2 FLR 136/148 EMPIRE BUILDING, Mumbai GPO, Mumbai,
                  Maharashtra INDIA. 400001
                </p>
              </div>

              <section className="mb-12">
                <SectionHeading id="information-we-collect">
                  Information we collect
                </SectionHeading>
                <Points items={COLLECTED} />
              </section>

              <section className="mb-12">
                <SectionHeading id="how-we-collect">
                  We collect information in different ways.
                </SectionHeading>
                <Points items={COLLECTION_METHODS} />
              </section>

              <section className="mb-12">
                <SectionHeading id="use-of-information">
                  Use of your personal information
                </SectionHeading>
                <Points
                  items={USES}
                  trailing="We use information as otherwise permitted by law."
                />
              </section>

              <section className="mb-12">
                <SectionHeading id="sharing">
                  Sharing of information with third-parties
                </SectionHeading>
                <Points items={SHARING} />
              </section>

              <section className="mb-12">
                <SectionHeading id="email-opt-out">Email Opt-Out</SectionHeading>
                <h3 className="text-[15px] font-semibold text-[#0B1E3F] mb-1.5">
                  You can opt out of receiving our marketing emails.
                </h3>
                <p className="text-[15px] leading-7 text-[#4A5568]">
                  To stop receiving our promotional emails, please email{" "}
                  <a
                    href="mailto:unsubscriber@subscription.wensforce.com"
                    className="text-[#0B1E3F] underline decoration-[#C9A24B] underline-offset-2"
                  >
                    unsubscriber@subscription.wensforce.com
                  </a>
                  . It may take about ten days to process your request. Even if
                  you opt out of getting marketing messages, we will still be
                  sending you transactional messages through email and SMS about
                  your purchases.
                </p>
              </section>

              <section className="mb-12">
                <SectionHeading id="third-party-sites">
                  Third party sites
                </SectionHeading>
                <p className="text-[15px] leading-7 text-[#4A5568]">
                  If you click on one of the links to third party websites, you
                  may be taken to websites we do not control. This policy does
                  not apply to the privacy practices of those websites. Read the
                  privacy policy of other websites carefully. We are not
                  responsible for these third party sites.
                </p>
              </section>

              <section className="mb-4">
                <SectionHeading id="empanelment">
                  Empanelment Policy for Independent Service Partners
                </SectionHeading>

                <Clause number="1" title="What empanelment means">
                  <p>
                    WENS Force International Private Limited maintains a panel
                    of trained and verified security operatives who are
                    available for assignment as and when required. Being
                    empanelled means you are listed on that panel and may be
                    offered assignments.
                  </p>
                  <p>
                    Empanelment by itself does not create employment, does not
                    guarantee that any assignment will be offered to you, and
                    does not oblige you to accept any assignment that is
                    offered. You remain free to work for any other agency or
                    client at any time. Employment arises only when you accept a
                    specific assignment, as set out in clause 5.
                  </p>
                </Clause>

                <Clause number="2" title="Who we may empanel">
                  <p>
                    As a PSARA-licensed agency we may engage a person for
                    security work only where that person is a citizen of India,
                    is aged between eighteen and sixty-five years, has
                    successfully completed the prescribed security training,
                    meets the prescribed physical standards, and has satisfied
                    us as to character and antecedents in the manner prescribed
                    under the applicable rules.
                  </p>
                  <p>
                    A person who has been convicted by a competent court, or who
                    has been dismissed or removed on grounds of misconduct or
                    moral turpitude from any armed force, police organisation,
                    government service or private security agency, is not
                    eligible for empanelment in any circumstances.
                  </p>
                </Clause>

                <Clause number="3" title="What you must place on file">
                  <p>
                    The following must be complete and current before you can be
                    assigned to work:
                  </p>
                  <PolicyTable
                    headers={["Requirement", "What is accepted", "Purpose"]}
                    rows={FILE_REQUIREMENTS}
                  />
                  <p>
                    You authorise WENS Force to verify each of these directly
                    with the issuing authority and to commission background
                    checks at our own cost. We do not ask you to bear the cost
                    of your own verification.
                  </p>
                </Clause>

                <Clause number="4" title="The thirty-day window">
                  <p>
                    On registration you are placed on Provisional status. You
                    have thirty days from registration to complete identity
                    verification and to place a valid character and antecedent
                    verification and a valid training certificate on file. We
                    will remind you on day one, day fifteen and day
                    twenty-five.
                  </p>
                  <p>
                    If your file is not complete by day thirty, your empanelment
                    lapses automatically and without further notice, and you
                    will not be eligible for assignments until it is completed.
                    Provisional status permits limited categories of assignment
                    only, at our sole discretion.
                  </p>
                  <p>
                    Lapse of empanelment for want of documentation is not a
                    disciplinary action and carries no adverse finding against
                    you. Your file may be reactivated at any time by completing
                    the outstanding requirements.
                  </p>
                </Clause>

                <Clause
                  number="5"
                  title="Your employment status — please read this clause carefully"
                  caution
                >
                  <p>
                    Each assignment you accept creates a fixed-term contract of
                    employment between you and WENS Force International Private
                    Limited for the stated duration of that assignment, and for
                    that duration only. This is so whether the assignment is for
                    one hour, one shift, one week or one month.
                  </p>
                  <p>
                    For the duration of each assignment you are a contractual
                    employee of WENS Force. You are entitled to wages at not
                    less than the applicable statutory minimum rate, and
                    provident fund and employees’ state insurance contributions
                    are made in respect of every assignment, on every payout,
                    without any minimum duration threshold.
                  </p>
                  <p>
                    Between assignments there is no subsisting contract of
                    employment, no salary, no retainer and no continuing
                    obligation on either side. Empanelment is a listing, not a
                    contract of service. We are not obliged to offer you
                    assignments and you are not obliged to accept them.
                  </p>
                  <p>
                    You are not a permanent employee of WENS Force, and no
                    assignment or series of assignments confers permanency. The
                    expiry of a fixed-term assignment on its stated end date is
                    not termination or retrenchment.
                  </p>
                </Clause>

                <Clause number="6" title="Wages and statutory contributions">
                  <p>
                    For each assignment you will be told, before you accept, the
                    wage payable, the statutory deductions that will be made,
                    and the net amount you will receive. Deductions and
                    contributions are handled as follows:
                  </p>
                  <PolicyTable
                    headers={["Item", "Borne by", "Treatment"]}
                    rows={WAGE_ITEMS}
                  />
                  <p>
                    Contributions are made in respect of every assignment
                    however short. Nothing is paid in cash and nothing is paid
                    off the books.
                  </p>
                </Clause>

                <Clause
                  number="7"
                  title="Each assignment is separate and self-contained"
                >
                  <p>
                    You act for WENS Force only during an assignment issued to
                    you in writing through a numbered Deployment Order. That
                    Deployment Order also serves as your statutory appointment
                    letter for the assignment and records the client, the site,
                    the duration, the wage and the statutory deductions
                    applicable.
                  </p>
                  <p>
                    Outside the period stated in the Deployment Order you have
                    no authority to represent WENS Force, to hold yourself out
                    as connected with us, or to accept any work in our name.
                  </p>
                </Clause>

                <Clause
                  number="8"
                  title="Your digital identity card expires with the assignment"
                >
                  <p>
                    Each Deployment Order issues a digital identity card
                    carrying a QR code that encodes your verified identity, the
                    client, the site and the exact period of validity. The QR
                    code becomes invalid automatically at the end of the
                    assignment period.
                  </p>
                  <p>
                    Any person may scan the code to confirm whether you are on
                    active authorised duty for WENS Force at that moment. Using,
                    displaying or permitting the use of an expired credential is
                    a serious breach and may amount to impersonation.
                  </p>
                </Clause>

                <Clause
                  number="9"
                  title="Uniform, badge and accessories remain our property"
                >
                  <p>
                    Uniform, badge, identity card, communication equipment and
                    any other item issued to you remains the property of WENS
                    Force International Private Limited at all times.
                  </p>
                  <p>
                    It is issued solely for the assignment, must be returned on
                    completion or on demand, and must not be worn, carried or
                    displayed at any other time or for any other work.
                  </p>
                  <p>
                    Wearing WENS Force uniform or insignia outside an active
                    Deployment Order is prohibited absolutely. You must not wear
                    any uniform or insignia that resembles those of the police
                    or the armed forces.
                  </p>
                </Clause>

                <Clause
                  number="10"
                  title="You must tell us immediately if your position changes"
                >
                  <p>
                    You must notify us in writing within twenty-four hours if
                    you are arrested, named in any First Information Report,
                    summoned by any court, convicted of any offence, or if your
                    training certificate or character and antecedent
                    verification lapses, expires or is withdrawn.
                  </p>
                  <p>
                    This obligation applies at all times while you remain
                    empanelled, including between assignments. Prompt disclosure
                    will not by itself result in removal from the panel.
                    Concealment will.
                  </p>
                </Clause>

                <Clause number="11" title="Suspension and removal from the panel">
                  <p>
                    We may suspend you from the panel or remove you from it
                    where any statement you have made is found to be false,
                    where your statutory eligibility lapses, where you breach
                    this policy, or where in our reasonable judgement your
                    continued listing is inconsistent with our obligations to
                    our clients or under our licence.
                  </p>
                  <p>
                    Removal from the panel means you will not be offered further
                    assignments. It does not terminate any assignment already in
                    progress, which will run to its stated end date unless
                    separately terminated for cause in accordance with the
                    applicable law.
                  </p>
                  <p>
                    If you consider that you have been removed unfairly you may
                    raise the matter through the grievance procedure notified
                    with this policy, and we will respond to you in writing.
                  </p>
                </Clause>

                <Clause number="12" title="Your personal data">
                  <p>
                    We collect and process your identity, verification,
                    employment and assignment data in order to establish your
                    eligibility under the Private Security Agencies (Regulation)
                    Act 2005, to discharge our statutory obligations relating to
                    wages and social security, to issue and validate assignment
                    credentials, and to meet our obligations to our clients.
                  </p>
                  <p>
                    The categories of data we collect, the purposes for which we
                    process them, the periods for which we retain them, and the
                    manner in which you may withdraw consent or make a
                    complaint, are set out in our Privacy Notice, which is
                    published alongside this policy and forms part of it.
                  </p>
                </Clause>
              </section>

              <section className="mt-12 mb-12">
                <SectionHeading id="grievance-officer">
                  Grievance Officer
                </SectionHeading>
                <p className="text-[15px] leading-7 text-[#4A5568] mb-5">
                  In accordance with Information Technology Act 2000 and rules
                  made there under, the name and contact details of the
                  Grievance Officer are provided below:
                </p>
                <div className="rounded-2xl border border-[#E6DFD0] bg-[#FBF8F2] p-5 sm:p-6">
                  <p className="font-serif-display text-2xl text-[#0B1E3F]">
                    Ms. Kamini Bomble
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row sm:gap-8 gap-2 text-[15px]">
                    <p>
                      <span className="text-[#A08030] text-xs font-semibold tracking-wide uppercase block mb-1">
                        Phone
                      </span>
                      <a
                        href="tel:+918652078229"
                        className="text-[#0B1E3F] underline decoration-[#C9A24B] underline-offset-2"
                      >
                        +91-8652078229
                      </a>
                    </p>
                    <p>
                      <span className="text-[#A08030] text-xs font-semibold tracking-wide uppercase block mb-1">
                        Email
                      </span>
                      <a
                        href="mailto:wensforce@gmail.com"
                        className="text-[#0B1E3F] underline decoration-[#C9A24B] underline-offset-2"
                      >
                        wensforce@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-[15px] leading-7 text-[#4A5568]">
                  If you have any questions about this Policy or other privacy
                  concerns, you can also email us at{" "}
                  <a
                    href="mailto:hr@subscription.wensforce.com"
                    className="text-[#0B1E3F] underline decoration-[#C9A24B] underline-offset-2"
                  >
                    hr@subscription.wensforce.com
                  </a>
                </p>
              </section>

              <section className="mb-12">
                <SectionHeading id="updates">Updates to this policy</SectionHeading>
                <p className="text-[15px] leading-7 text-[#4A5568]">
                  This Privacy Policy was last updated on 02.09.2026. From time
                  to time we may change our privacy practices. We will notify
                  you of any material changes to this policy as required by law.
                  We will also post an updated copy on our website. Please check
                  our site periodically for updates.
                </p>
              </section>

              <section>
                <SectionHeading id="jurisdiction">Jurisdiction</SectionHeading>
                <p className="text-[15px] leading-7 text-[#4A5568]">
                  If you choose to visit the website, your visit and any dispute
                  over privacy is subject to this Policy and the website’s terms
                  of use. In addition to the foregoing, any disputes arising
                  under this Policy shall be governed by the laws of India under
                  Mumbai Jurisdiction only.
                </p>
              </section>
            </article>
          </div>

          <p className="text-center text-xs text-[#8A8172] mt-8">
            Copyright © 2025 | WENS Force International Private Limited | All
            rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
