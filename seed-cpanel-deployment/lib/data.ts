// Story-driven editorial fallback content used when Sanity is unreachable
// or before content is populated. Keeps every page editorially complete.

export const settings = {
  companyName: 'Seed Engineering',
  tagline: 'Design · Integrate · Sustain — a global engineering consultancy firm.',
  founded: 2005,
  projectsCompleted: 250,
  certifications: 20,
  teamSize: 80,
  phone: '+971 4 256 4882',
  email: 'contact@seedengineering.com',
  address: '#303, Old Commercial Bank of Dubai Building, Opp. Hamarain Centre, Abu Baker Al Siddique Road, Deira, PO Box 119146, Dubai, UAE',
  telegramHandle: '@seedengineering',
  whatsappNumber: '+971 50 000 0000',
  socialLinks: {
    instagram: 'https://instagram.com/seedengineering',
    linkedin: 'https://linkedin.com/company/seed-engineering',
    facebook: 'https://facebook.com/seedengineering',
  },
};

// Real Seed Engineering project highlights — selection from the live portfolio.
export const featuredProjects = [
  {
    _id: 'p1',
    title: 'Mandarin Oriental Wasl Tower',
    slug: 'mandarin-wasl-tower',
    division: 'mep',
    clientSector: 'Mixed-Use · Commercial',
    location: 'Dubai, UAE',
    projectScale: 'BUA: 165,000 sqm · 2B+G+64 · MEP Design & Supervision',
    image: '/projects/mandarin-wasl-tower.webp',
    challenge:
      'A bold 302-metre landmark on Sheikh Zayed Road with 64 storeys integrating hospitality, residential, retail and commercial — featuring one of the world\'s tallest ceramic facades.',
    scope: 'MEP Design & Supervision',
    stats: [
      { label: 'Scope', value: 'Design + Supervision' },
      { label: 'BUA', value: '165,000 sqm' },
      { label: 'Location', value: 'Dubai, UAE' },
    ],
  },
  {
    _id: 'p3',
    title: 'St. Regis Branded Residence',
    slug: 'st-regis-residence',
    division: 'mep',
    clientSector: 'Residential · Luxury',
    location: 'Abu Dhabi, UAE',
    projectScale: 'BUA: 36,700 sqm · G+5P+32 · MEP Design & Supervision',
    image: '/projects/saas-st-regis-1.jpg',
    challenge:
      'A 38-storey luxury residential tower on Al Maryah Island maximizing waterfront views and minimizing solar heat gain, with comprehensive MEP systems for premium living.',
    scope: 'MEP Design & Supervision',
    stats: [
      { label: 'Scope', value: 'Design + Supervision' },
      { label: 'Height', value: '+125.25m' },
      { label: 'Location', value: 'Al Maryah Island' },
    ],
  },
];

