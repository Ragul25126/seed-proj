import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/sections/PageHero';
import FAQClient, { FAQCategory } from './FAQClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ)',
  description:
    'Find clear answers to common questions about SEED Engineering’s MEP consultancy, swimming pool engineering, project sectors, fee proposals, and appointment process.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions (FAQ) — SEED Engineering',
    description:
      'Find clear answers to common questions about SEED Engineering’s MEP consultancy, swimming pool engineering, project sectors, fee proposals, and appointment process.',
    url: 'https://seedengineering.ae/faq',
    siteName: 'SEED Engineering',
    locale: 'en_AE',
    type: 'website',
  },
};

const FAQ_DATA: FAQCategory[] = [
  {
    id: 'about-seed',
    name: 'About SEED Engineering',
    description: 'Background, corporate leadership, regional offices, and practice philosophy.',
    items: [
      {
        id: 'about-1',
        question: 'What is SEED Engineering, and when was the firm established?',
        answer: (
          <p>
            SEED Engineering is an integrated building engineering consultancy founded in 2005. The firm delivers mechanical, electrical, and public health (MEP) design, site supervision, digital engineering (BIM), sustainability consulting, and commissioning verification for complex developments across the Middle East, Africa, India, and Southeast Asia.
          </p>
        ),
      },
      {
        id: 'about-2',
        question: 'Where is SEED Engineering headquartered and where are your offices located?',
        answer: (
          <p>
            Our global headquarters and primary design hub is located in Dubai, United Arab Emirates (Office #303, Old Commercial Bank of Dubai Building, Deira). In addition to our Dubai headquarters, we maintain a regional hub in Singapore for Southeast Asia, alongside digital delivery and engineering design offices across India in Mumbai, Kochi, Bengaluru, Gurugram, and Pune. Full location addresses and office contact details can be found on our{' '}
            <Link href="/contact" className="text-gold underline hover:text-white transition-colors">
              Contact page
            </Link>
            .
          </p>
        ),
      },
      {
        id: 'about-3',
        question: 'What is SEED Engineering’s approach to building performance?',
        answer: (
          <p>
            We operate on the principle that engineering responsibility does not end with design drawings. Our principal engineers remain personally involved throughout the project lifecycle—from concept design and thermal calculations to site supervision, clash-free BIM coordination, and hands-on commissioning verification. We focus on measurable building performance, energy efficiency, and long-term client relationships.
          </p>
        ),
      },
      {
        id: 'about-4',
        question: 'Has SEED Engineering received industry awards for its work?',
        answer: (
          <p>
            Yes. SEED Engineering has been recognized at leading regional industry events, including winning MEP Project of the Year for Wasl Tower at the Big Project Middle East Awards 2026, commendations at the ISHRAE UAE MEERA Awards, and recognition at the MEP Middle East Awards and Middle East Consultant Awards.
          </p>
        ),
      },
    ],
  },
  {
    id: 'mep-services',
    name: 'MEP Engineering Services',
    description: 'Mechanical, electrical, plumbing, ELV, BIM coordination, and sustainability capabilities.',
    items: [
      {
        id: 'mep-1',
        question: 'What core MEP disciplines does SEED Engineering provide?',
        answer: (
          <div className="space-y-3">
            <p>
              Our multidisciplinary teams provide coordinated engineering across all primary building services disciplines:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                <strong className="text-white">Mechanical Engineering (HVAC):</strong> Air conditioning systems engineered for regional climatic conditions, district cooling substations, central chiller plants, and specialized ventilation.
              </li>
              <li>
                <strong className="text-white">Electrical Engineering:</strong> High and low voltage distribution, transformer substations, standby power generation, architectural lighting, and energy monitoring.
              </li>
              <li>
                <strong className="text-white">Public Health Engineering:</strong> Domestic water supply, sanitary drainage, stormwater systems, rainwater harvesting, and water treatment.
              </li>
              <li>
                <strong className="text-white">Fire & Life Safety:</strong> Hydrant and sprinkler systems, smoke management, gas suppression, and authority compliance.
              </li>
              <li>
                <strong className="text-white">ELV / ICT & AV:</strong> Structured cabling, building management systems (BMS), security networks, smart building integration, and audiovisual systems.
              </li>
              <li>
                <strong className="text-white">Security Systems:</strong> Integrated access control, perimeter security, and IP CCTV surveillance networks.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'mep-2',
        question: 'Do you provide construction site supervision and commissioning verification?',
        answer: (
          <p>
            Yes. We provide end-to-end engineering supervision during construction, including reviewing contractor shop drawings, assessing material submittals, performing site quality inspections, snagging, and witnessing testing and commissioning. Our engineers measure air and water balance and verify electrical loads against design intent to ensure systems operate as specified prior to handover.
          </p>
        ),
      },
      {
        id: 'mep-3',
        question: 'How does SEED Engineering handle BIM coordination and clash detection?',
        answer: (
          <p>
            We coordinate all MEP disciplines on multi-disciplinary 3D BIM models before construction begins on site. This digital delivery process identifies and resolves spatial clashes between mechanical ductwork, piping, electrical cable trays, and structural elements early, significantly reducing variation costs, rework, and construction delays.
          </p>
        ),
      },
      {
        id: 'mep-4',
        question: 'How do your engineering solutions incorporate sustainability and energy efficiency?',
        answer: (
          <p>
            We evaluate energy consumption, carbon impact, water conservation, and indoor environmental quality across every design. Our teams support green building compliance and certification frameworks such as LEED and Estidama, as well as energy modeling, thermal comfort assessments, and daylighting optimization.
          </p>
        ),
      },
    ],
  },
  {
    id: 'pool-division',
    name: 'Swimming Pool Construction and Maintenance',
    description: 'Aquatic engineering, plant room design, pool construction, renovations, and maintenance.',
    items: [
      {
        id: 'pool-1',
        question: 'What services are offered by SEED Engineering’s Pool Division?',
        answer: (
          <div className="space-y-3">
            <p>
              SEED Engineering operates a dedicated Pool & Wellness Division that delivers complete aquatic consultancy. Our services include:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Engineering design and construction consultancy for new swimming pools and aquatic facilities.</li>
              <li>Hydraulic design, circulation modeling, filtration engineering, and plant room layout.</li>
              <li>Pool renovation and equipment modernizations for aging facilities.</li>
              <li>Maintenance planning, water chemistry advisory, and preventative plant servicing.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'pool-2',
        question: 'What types of aquatic facilities and swimming pools do you engineer?',
        answer: (
          <p>
            We engineer a broad range of aquatic projects across luxury residential, commercial, and hospitality sectors. These include rooftop infinity edge pools, hotel resort lagoons, indoor vitality suites, hydrotherapy pools, multi-temperature spas, thermal wellness suites, and integrated architectural water features.
          </p>
        ),
      },
      {
        id: 'pool-3',
        question: 'Why is specialist engineering required for swimming pool installations?',
        answer: (
          <p>
            Water systems require precise hydraulic calculations, balanced turnover rates, effective filtration, chemical dosing, structural waterproofing coordination, and thermal control. In harsh climates, improper hydraulic design can lead to stagnant zones, equipment strain, or leaks. We treat water as a core architectural and engineering discipline to ensure safety, durability, and operational efficiency.
          </p>
        ),
      },
      {
        id: 'pool-4',
        question: 'Do you handle existing swimming pool renovations and retrofits?',
        answer: (
          <p>
            Yes. Our renovation services evaluate existing pool plant rooms, hydraulic piping, filtration media, and finishes. We re-engineer aging facilities to modern efficiency and safety standards, improving water clarity, reducing energy and chemical consumption, and resolving persistent operational issues.
          </p>
        ),
      },
    ],
  },
  {
    id: 'projects-sectors',
    name: 'Projects and Sectors',
    description: 'Industry sectors served, regional project delivery, and completed portfolio highlights.',
    items: [
      {
        id: 'sec-1',
        question: 'Which industry sectors does SEED Engineering serve?',
        answer: (
          <div className="space-y-3">
            <p>We deliver engineering solutions across six key sectors:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong className="text-white">Hospitality:</strong> Luxury hotels, destination resorts, boutique properties, and branded residences.</li>
              <li><strong className="text-white">Residential:</strong> High-rise residential towers, residential communities, and private luxury villas.</li>
              <li><strong className="text-white">Commercial:</strong> Corporate headquarters, commercial towers, and mixed-use commercial developments.</li>
              <li><strong className="text-white">Education:</strong> Schools, universities, campus facilities, and research centers.</li>
              <li><strong className="text-white">Healthcare:</strong> Hospitals, clinical centers, and medical facilities requiring clinical compliance.</li>
              <li><strong className="text-white">Retail:</strong> Shopping malls, retail centers, and destination retail venues.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'sec-2',
        question: 'What regions and markets do you operate in?',
        answer: (
          <p>
            While our headquarters is in Dubai and we deliver extensive work across the United Arab Emirates and the GCC, our practice also operates across Africa, India, and Southeast Asia. We possess deep familiarity with local building regulations, authority approvals, and climate demands in each jurisdiction.
          </p>
        ),
      },
      {
        id: 'sec-3',
        question: 'Where can I view case studies of completed projects?',
        answer: (
          <p>
            You can explore our portfolio on our{' '}
            <Link href="/projects" className="text-gold underline hover:text-white transition-colors">
              Projects page
            </Link>
            , which highlights landmark developments including Wasl Tower, The St. Regis Branded Residences, and numerous commercial, residential, and hospitality facilities. You can also filter projects by sector or practice area.
          </p>
        ),
      },
    ],
  },
  {
    id: 'quotations-enquiries',
    name: 'Quotations and Project Enquiries',
    description: 'Submitting project briefs, proposal requirements, and pricing considerations.',
    items: [
      {
        id: 'quote-1',
        question: 'How do I request a fee proposal or quotation for my project?',
        answer: (
          <p>
            You can submit your project brief and requirements directly through our online form on the{' '}
            <Link href="/contact" className="text-gold underline hover:text-white transition-colors">
              Contact page
            </Link>{' '}
            or email our proposals team at{' '}
            <a href="mailto:contact@seedengineering.com" className="text-gold underline hover:text-white transition-colors">
              contact@seedengineering.com
            </a>
            . Please share key project details such as the location, sector, approximate built-up area (GFA/BUA), and desired scope of services.
          </p>
        ),
      },
      {
        id: 'quote-2',
        question: 'What information is needed to provide an accurate engineering proposal?',
        answer: (
          <div className="space-y-3">
            <p>To prepare a tailored commercial and technical proposal, we typically request:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Project location and sector classification.</li>
              <li>Architectural concept drawings, layout sketches, or masterplans.</li>
              <li>Estimated gross floor area (GFA) or built-up area (BUA).</li>
              <li>Required scope of work (e.g., concept MEP design, full detailed design, BIM modeling, site supervision, or pool engineering).</li>
              <li>Expected project milestones and construction schedule.</li>
            </ul>
            <p>
              For projects with preliminary or evolving briefs, our engineers are happy to discuss requirements to help formulate the scope.
            </p>
          </div>
        ),
      },
      {
        id: 'quote-3',
        question: 'Do you offer standard fixed price packages?',
        answer: (
          <p>
            Because engineering requirements vary substantially depending on building height, architectural complexity, local utility authority requirements, and client specifications, we do not use generic or automated price lists. Every project proposal is customized to reflect the specific technical demands and scope of the development. Please{' '}
            <Link href="/contact" className="text-gold underline hover:text-white transition-colors">
              contact our team
            </Link>{' '}
            to discuss your project requirements.
          </p>
        ),
      },
      {
        id: 'quote-4',
        question: 'How soon can we expect a response to our project enquiry?',
        answer: (
          <p>
            Our engineering team reviews incoming inquiries promptly upon receipt. Once we have sufficient project documentation to assess the scope, a representative will reach out to clarify technical details and discuss delivery timelines. For urgent project appointments, we recommend contacting our Dubai head office directly by phone at{' '}
            <a href="tel:+97142564882" className="text-gold underline hover:text-white transition-colors">
              +971 42 564 882
            </a>
            .
          </p>
        ),
      },
    ],
  },
  {
    id: 'contact-general',
    name: 'Contact and General Questions',
    description: 'Direct communication channels, office visits, partnerships, and careers.',
    items: [
      {
        id: 'contact-1',
        question: 'How can I contact SEED Engineering directly?',
        answer: (
          <p>
            You can reach our Dubai headquarters by phone at{' '}
            <a href="tel:+97142564882" className="text-gold underline hover:text-white transition-colors">
              +971 42 564 882
            </a>
            , via email at{' '}
            <a href="mailto:contact@seedengineering.com" className="text-gold underline hover:text-white transition-colors">
              contact@seedengineering.com
            </a>
            , or by submitting a message through our{' '}
            <Link href="/contact" className="text-gold underline hover:text-white transition-colors">
              Contact page
            </Link>
            . Office addresses for Dubai, Singapore, and India are also available on the Contact page.
          </p>
        ),
      },
      {
        id: 'contact-2',
        question: 'Can I visit your office or schedule an in-person meeting?',
        answer: (
          <p>
            Yes. We welcome meetings with clients, architects, and project stakeholders. Our Dubai headquarters is located at #303, Old Commercial Bank of Dubai Building, Opposite Hamarain Centre, Abu Baker Al Siddique Road, Deira, Dubai, UAE. We recommend scheduling an appointment in advance via our{' '}
            <Link href="/contact" className="text-gold underline hover:text-white transition-colors">
              Contact page
            </Link>{' '}
            or phone so the appropriate discipline leads can be available for your discussion.
          </p>
        ),
      },
      {
        id: 'contact-3',
        question: 'How can architects or main contractors partner with SEED Engineering?',
        answer: (
          <p>
            We regularly collaborate with international and regional architecture practices, project management consultancies (PMCs), cost consultants, and contractors on both competitive tenders and direct appointments. To discuss a potential partnership or include SEED on a tender list, please get in touch via our{' '}
            <Link href="/contact" className="text-gold underline hover:text-white transition-colors">
              Contact page
            </Link>{' '}
            or email{' '}
            <a href="mailto:contact@seedengineering.com" className="text-gold underline hover:text-white transition-colors">
              contact@seedengineering.com
            </a>
            .
          </p>
        ),
      },
      {
        id: 'contact-4',
        question: 'Where can I inquire about career opportunities or job openings?',
        answer: (
          <p>
            Information about current career opportunities, vacancies, and working at SEED Engineering can be found on our{' '}
            <Link href="/careers" className="text-gold underline hover:text-white transition-colors">
              Careers page
            </Link>
            . Candidates may also submit their CV and portfolio through the careers portal or email our recruitment team directly.
          </p>
        ),
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">
      <PageHero
        eyebrow="Frequently Asked Questions"
        title={
          <>
            Clear answers to <em>common questions</em>.
          </>
        }
        intro="Find answers to common questions about SEED Engineering’s multidisciplinary MEP consultancy, swimming pool engineering division, project sectors, fee proposals, and appointment process."
      />

      <FAQClient categories={FAQ_DATA} />
    </div>
  );
}