// Wider portfolio for /projects, /mep/projects and /pool/projects
export const portfolio: {
  title: string; slug: string; division: string; clientSector: string;
  location: string; projectScale: string; image: string; description: string;
  client?: string; architect?: string; services?: string; area?: string; sector?: string;
  images?: string[];
}[] = [
    {
        title: "Mandarin Oriental Wasl Tower",
        slug: "mandarin-wasl-tower",
        division: "mep",
        clientSector: "Mixed-Use",
        sector: "Mixed-Use",
        location: "Dubai, UAE",
        projectScale: "MEP Design & Supervision",
        client: "WASL",
        architect: "UN Studio",
        services: "MEP Design & Supervision",
        area: "150,000.00 sqm",
        image: "/projects/mandarin-wasl-tower.webp",
        images: [
          "/projects/mandarin-wasl-tower.webp",
          "/projects/mandarin-wasl-2-new.jpg"
        ],
        description: "Mixed used 302m, tall building consisting Of 2B+G+64 floors of offices, Mandarin Hotel and high-end residential apartments on Sh. Zayed Road, Dubai."
    },
    {
        title: "SAAS - St.Regis",
        slug: "saas-st-regis",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Abu Dhabi, UAE",
        projectScale: "MEP Design",
        client: "SAAS",
        architect: "BSBG / Squire & Partners",
        services: "MEP Design",
        area: "70,000 sqm",
        image: "/projects/saas-st-regis-1.jpg",
        images: [
          "/projects/saas-st-regis-1.jpg",
          "/projects/saas-st-regis-2.jpg",
          "/projects/saas-st-regis-3.jpg",
          "/projects/saas-st-regis-4.png"
        ],
        description: "The proposed 4B+G+5P+32F+R+UR Residential Building at Al Maryah Island, Abu Dhabi, UAE."
    },
    {
        title: "Ellington Sands 1 & 2",
        slug: "ellington-sands-1-2",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Ellington",
        architect: "BSBG",
        services: "MEP/AV/ICT/Security/Home Automation Design",
        area: "Plot A: 87,395 sqm · Plot B: 84,818 sqm",
        image: "/projects/Ellington Sands 1 & 2.webp",
        images: [
          "/projects/Ellington Sands 1 & 2.webp",
          "/projects/ellington-sands-waterfront.png",
          "/projects/ellington-sands-aerial.png"
        ],
        description: "Aurelie Dubai Islands is a contemporary waterfront residential development located within the prestigious Dubai Islands masterplan, emerging as one of Dubai's most sought-after coastal destinations. The project comprises two residential buildings designed as a unified development, creating a cohesive community that integrates modern urban living with a premium lifestyle environment.\nSpanning a combined built-up area of over 1.16 million sqm, the development offers a diverse range of residential units, from studios to three-bedroom apartments. The project is designed to cater to modern living standards, with a strong focus on space optimisation, functionality and high-quality finishes, delivering a comfortable and efficient residential experience.\nThe development is planned as multi-storey residential towers supported by podium levels, providing parking, services and lifestyle amenities. A wide range of facilities including swimming\npools, fitness centers, spa areas, club lounges, kids' play areas and landscaped outdoor spaces are integrated to enhance community interaction and overall quality of life.\nThe project incorporates comprehensive MEP, ICT, AV, security and home automation systems, ensuring high levels of operational efficiency, safety and occupant comfort. Advanced engineering solutions including HVAC, electrical, plumbing, fire protection, chilled water, ventilation, LPG and building management systems are designed to deliver a high-performance and future-ready development.\nIn addition, the development features advanced ELV and smart home technologies, including structured cabling, CCTV, access control, intercom systems and home automation solutions, enhancing connectivity, security and user convenience across the development."
    },
    {
        title: "Uptown Mercer House",
        slug: "uptown-mercer-house",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Ellington",
        architect: "BSBG",
        services: "MEP Design",
        area: "84,000 sqm",
        image: "/projects/uptown-mercer-house-balcony.jpg",
        images: [
          "/projects/uptown-mercer-house-balcony.jpg",
          "/projects/uptown-mercer-house-retail.jpg",
          "/projects/uptown-mercer-house-skyline.jpg",
          "/projects/uptown-mercer-house-pool.jpg",
          "/projects/uptown-mercer-house-lobby.jpg"
        ],
        description: "Proposed B+G+4P+Tower-6 with 34 Floors + Roof and Tower-7 with 41 Floors + Roof [ Both the towers will have combined floor plate for Basement, Ground floor till last Podium level] Residential Building at DMCC, Uptown Dubai, UAE."
    },
    {
        title: "Eltiera Heights",
        slug: "eltiera-heights",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP/AV ICT/Security/Home Automation Design",
        client: "Ellington",
        architect: "BSBG",
        services: "MEP/AV/ICT/Security/Home Automation Design",
        area: "44,875 sqm",
        image: "/projects/eltiera-heights-new-01.jpg",
        images: [
          "/projects/eltiera-heights-new-01.jpg",
          "/projects/eltiera-heights-new-02.jpg",
          "/projects/eltiera-heights-new-03.png",
          "/projects/eltiera-heights-new-04.png",
          "/projects/eltiera-heights-new-05.jpg"
        ],
        description: "EN1730 - Residential Building is a contemporary residential development located on the west side of Jumeirah Heights, Dubai. The project is designed to create a modern and integrated living environment, combining residential spaces with a supporting retail component to enhance convenience and lifestyle for residents.\nThe development spans a total gross floor area of approximately 44,875 square metres, comprising predominantly residential units with a small retail component. The project is planned to accommodate approximately 355 apartment units, offering a diverse residential community within a well-connected urban setting.\nThe project integrates a comprehensive range of MEP, ICT, AV, security and home automation systems, ensuring efficient building performance, safety and occupant comfort. The design includes HVAC, electrical, plumbing, fire protection, fire alarm, chilled water, ventilation, LPG and building management systems, all developed in accordance with international standards and local authority requirements.\nIn addition, advanced ICT and ELV systems are incorporated, including structured cabling, CCTV, access control, intercom, audio-visual systems and smart home automation solutions. These systems are designed to enhance connectivity, security and user convenience, providing a modern, technology-driven living environment.\nThe project adopts an integrated multidisciplinary design approach, ensuring seamless coordination between all engineering disciplines, optimised space utilisation and efficient system performance. Emphasis is placed on sustainable design practices, energy efficiency and long-term operational reliability.\nEN1730 represents a well-planned residential development that combines modern design, advanced engineering and smart technologies, contributing to the evolving urban landscape of Jumeirah Heights."
    },
    {
        title: "Eltiera Views",
        slug: "eltiera-views",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP/AV/ICT/Security/Home Automation Design",
        client: "Ellington",
        architect: "BSBG",
        services: "MEP/AV/ICT/Security/Home Automation Design",
        area: "111,370 sqm",
        image: "/projects/eltiera-views.webp",
        images: [
          "/projects/eltiera-views.webp",
          "/projects/eltiera-views-new.webp"
        ],
        description: "JHP Residential Building is part of the larger Jumeirah Heights mixed-use masterplan, located on Plot 3934256 in Dubai. The project forms a key component of a broader urban development that integrates luxury residential living, commercial spaces and vibrant public environments into a cohesive and interconnected community.\nThe masterplan encompasses two primary plots, designed to function as a unified urban destination. Plot 253 features a landmark luxury residential tower, while Plot 256 accommodates a mix of three residential towers and a signature office tower, including the future headquarters of Ellington. The development adopts a holistic planning approach, creating a seamless and walkable environment that enhances connectivity and user experience.\nThe project emphasizes high-quality residential living supported by commercial and public amenities, with a strong focus on creating a dynamic and people-centric environment. The design aims to dissolve physical boundaries between plots, allowing for fluid movement, integrated landscapes and shared spaces that contribute to a vibrant community identity.\nThe development integrates a comprehensive range of MEP, ICT, AV, security and home automation systems, ensuring high levels of efficiency, safety and operational performance. The engineering scope includes HVAC, electrical, plumbing, fire protection, fire alarm, chilled water, ventilation, LPG and building management systems, all designed in accordance with international standards and local authority regulations.\nAdvanced ICT and ELV systems are incorporated, including structured cabling, CCTV, access control, intercom and smart home automation solutions. These systems enhance connectivity, security and user comfort, delivering a modern, technology-enabled residential environment.\nThe project follows an integrated multidisciplinary design approach, ensuring seamless coordination across all disciplines, optimised system performance and long-term operational reliability. Emphasis is placed on sustainable design practices, efficient resource utilisation and high-performance building systems.\nEN1733 represents a forward-looking mixed-use development that combines residential, commercial and public realm components, contributing to the evolution of Jumeirah Heights as a vibrant and integrated urban community."
    },
    {
        title: "Iconic Tower",
        slug: "iconic-tower",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Mered",
        architect: "Pininfarina",
        services: "MEP Design",
        area: "50,947 sqm",
        image: "/projects/iconic-tower-new.jpg",
        images: [
          "/projects/iconic-tower-new.jpg"
        ],
        description: ""
    },
    {
        title: "JW Marriott Residences",
        slug: "jw-marriott-residences",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Dubai, UAE",
        projectScale: "MEP Design Services",
        client: "CG Group",
        architect: "JRHP",
        services: "MEP Design",
        area: "23,517 sqm",
        image: "/projects/JW Marriott Residences.webp",
        images: [
          "/projects/JW Marriott Residences.webp",
          "/projects/jw-marriott-new-02.jpg",
          "/projects/jw-marriott-new-03.jpg",
          "/projects/jw-marriott-new-01.jpg"
        ],
        description: ""
    },
    {
        title: "Playa Del Sol",
        slug: "playa-del-sol",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Ras Al Khaimah, UAE",
        projectScale: "MEP Design & Supervision",
        client: "Ellington",
        architect: "BSBG",
        services: "MEP Design & Supervision",
        area: "98,296 sqm",
        image: "/projects/playa-del-sol-new.png",
        images: [
          "/projects/playa-del-sol-new.png"
        ],
        description: "Playa Del Sol is a contemporary residential development located on the prestigious Al Marjan Island in Ras Al Khaimah, one of the UAE's most prominent waterfront destinations. The project is designed to deliver a premium residential experience, combining modern living with a resort-style coastal environment.\nThe development spans a plot area of approximately 167,447 sqm, with a total built-up area of around 533,000 sqm. The project comprises mid-rise residential buildings configured with ground floor, podium levels accommodating parking and amenities, and multiple residential floors, creating a well-integrated and efficient urban development.\nThe development accommodates approximately 420 residential units, offering a diverse mix of apartment types ranging from studios to four-bedroom penthouses. Designed to cater to the mid to upper-income market, the project emphasizes efficient layouts, high-quality finishes and optimised space utilisation, delivering a comfortable and contemporary living environment.\nThe project incorporates a comprehensive range of MEP systems, including HVAC, electrical, plumbing, fire protection, fire alarm, chilled water, ventilation and LPG systems. All systems are designed in accordance with international standards and local authority regulations, ensuring high levels of safety, efficiency and operational performance."
    },
    {
        title: "PORTSIDE SQUARE",
        slug: "portside-square",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP/AV/ICT/Home Automation & Security Design",
        client: "Ellington",
        architect: "XYZ Designers",
        services: "MEP/AV/ICT/Home Automation & Security Design",
        image: "/projects/Portside Square.webp",
        images: [
          "/projects/Portside Square.webp",
          "/projects/portside-square-02.jpg",
          "/projects/portside-square-03.jpg",
          "/projects/portside-square-04.jpg"
        ],
        description: ""
    },
    {
        title: "Residential at Peninsula Plot B",
        slug: "residential-at-peninsula-plot-b",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Select Group",
        architect: "Killa Design",
        services: "MEP Design",
        area: "96,486 sqm",
        image: "/projects/Residential at Peninsula Plot B.webp",
        images: [
          "/projects/Residential at Peninsula Plot B.webp"
        ],
        description: ""
    },
    {
        title: "Select BB Towers Plot Z",
        slug: "select-bb-towers-plot-z",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Select Group",
        architect: "Killa Design",
        services: "MEP Design",
        area: "90,374 sqm",
        image: "/projects/Select BB Towers Plot Z.webp",
        images: [
          "/projects/Select BB Towers Plot Z.webp",
          "/projects/select-bb-towers-new.jpg"
        ],
        description: ""
    },
    {
        title: "Sukoon and Museum Residential Buildings",
        slug: "sukoon-and-museum-residential-buildings",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Sharjah, UAE",
        projectScale: "MEP Design",
        client: "ARADA",
        architect: "DAR Consult",
        services: "MEP Design",
        area: "40,000 sqm",
        image: "/projects/Sukoon and Museum Residential Buildings.webp",
        images: [
          "/projects/Sukoon and Museum Residential Buildings.webp",
          "/projects/sukoon-and-museum-residential-buildings-sukoon---museum-residential-building-corner-view.webp"
        ],
        description: ""
    },
    {
        title: "The Gate Buildings",
        slug: "the-gate-buildings",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Sharjah, UAE",
        projectScale: "MEP Design",
        client: "ARADA",
        architect: "DAR Consult",
        services: "MEP Design",
        area: "17,187 sqm",
        image: "/projects/The Gate Buildings.webp",
        images: [
          "/projects/The Gate Buildings.webp",
          "/projects/the-gate-buildings-the-gate-buildings-dubai.webp"
        ],
        description: ""
    },
    {
        title: "The Meriva Collection",
        slug: "the-meriva-collection",
        division: "mep",
        clientSector: "Mixed-Use",
        sector: "Mixed-Use",
        location: "Dubai, UAE",
        projectScale: "MEP/AV/ICT/Home Automation & Security Design",
        client: "Ellington",
        architect: "XYZ",
        services: "MEP/AV/ICT/Home Automation & Security Design",
        area: "107,290 sqm",
        image: "/projects/The Meriva Collection.webp",
        images: [
          "/projects/The Meriva Collection.webp",
          "/projects/meriva-collection-02.jpg",
          "/projects/meriva-collection-03.jpg",
          "/projects/meriva-collection-04.png",
          "/projects/meriva-collection-05.jpg"
        ],
        description: "The Dubai Islands Mixed-Use Development (Plot DIB-MU-0005) is a large-scale integrated development located within the rapidly evolving Dubai Islands masterplan, offering a prime waterfront destination with a focus on luxury living, hospitality and retail experiences.\nSpanning a substantial plot area of approximately 107,290 square metres, the project has a total gross floor area of around 1.48 million sqm. The development comprises a balanced mix of residential, hospitality and retail components, including approximately 1,261,347 sqm of residential space, 148,393 sqm dedicated to hotel use and 74,196 sqm allocated for retail.\nThe residential component is designed to offer a diverse range of unit typologies, including 1-bedroom, 2-bedroom, 3-bedroom and penthouse units, catering to a wide spectrum of residents. The development is planned to accommodate approximately 1,105 residential units, ensuring a vibrant and dynamic community environment.\nThe project is configured as a multi-storey development with a basement, ground level and 22 floors, designed to optimise space utilisation and provide a seamless integration of residential, hospitality and retail functions. The hotel component is envisioned to offer premium serviced apartments and hospitality facilities, enhancing the overall lifestyle offering of the development.\nThe project integrates a comprehensive scope of engineering services including MEP, ICT, AV, home automation and security systems. The design encompasses HVAC, electrical, plumbing, fire protection, fire alarm, chilled water, ventilation, LPG, building management systems and advanced ELV solutions, ensuring efficient performance, safety and user comfort.\nAll systems are designed in accordance with international standards and local authority requirements, with a strong focus on sustainability, energy efficiency and coordinated multidisciplinary design. The project adopts an integrated design approach to ensure optimised performance, seamless coordination and long-term operational reliability.\nThe Dubai Islands Mixed-Use Development represents a modern urban destination that combines residential living, hospitality excellence and retail vibrancy within a single integrated development, contributing to the transformation of Dubai Islands into a premier waterfront community."
    },
    {
        title: "Waldorf Astoria",
        slug: "waldorf-astoria",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Nabni Developments",
        architect: "Carlos OTT / VX Studio",
        services: "MEP Design Services",
        area: "850,000 sqft",
        image: "/projects/waldorf-astoria-new-01.jpg",
        images: [
          "/projects/waldorf-astoria-new-01.jpg",
          "/projects/waldorf-astoria-04.jpg",
          "/projects/waldorf-astoria-05.jpg",
          "/projects/waldorf-astoria-07.jpg",
          "/projects/waldorf-astoria-08.jpg",
          "/projects/waldorf-astoria-09.jpg"
        ],
        description: ""
    },
    {
        title: "Wedyan - The Canal",
        slug: "wedyan-the-canal",
        division: "mep",
        clientSector: "Mixed-Use",
        sector: "Mixed-Use",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Al Ghurair Properties",
        architect: "BSBG / KKAA",
        services: "MEP Design",
        area: "117,350 sqm",
        image: "/projects/weydam-canal-03.jpg",
        images: [
          "/projects/weydam-canal-03.jpg",
          "/projects/Wedyan - The canal.webp"
        ],
        description: ""
    },
    {
        title: "Preatoni Tower Residential Development",
        slug: "preatoni-tower-residential-development",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Preatoni",
        architect: "Killa Design",
        services: "MEP Design",
        area: "43,247 sqm",
        image: "/projects/Preatoni.webp",
        images: [
          "/projects/Preatoni.webp",
          "/projects/preatoni-tower-03.jpg"
        ],
        description: "Proposed B+G+3P+ 39 Floors +Roof Residential Building Preatoni Tower, Dubai, UAE."
    },
    {
        title: "Radisson Blu",
        slug: "radisson-blu",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Ajman, UAE",
        projectScale: "MEP Design",
        client: "Holiday Group",
        architect: "DWP",
        services: "MEP Design",
        area: "30,000 sqm · 148 Keys",
        image: "/projects/Radisson Blu.webp",
        images: [
          "/projects/Radisson Blu.webp",
          "/projects/radisson-blu-03.jpg",
          "/projects/radisson-blu-02.jpg",
          "/projects/radisson-blu-04.jpg"
        ],
        description: "Radisson Blu Hotel Ajman offers 148 stylish rooms, modern recreational facilities, 25m temperature-controlled pool, and 6 restaurants & bars, offering delectable international cuisines."
    },
    {
        title: "Mandarin Jumeirah Beach Resort",
        slug: "mandarin-jumeirah-beach-resort",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "WASL",
        architect: "DAR",
        services: "MEP Design & Supervision",
        area: "45,000 sqm · 256 Rooms",
        image: "/projects/mandarin-jumeirah-new-01.jpg",
        images: [
          "/projects/mandarin-jumeirah-new-01.jpg",
          "/projects/mandarin-jumeirah-new-02.jpg",
          "/projects/mandarin-jumeirah-06.jpg",
          "/projects/mandarin-jumeirah-11.png",
          "/projects/mandarin-jumeirah-new-03.jpg",
          "/projects/mandarin-jumeirah-new-04.jpg",
          "/projects/mandarin-jumeirah-new-05.jpg"
        ],
        description: ""
    },
    {
        title: "Dammam Aramco Stadium (DAS)",
        slug: "dammam-aramco-stadium",
        division: "mep",
        clientSector: "Sports",
        sector: "Sports",
        location: "Dammam, KSA",
        projectScale: "MEP Design Review and CFD Modeling",
        client: "Saudi Aramco",
        architect: "Populous / BESIX",
        services: "MEP Design Review and CFD Modeling",
        area: "45,000+ seating",
        image: "/projects/dammam stadium.webp",
        images: [
          "/projects/dammam stadium.webp",
          "/projects/dammam-aramco-stadium-01.png",
          "/projects/dammam-aramco-stadium-02.jpg"
        ],
        description: "Dammam Aramco Stadium is an iconic, fully airconditioned stadium including bowl cooling having 45000+ seating currently being constructed in Saudi Arabia to host the 2027 Asian Football Cup and 2034 FIFA World Cup. The Stadium is the core of the Dammam Aramco Stadium Masterplan offering comprehensive range of amenities and facilities designed to provide an unparalleled sports and entertainment experience"
    },
    {
        title: "Al Ajlan KSR HQ Tower",
        slug: "al-ajlan-ksr-hq-tower",
        division: "mep",
        clientSector: "Commercial",
        sector: "Commercial",
        location: "Riyadh, Saudi Arabia",
        projectScale: "MEP Design Services",
        client: "Mohammed & Mosab Abdullah Alajlan Sons Investment Co.",
        architect: "X Architects",
        services: "MEP Design Services",
        area: "14,150 sqm",
        image: "/projects/Al Ajlan KSR HQ Tower.webp",
        images: [
          "/projects/Al Ajlan KSR HQ Tower.webp"
        ],
        description: "HQ & Commercial Development Tower located in Riyadh, KSA."
    },
    {
        title: "Al Ajlan Tower 2",
        slug: "al-ajlantower-2",
        division: "mep",
        clientSector: "Commercial",
        sector: "Commercial",
        location: "Riyadh, Saudi Arabia",
        projectScale: "MEP Design Services",
        client: "Mohammed & Mosab Abdullah Alajlan Sons Investment Co.",
        architect: "X Architects",
        services: "MEP Design Services",
        area: "16,000 sqm",
        image: "/projects/Al AjlanTower 2.webp",
        images: [
          "/projects/Al AjlanTower 2.webp",
          "/projects/al-ajlantower-2-new-01.png"
        ],
        description: "Commercial Development Tower in Riyadh, KSA."
    },
    {
        title: "Al Ajlan Tower 3",
        slug: "al-ajlantower-3",
        division: "mep",
        clientSector: "Commercial",
        sector: "Commercial",
        location: "Riyadh, Saudi Arabia",
        projectScale: "MEP Design Services",
        client: "Mohammed & Mosab Abdullah Alajlan Sons Investment Co.",
        architect: "X Architects",
        services: "MEP Design Services",
        area: "17,000 sqm",
        image: "/projects/Al AjlanTower 3.webp",
        images: [
          "/projects/Al AjlanTower 3.webp",
          "/projects/al-ajlantower-3-new-02.png",
          "/projects/al-ajlantower-3-new-03.jpg"
        ],
        description: "Commercial Development Tower in Riyadh, KSA."
    },
    {
        title: "City Walk Mixed Use Development",
        slug: "city-walk-mixed-use-development",
        division: "mep",
        clientSector: "Mixed-Use",
        sector: "Mixed-Use",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "North 25",
        architect: "CRTKL / ArchGroup",
        services: "MEP Design",
        area: "25,452 sqm",
        image: "/projects/City Walk Mixed Use Development.webp",
        images: [
          "/projects/City Walk Mixed Use Development.webp",
          "/projects/city-walk-new-03.png",
          "/projects/city-walk-new-02.jpg",
          "/projects/city-walk-new-01.jpg"
        ],
        description: "Mid-rise (B+G+5+R) Mixed Use Building — Residential and Retail. Sits within a gated residential park community masterplan."
    },
    {
        title: "Commerz 3 Tower",
        slug: "commerz-3",
        division: "mep",
        clientSector: "Commercial",
        sector: "Commercial",
        location: "Mumbai, India",
        projectScale: "MEP Design",
        client: "Oberoi Realty",
        architect: "Woods Bagot – New York",
        services: "MEP Design",
        area: "215,070 sqm",
        image: "/projects/Commerz 3.webp",
        images: [
          "/projects/Commerz 3.webp",
          "/projects/commerz-3-tower.webp",
          "/projects/commerz-3-new-01.png"
        ],
        description: "Brand new high-end commercial tower in Goregaon (East), Mumbai. 50-level tower adjacent to the existing Commerz 2 Tower."
    },
    {
        title: "DM Wayanad Institute of Medical Science",
        slug: "dm-wayanad",
        division: "mep",
        clientSector: "Healthcare",
        sector: "Healthcare",
        location: "Wayanad, India",
        projectScale: "MEP Design & Supervision",
        client: "DM Developers",
        architect: "NM Salim Associates",
        services: "MEP Design & Supervision Services",
        area: "120,000 sqm · 700 Beds",
        image: "/projects/DM Wayanad.webp",
        images: [
          "/projects/DM Wayanad.webp",
          "/projects/dm-wayanad-new-01.png"
        ],
        description: "First medical college & hospital in this hill station of Kerala. 700 beds, 1.2 million sq. ft. Designed in hilly terrain with a constrained budget."
    },
    {
        title: "Deyaar Midtown",
        slug: "deyaar-midtown",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP Design & Site Supervision",
        client: "Deyaar",
        architect: "U+A",
        services: "MEP Supervision",
        area: "369,602 sqm · 12 Residential Buildings",
        image: "/projects/Deyaar Midtown.webp",
        images: [
          "/projects/Deyaar Midtown.webp",
          "/projects/deyaar-midtown-image-1.webp",
          "/projects/deyaar-midtown-new-01.jpg"
        ],
        description: "12 residential buildings forming the Deyaar Midtown development in Dubai."
    },
    {
        title: "Millennium Deyaar Hotel",
        slug: "deyaar-millenium-hotel",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Dubai, UAE",
        projectScale: "MEP System Design & Supervision",
        client: "Deyaar",
        architect: "U+A Architect",
        services: "MEP System Design & Supervision",
        area: "36,200 sqm · 299 Rooms & Suites · 109 Service Apartments",
        image: "/projects/Deyaar Millenium Hotel.webp",
        images: [
          "/projects/Deyaar Millenium Hotel.webp",
          "/projects/millennium-deyaar-new-01.png",
          "/projects/millennium-deyaar-new-02.jpg",
          "/projects/millennium-deyaar-new-03.png",
          "/projects/millennium-deyaar-new-04.png",
          "/projects/millennium-deyaar-new-05.jpg"
        ],
        description: "Millennium Al Barsha — a 4-star property located within walking distance from Mall of the Emirates. Offers 299 rooms and suites plus 109 serviced apartments with all modern amenities."
    },
    {
        title: "Soto Grande",
        slug: "soto-grande",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Ras Al Khaimah, UAE",
        projectScale: "MEP Design",
        client: "Ellington",
        architect: "XYZ Designers",
        services: "MEP Design",
        image: "/projects/Soto Grande.webp",
        images: [
          "/projects/Soto Grande.webp",
          "/projects/soto-grande-03.jpg",
          "/projects/soto-grande-05.jpg",
          "/projects/soto-grande-06.jpg",
          "/projects/soto-grande-07.jpg"
        ],
        description: "Soto Grande at Al Hamra, Ras Al Khaimah, is a modern residential development comprising 630 units across a mix of studio to four-bedroom penthouse apartments within approximately 61,000 sqm of gross floor area, integrating smart home technologies, comprehensive building systems and contemporary amenities to deliver a comfortable, efficient and connected living environment."
    },
    {
        title: "Gargash Hospital",
        slug: "gargash-hospital",
        division: "mep",
        clientSector: "Healthcare",
        sector: "Healthcare",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Ali Gargash",
        architect: "Eng. Adnan Saffarini",
        services: "MEP Design",
        area: "50 Hospital Beds",
        image: "/projects/Gargash Hospital.webp",
        images: [
          "/projects/Gargash Hospital.webp",
          "/projects/gargash-hospital-2.webp",
          "/projects/gargash-hospital-new-01.png"
        ],
        description: ""
    },
    {
        title: "German General Hospital",
        slug: "german-general-hospital",
        division: "mep",
        clientSector: "Healthcare",
        sector: "Healthcare",
        location: "Abu Dhabi, UAE",
        projectScale: "MEP Design",
        client: "German General Hospital",
        architect: "Wörner Traxler Richter",
        services: "MEP Design",
        area: "40,000 sqm · 100 Beds",
        image: "/projects/German General Hospital.webp",
        images: [
          "/projects/German General Hospital.webp"
        ],
        description: ""
    },
    {
        title: "Hilton Awassa",
        slug: "hilton-awassa",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Awassa, Ethiopia",
        projectScale: "MEP Design",
        client: "Sunshine Investment PLC",
        architect: "JDAW Consult",
        services: "MEP Design & Supervision",
        area: "30,000 sqm · 169 Guest Rooms",
        image: "/projects/Hilton Awassa.webp",
        images: [
          "/projects/Hilton Awassa.webp",
          "/projects/hilton-awassa-new-01.jpg",
          "/projects/hilton-awassa-image-1.webp"
        ],
        description: ""
    },
    {
        title: "Holiday Inn & residences",
        slug: "holiday-inn-residences",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Kingston Holding",
        architect: "EDGE Design",
        services: "MEP Design & Supervision",
        area: "60,000 sqm · Twin Towers",
        image: "/projects/Holiday Inn & residences.webp",
        images: [
          "/projects/Holiday Inn & residences.webp",
          "/projects/holiday-inn-hilton.webp"
        ],
        description: ""
    },
    {
        title: "Hub Zero",
        slug: "hub-zero",
        division: "mep",
        clientSector: "Entertainment",
        sector: "Entertainment",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Meraas",
        architect: "RIVA",
        services: "MEP Design Services",
        area: "15,000 sqm",
        image: "/projects/Hub Zero.webp",
        images: [
          "/projects/Hub Zero.webp"
        ],
        description: ""
    },
    {
        title: "IMG",
        slug: "img",
        division: "mep",
        clientSector: "Entertainment",
        sector: "Entertainment",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "IM Galadari",
        architect: "FTHUSA",
        services: "MEP Design & Supervision",
        area: "150,000 sqm",
        image: "/projects/IMG.webp",
        images: [
          "/projects/IMG.webp",
          "/projects/img-new-01.png"
        ],
        description: ""
    },
    {
        title: "Jumeirah Living 5 Star Hotel Apartments at Peninsula Plot F  Dubai, UAE",
        slug: "jumeirah-living-5-star-hotel-apartments-at-peninsula-plot-f-dubai-uae",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Select Group",
        architect: "Killa Design",
        services: "MEP Design",
        area: "27,400 sqm",
        image: "/projects/jumeirah-living-peninsula.webp",
        images: [
          "/projects/jumeirah-living-peninsula.webp",
          "/projects/jumeirah-living-waterfront-sunset.png",
          "/projects/jumeirah-living-5-star-hotel-apartments-at-peninsula-plot-f--dubai--uae-pu21148b-plot-f.webp"
        ],
        description: ""
    },
    {
        title: "Kings College",
        slug: "kings-college",
        division: "mep",
        clientSector: "Education",
        sector: "Education",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Kings Holding",
        architect: "ANC / Dubai Consultants",
        services: "MEP Design & Supervision",
        area: "45,000 sqm",
        image: "/projects/Kings College.webp",
        images: [
          "/projects/Kings College.webp",
          "/projects/kings-college-kings-college---1.webp",
          "/projects/kings-college-new-view.png"
        ],
        description: ""
    },
    {
        title: "Lake Lisi School",
        slug: "lake-lisi-school",
        division: "mep",
        clientSector: "Education",
        sector: "Education",
        location: "Tbilisi, Georgia",
        projectScale: "MEP Design",
        client: "Lake Lisi",
        architect: "Education Design International",
        services: "MEP Concept Design",
        area: "18,000 sqm",
        image: "/projects/Lake Lisi School.webp",
        images: [
          "/projects/Lake Lisi School.webp",
          "/projects/lake-lisi-school-1.webp"
        ],
        description: ""
    },
    {
        title: "Mirdiff Hills",
        slug: "mirdiff-hills",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "DIRC",
        architect: "Jonathan Dunn Associates, UK",
        services: "MEP Design",
        area: "350,000 sqm",
        image: "/projects/Mirdiff Hills.webp",
        images: [
          "/projects/Mirdiff Hills.webp",
          "/projects/mirdiff-hills-image-1.webp",
          "/projects/mirdiff-hills-new-view-2.png",
          "/projects/mirdiff-hills-new-view-3.png"
        ],
        description: ""
    },
    {
        title: "NMC Hospital",
        slug: "nmc-hospital",
        division: "mep",
        clientSector: "Healthcare",
        sector: "Healthcare",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "New Medical Centre",
        architect: "A2Z Architects",
        services: "MEP Design & Supervision",
        area: "20,000 sqm · 70 Beds",
        image: "/projects/NMC Hospital.webp",
        images: [
          "/projects/NMC Hospital.webp",
          "/projects/nmc-hospital-20130305-165604.webp",
          "/projects/nmc-hospital.webp"
        ],
        description: ""
    },
    {
        title: "Namaste Tower",
        slug: "namaste-tower",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Mumbai, India",
        projectScale: "MEP Design",
        client: "Jaguar",
        architect: "Killa Architectural Consultants",
        services: "MEP Design",
        area: "120,000 sqm · 363 Keys",
        image: "/projects/namaste-tower-view-1.png",
        images: [
          "/projects/namaste-tower-view-1.png",
          "/projects/namaste-tower-view-2.png",
          "/projects/namaste-tower-view-3.png"
        ],
        description: ""
    },
    {
        title: "National Games Stadium , Trivandrum India",
        slug: "national-games-stadium-trivandrum-india",
        division: "mep",
        clientSector: "Sports",
        sector: "Sports",
        location: "Trivandrum, India",
        projectScale: "MEP Design",
        client: "IL&FS",
        architect: "Collage Designs",
        services: "MEP Design & Supervision",
        area: "50,000 seats",
        image: "/projects/National Games Stadium , Trivandrum India.webp",
        images: [
          "/projects/National Games Stadium , Trivandrum India.webp",
          "/projects/national-games-stadium---trivandrum-india-1.webp"
        ],
        description: ""
    },
    {
        title: "Novotel Al Barsha",
        slug: "novotel-al-barsha",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Al Ali Properties",
        architect: "Khatib & Alami",
        services: "MEP Design & Part-time Supervision",
        area: "169,000 sqm · 465 Rooms",
        image: "/projects/Novotel Al Barsha.webp",
        images: [
          "/projects/Novotel Al Barsha.webp",
          "/projects/novotel-al-barsha-image-1.webp"
        ],
        description: ""
    },
    {
        title: "Oberoi International School",
        slug: "oberoi-international-school",
        division: "mep",
        clientSector: "Education",
        sector: "Education",
        location: "Mumbai, India",
        projectScale: "MEP Design",
        client: "Oberoi Realty",
        architect: "Perkins+Will",
        services: "MEP Design",
        area: "30,000 sqm",
        image: "/projects/Oberoi International School.webp",
        images: [
          "/projects/Oberoi International School.webp",
          "/projects/oberoi-international-school-1.webp",
          "/projects/oberoi-international-school-2.webp",
          "/projects/oberoi-international-school-3.webp"
        ],
        description: ""
    },
    {
        title: "Park Hyatt Zanzibar",
        slug: "park-hyatt-zanzibar",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Zanzibar, Tanzania",
        projectScale: "MEP Design",
        client: "Albwardy",
        architect: "WA International",
        services: "MEP Design",
        area: "15,000 sqm · 90 Keys",
        image: "/projects/Park Hyatt Zanzibar.webp",
        images: [
          "/projects/Park Hyatt Zanzibar.webp",
          "/projects/park-hyatt-zanzibar-image-1.webp",
          "/projects/park-hyatt-zanzibar.webp"
        ],
        description: ""
    },
    {
        title: "Gran Melia Hotel",
        slug: "gran-melia-hotel",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "ASB Hospitality",
        architect: "MOMA",
        services: "MEP Design Review & Site Supervision",
        area: "88,909 sqm · 380 Keys",
        image: "/projects/Gran Melia Hotel.jpg",
        images: [
          "/projects/Gran Melia Hotel.jpg"
        ],
        description: ""
    },
    {
        title: "Rajiv Gandhi Int’l Cricket Stadium",
        slug: "rajiv-gandhi-int-l-cricket-stadium",
        division: "mep",
        clientSector: "Sports",
        sector: "Sports",
        location: "Dehradun, India",
        projectScale: "MEP Design",
        client: "Rajiv Gandhi Intl. Cricket Stadium",
        architect: "Populous / College Design",
        services: "MEP Design & Client Representative",
        area: "25,000 seats",
        image: "/projects/Rajiv Gandhi Int’l Cricket Stadium.webp",
        images: [
          "/projects/Rajiv Gandhi Int’l Cricket Stadium.webp",
          "/projects/rajiv-gandhi-stadium-1.webp",
          "/projects/rajiv-gandhi-stadium-2.webp",
          "/projects/rajiv-gandhi-stadium-3.webp",
          "/projects/rajiv-gandhi-stadium-4.webp",
          "/projects/rajiv-gandhi-stadium-5.webp"
        ],
        description: ""
    },
    {
        title: "Rove Hotel and Branded Apartments",
        slug: "rove-hotel-and-branded-apartments",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Sharjah, UAE",
        projectScale: "MEP Design",
        client: "Rove Al Jada",
        architect: "JRHP",
        services: "MEP Design",
        area: "32,970 sqm · 150 Suites · 250 Apartments",
        image: "/projects/Rove hotel.webp",
        images: [
          "/projects/Rove hotel.webp",
          "/projects/rove-hotel.webp",
          "/projects/rove-hotel-1.webp"
        ],
        description: ""
    },
    {
        title: "Safa School",
        slug: "safa-school",
        division: "mep",
        clientSector: "Education",
        sector: "Education",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Safa School",
        architect: "EDA / FNI",
        services: "MEP Design",
        area: "25,000 sqm",
        image: "/projects/Safa School.webp",
        images: [
          "/projects/Safa School.webp",
          "/projects/safa-school-1.webp",
          "/projects/safa-school-2.webp"
        ],
        description: ""
    },
    {
        title: "Sobha Hartland",
        slug: "sobha-hartland",
        division: "mep",
        clientSector: "Education",
        sector: "Education",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "PNC Investments",
        architect: "PNC Architects",
        services: "MEP Design",
        area: "38,100 sqm",
        image: "/projects/Sobha Hartland.webp",
        images: [
          "/projects/Sobha Hartland.webp",
          "/projects/sobha-hartland-image-1.webp"
        ],
        description: ""
    },
    {
        title: "Sunrise Bay Tower",
        slug: "sunrise-bay-tower",
        division: "mep",
        clientSector: "Mixed-Use",
        sector: "Mixed-Use",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "EMAAR",
        architect: "Perkins+Will & Rice Perry Ellis",
        services: "MEP Design",
        area: "65,000 sqm",
        image: "/projects/Sunrise Bay Tower.webp",
        images: [
          "/projects/Sunrise Bay Tower.webp",
          "/projects/sunrise-bay-tower-dhd-zone2-plotb18-living-dining-kitchen-day-view-scaled.webp"
        ],
        description: ""
    },
    {
        title: "TBC Bank Headquarters",
        slug: "tbc-bank-headquarters",
        division: "mep",
        clientSector: "Commercial",
        sector: "Commercial",
        location: "Tbilisi, Georgia",
        projectScale: "MEP Design",
        client: "National Housing Corporation",
        architect: "UN Studio",
        services: "Peer Review",
        area: "67,000 sqm",
        image: "/projects/TBC Bank Headquarters.webp",
        images: [
          "/projects/TBC Bank Headquarters.webp",
          "/projects/tbc-bank-headquarters-image-1.webp"
        ],
        description: ""
    },
    {
        title: "W Hotel",
        slug: "w-hotel",
        division: "mep",
        clientSector: "Hospitality",
        sector: "Hospitality",
        location: "Muscat, Oman",
        projectScale: "MEP Design",
        client: "OMRAN",
        architect: "COWI/HKS",
        services: "MEP Design",
        area: "40,000 sqm · 251 Rooms · 28 Suites",
        image: "/projects/W Hotel.webp",
        images: [
          "/projects/W Hotel.webp",
          "/projects/w-hotel-picture1.webp"
        ],
        description: ""
    },
    {
        title: "Warsan",
        slug: "warsan",
        division: "mep",
        clientSector: "Healthcare",
        sector: "Healthcare",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Dubai Health Authority",
        architect: "Al Sharawi",
        services: "MEP Design",
        area: "30,458 sqm · 288 Rooms / 556 Beds",
        image: "/projects/Warsan.webp",
        images: [
          "/projects/Warsan.webp"
        ],
        description: ""
    },
    {
        title: "Worli 360 west",
        slug: "worli-360-west",
        division: "mep",
        clientSector: "Mixed-Use",
        sector: "Mixed-Use",
        location: "Mumbai, India",
        projectScale: "MEP Design",
        client: "Oberoi Realty",
        architect: "Kohn Pedersen Fox (KPF)",
        services: "MEP Design Services",
        area: "390,000 sqm (combined)",
        image: "/projects/Worli 360 west.webp",
        images: [
          "/projects/Worli 360 west.webp",
          "/projects/worli-ritz-carlton.webp"
        ],
        description: ""
    },
    {
        title: "Akoya Carson Tower",
        slug: "akoya-carson-tower",
        division: "mep",
        clientSector: "Residential",
        sector: "Residential",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "DAMAC Properties",
        architect: "U+A Architect",
        services: "MEP Site Supervision",
        area: "110,000 sqm",
        image: "/projects/Akoya Carson Tower.webp",
        images: [
          "/projects/Akoya Carson Tower.webp",
          "/projects/akoya-carson-tower-all-4-towers-number2new-a-3.webp"
        ],
        description: "Consists of 3 residential towers each comprising 33 floors located at Umm Suqeim Road, Dubailand, Akoya, Dubai. With its supreme location overlooking the Trump International Golf Club Dubai, there's a staggering choice of outdoor facilities within easy reach."
    },
    {
        title: "Noora & Hana Beach Villa",
        slug: "noora-hana-beach-villa",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Umm Al Quwain, UAE",
        projectScale: "MEP Design",
        client: "Mrs. Noora Abd Hana Obaid Buti Al Mulla",
        architect: "ArchCorp",
        services: "MEP Design",
        area: "1,554.93 sqm",
        image: "/projects/g-1-beach-villa-dubai,-uae.jpg",
        images: [
          "/projects/g-1-beach-villa-dubai,-uae.jpg",
          "/projects/b-g-1-private-villa-dubai,-uae.jpg",
          "/projects/b-g-1-residential-villa-dubai,-uae.jpg"
        ],
        description: "G+1 Storey Beach Villa, Plot No. 245"
    },
    {
        title: "B+G+1 Private Villa",
        slug: "b-g-1-private-villa",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Mr. Ahmad Abdulla Ahmad Al Ghurair",
        architect: "WWF",
        services: "MEP Design",
        area: "1,987.39 sqm",
        image: "/projects/b-g-1-private-villa-dubai,-uae.jpg",
        images: [
          "/projects/b-g-1-private-villa-dubai,-uae.jpg",
          "/projects/b-g-1-residential-villa-dubai,-uae.jpg"
        ],
        description: "B+G+1 Private Villa on Plot No. 2811328"
    },
    {
        title: "B+G+1 Residential Villa, Emirates Hills",
        slug: "b-g-1-residential-villa-emirates-hills",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Hall Park Property Holdings Limited (Mr. Nickolas Nahum & Mrs. Reiko Nahum)",
        architect: "WWF",
        services: "MEP Design",
        area: "1,119.00 sqm",
        image: "/projects/b-g-1-residential-villa-dubai,-uae.jpg",
        images: [
          "/projects/b-g-1-residential-villa-dubai,-uae.jpg",
          "/projects/b-g-1-private-villa-dubai,-uae.jpg",
          "/projects/g-1-basement-private-residential-villa-dubai,-uae.jpg"
        ],
        description: "B+G+1 Residential Villa on Plot No. 394530, Emirates Hills Phase 1"
    },
    {
        title: "G+1+Basement Private Residential Villa",
        slug: "g-1-basement-private-residential-villa",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Ali Mohamed Al Haji Ali Mulla Ibrahim Almarzooqi",
        architect: "WWF",
        services: "MEP Design",
        area: "1,590.00 sqm",
        image: "/projects/g-1-basement-private-residential-villa-dubai,-uae.jpg",
        images: [
          "/projects/g-1-basement-private-residential-villa-dubai,-uae.jpg",
          "/projects/g-1-beach-villa-dubai,-uae.jpg"
        ],
        description: "G+1 + Basement Private Residential Villa on Plot No. 2822658, Khawaneej 2nd"
    },
    {
        title: "G+1 Residential Villa, Palm Jumeirah",
        slug: "g-1-residential-villa-palm-jumeirah",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Vishal Arora and Vanita Mehra",
        architect: "WWF",
        services: "MEP Design",
        area: "",
        image: "/projects/g-1-residential-villa-dubai,-uae.png",
        images: [
          "/projects/g-1-residential-villa-dubai,-uae.png",
          "/projects/b-g-1-private-villa-dubai,-uae.jpg",
          "/projects/b-g-1-residential-villa-dubai,-uae.jpg"
        ],
        description: "G+1 Residential Villa on Plot No. PJFRN084, Palm Jumeirah"
    },
    {
        title: "G+1 Residential Villa, Nad Al Sheba",
        slug: "g-1-residential-villa-nad-al-sheba",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Mohamed Shara",
        architect: "WWF",
        services: "MEP Design",
        area: "1,457.73 sqm",
        image: "/projects/g-1-residential-villa-nad-al-sheba-fourth-dubai,-uae.jpg",
        images: [
          "/projects/g-1-residential-villa-nad-al-sheba-fourth-dubai,-uae.jpg",
          "/projects/g-1-residential-villa-dubai,-uae.png"
        ],
        description: "G+1 Residential Villa on Plot No. 6173720, Nad Al Sheba Fourth"
    },
    {
        title: "G+1 Villa - Maryam Ahmed Abdulla Almoosa",
        slug: "g-1-villa-maryam-ahmed-abdulla-almoosa",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Maryam Ahmed Abdulla Almoosa",
        architect: "ArchCorp",
        services: "MEP Design",
        area: "1,393.55 sqm",
        image: "/projects/g-1-villa-maryam-ahmed-abdulla-almoosa-dubai,-uae.jpg",
        images: [
          "/projects/g-1-villa-maryam-ahmed-abdulla-almoosa-dubai,-uae.jpg",
          "/projects/g-2-private-residential-villa-dubai,-uae.png"
        ],
        description: "G+1 Villa on Plot No. 3620352, Umm Suqeim 2"
    },
    {
        title: "G+1 Villa, Al Barsha",
        slug: "g-1-villa-al-barsha",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design & Supervision",
        client: "Reem Eyad Ahmad AlShukaili",
        architect: "FACE",
        services: "MEP Design & Supervision",
        area: "1,393.55 sqm",
        image: "/projects/g-1-villa-al-barsha-dubai,-uae-.png",
        images: [
          "/projects/g-1-villa-al-barsha-dubai,-uae-.png",
          "/projects/al-barsha-south.webp"
        ],
        description: "G+1 Villa on Plot No. 3760449, Al Barsha"
    },
    {
        title: "G+2 Private Residential Villa, Palm Jumeirah",
        slug: "g-2-private-residential-villa-palm-jumeirah",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Patrick Kreuzer",
        architect: "AMBB",
        services: "MEP Design",
        area: "978.71 sqm",
        image: "/projects/g-2-private-residential-villa-dubai,-uae.png",
        images: [
          "/projects/g-2-private-residential-villa-dubai,-uae.png",
          "/projects/b-g-1-private-villa-dubai,-uae.jpg",
          "/projects/b-g-1-residential-villa-dubai,-uae.jpg"
        ],
        description: "G+2 Private Residential Villa, Palm Jumeirah Frond J, Plot 15"
    },
    {
        title: "Modern Private Villa, Palm Jumeirah",
        slug: "modern-private-villa-palm-jumeirah",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Jamjoom Kamal Osman S",
        architect: "WWF / Kling",
        services: "MEP Design",
        area: "506.97 sqm",
        image: "/projects/modern-private-villa-on-palm-jumeirah-dubai,-uae.jpg",
        images: [
          "/projects/modern-private-villa-on-palm-jumeirah-dubai,-uae.jpg",
          "/projects/b-g-1-private-villa-dubai,-uae.jpg",
          "/projects/b-g-1-residential-villa-dubai,-uae.jpg"
        ],
        description: "Modern Private G+1 Residential Villa on Plot No. PJFRN023, Palm Jumeirah"
    },
    {
        title: "Nadd Al Shiba Villa",
        slug: "nadd-al-shiba-villa",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Humaid Ahmed Humaid Matar Al Tayer",
        architect: "IBDA",
        services: "MEP Design",
        area: "2,611.00 sqm",
        image: "/projects/nadd-al-shiba-villa-dubai,-uae.jpg",
        images: [
          "/projects/nadd-al-shiba-villa-dubai,-uae.jpg",
          "/projects/g-1-residential-villa-nad-al-sheba-fourth-dubai,-uae.jpg"
        ],
        description: "Nadd Al Shiba Villa"
    },
    {
        title: "Residential Villa (Villa Ali Al Salim)",
        slug: "residential-villa-villa-ali-al-salim",
        division: "mep",
        clientSector: "Villas",
        sector: "Villas",
        location: "Dubai, UAE",
        projectScale: "MEP Design",
        client: "Muna Essa Saleh Al Gurg",
        architect: "WWF",
        services: "MEP Design",
        area: "11,875.00 sqm",
        image: "/projects/residential-villa-villa-ali-al-salim-dubai,-uae.jpg",
        images: [
          "/projects/residential-villa-villa-ali-al-salim-dubai,-uae.jpg",
          "/projects/b-g-1-residential-villa-dubai,-uae.jpg"
        ],
        description: "G+1 Residential Villa on Plot No. 6150136, Nad Al Sheba Second"
    }
];

export const team = [
  {
    _id: 't1',
    name: 'Sanu Mathew',
    role: 'Founder & Managing Director',
    image: '/team/sanu-headshot.webp',
    linkedin: 'https://www.linkedin.com/in/sanum/',
    bio: `30 years' experience in Building Services Design, Site Supervision and Project Management of Electric and Power Systems. As one of the founders of the firm, Sanu continues to inspire the team with his passion for excellence and keenness for sustainable design.`,
  },
  {
    _id: 't5',
    name: 'Gurpreet Singh Maini',
    role: 'Managing Partner',
    image: '/team/Gurpreet Singh Maini-head.png',
    linkedin: '#',
    bio: 'Gurpreet Singh Maini is a dynamic, accomplished and result oriented Real Estate Professional with over 2.5 decades of experience in leading high-performance teams and successfully increasing efficiency, productivity and reducing costs. Adept in project planning, execution and delivering engineering solutions for multimillion-dollar Real Estate projects.',
  },
  {
    _id: 't2',
    name: 'Anand Krishnan',
    role: 'Director',
    image: '/team/Anand Krishnan-head.jpeg',
    linkedin: 'https://www.linkedin.com/in/anand-krishnan/',
    bio: 'Chartered Engineer with 36 years of experience in Building Services Design, Supervision and Project Management. He has nurtured key client relationships, acting as the primary interface on several projects. He revels in mentoring our team to the highest level of technical competency and self-reliance.',
  },
  {
    _id: 't3',
    name: 'Mohammed Al Horoub',
    role: 'Director',
    image: '/team/Mohammed Al Horoub-head.png',
    linkedin: '#',
    bio: 'Mechanical Engineer & LEED AP with 20 years in Design & Planning of MEP Services. A lead designer, he brings innovative and sustainable solutions to Office, Residential, Retail, and Hospital projects.',
  },
  {
    _id: 't4',
    name: 'Jaygopal Kottilil',
    role: 'Director',
    image: '/team/Jaygopal-head.png',
    linkedin: '#',
    bio: 'Qualified MEP Building Services professional with over 40 years of experience. He leads teams to deliver robust, safe, and cost-effective sustainable built environments.',
  }
];

export const offices = [
  {
    region: 'United Arab Emirates',
    cities: [{
      name: 'Dubai (Head Office)',
      address: '#303, Old Commercial Bank of Dubai Building\nOpp. Hamarain Centre\nAbu Baker Al Siddique Road, Deira\nP O Box 119146, Dubai, UAE',
      phone: '+971 42 564 882',
    }],
  },
  {
    region: 'Singapore',
    cities: [{
      name: 'Singapore',
      address: '10 Anson Road, Office# 29-10\nSingapore\nPO Box No. 079903',
      phone: '+65 9887 9761',
    }],
  },
  {
    region: 'India',
    cities: [
      {
        name: 'Kochi',
        address: 'No. 62/4892, Kachapilly Square\nMullassery Canal Road, Kochi\nKerala, India\nPO Box No. 682011',
      },
      {
        name: 'Bengaluru',
        address: 'No.57, U.P Complex, First floor\nDouble Road, Indiranagar 2nd Stage\nBangalore, Karnataka\nPO Box No 560038, India',
        phone: '+91 80-41284668',
      },
      {
        name: 'Mumbai',
        address: 'Aurum QParc, 8th Floor\nQ2 Building, Thane-Belapur Road\nGhansoli Navi Mumbai\nMaharashtra 400710',
      },
      {
        name: 'Gurugram',
        address: 'Augusta Point, Parvsnath Exotica\nLevel 3, Golf Course Road\nDLF Phase 5, Sector 53\nGurugram, Haryana - 122002',
      },
    ],
  },
];

