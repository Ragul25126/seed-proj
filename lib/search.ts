import { supabase } from '@/lib/supabase';
import { portfolio } from '@/lib/data';
import { fallbackPosts } from '@/lib/blog';

export type SearchCategory = 'All' | 'Projects' | 'Services' | 'Sectors' | 'Media' | 'About';

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'Project' | 'Service' | 'Sector' | 'Media' | 'About';
  description: string;
  href: string;
  subtitle?: string;
  badge?: string;
}

// Static Services Search Index
export const STATIC_SERVICES: SearchResultItem[] = [
  {
    id: 'mep-design',
    title: 'MEP Design',
    category: 'Service',
    subtitle: 'Mechanical, Electrical & Plumbing Engineering',
    description: 'Multidisciplinary teams delivering coordinated HVAC, electrical distribution, public health engineering, fire protection, and central plant design.',
    href: '/services#mep-design',
    badge: 'Core Service',
  },
  {
    id: 'mep-supervision',
    title: 'MEP Supervision',
    category: 'Service',
    subtitle: 'Quality Assurance & Site Construction',
    description: 'Site supervision, quality assurance, shop drawing review, testing & commissioning, snagging, and smooth project handover.',
    href: '/services#mep-supervision',
    badge: 'Site Execution',
  },
  {
    id: 'elv-ict-av',
    title: 'ELV / ICT & AV',
    category: 'Service',
    subtitle: 'Smart Buildings & Intelligent Infrastructure',
    description: 'ICT networks, structured cabling, Building Management Systems (BMS), smart building automation, data centres, and audio visual systems.',
    href: '/services#elv-ict-av',
    badge: 'Technology',
  },
  {
    id: 'security-systems',
    title: 'Security Systems',
    category: 'Service',
    subtitle: 'Integrated Building Security & Surveillance',
    description: 'CCTV surveillance, access control, intruder detection, perimeter security, command center design, and security risk assessment.',
    href: '/services#security-systems',
    badge: 'Security',
  },
  {
    id: 'fire-protection',
    title: 'Fire Protection & Life Safety',
    category: 'Service',
    subtitle: 'Life Safety & Code Compliance',
    description: 'Smoke control management, automatic fire sprinkler systems, fire alarm detection, life safety strategies, and code compliance.',
    href: '/services#fire-protection',
    badge: 'Safety',
  },
  {
    id: 'sustainability',
    title: 'Sustainability & Energy Consulting',
    category: 'Service',
    subtitle: 'LEED, Estidama & Energy Efficiency',
    description: 'Energy modeling, LEED & Estidama certifications, carbon footprint reduction, renewable energy integration, and passive building design.',
    href: '/services#sustainability',
    badge: 'Green Building',
  },
  {
    id: 'bim-coordination',
    title: 'BIM & Digital Delivery',
    category: 'Service',
    subtitle: 'Building Information Modeling',
    description: '3D BIM modeling, clash detection, 4D scheduling, 5D cost estimation, and digital twin asset management integration.',
    href: '/services#bim-coordination',
    badge: 'Digital Engineering',
  },
];

// Static Sectors Search Index
export const STATIC_SECTORS: SearchResultItem[] = [
  {
    id: 'hospitality',
    title: 'Hospitality',
    category: 'Sector',
    subtitle: 'Luxury Hotels & Resorts',
    description: 'Engineering luxury hospitality environments where guest comfort, operational efficiency, and sustainability work seamlessly together.',
    href: '/sectors#hospitality',
    badge: 'Key Sector',
  },
  {
    id: 'residential',
    title: 'Residential',
    category: 'Sector',
    subtitle: 'Luxury Towers & Master-planned Communities',
    description: 'Designing high-performance residential towers, villas, and mixed-use communities prioritising comfort, energy efficiency, and reliability.',
    href: '/sectors#residential',
    badge: 'Key Sector',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    category: 'Sector',
    subtitle: 'High-Rise Office Towers & Commercial Hubs',
    description: 'Intelligent workplaces and commercial headquarters designed for occupant wellbeing, energy performance, and future adaptability.',
    href: '/sectors#commercial',
    badge: 'Key Sector',
  },
  {
    id: 'education',
    title: 'Education',
    category: 'Sector',
    subtitle: 'Universities, Schools & Research Campuses',
    description: 'Engineering educational environments that are safe, flexible, and built for long-term learning and campus sustainability.',
    href: '/sectors#education',
    badge: 'Public Sector',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    category: 'Sector',
    subtitle: 'Hospitals & Medical Centers',
    description: 'Resilient MEP engineering for hospitals and clinical facilities where infection control, ventilation, and uninterrupted power are critical.',
    href: '/sectors#healthcare',
    badge: 'Critical Infrastructure',
  },
  {
    id: 'retail',
    title: 'Retail',
    category: 'Sector',
    subtitle: 'Shopping Malls & Lifestyle Destinations',
    description: 'Engineering retail destinations and shopping malls that enhance customer experience while maintaining low operational energy overheads.',
    href: '/sectors#retail',
    badge: 'Commercial Sector',
  },
  {
    id: 'sports-stadiums',
    title: 'Sports & Stadiums',
    category: 'Sector',
    subtitle: 'Arenas & High-Capacity Venues',
    description: 'High-capacity venue MEP design, crowd ventilation, field lighting, floodlight systems, and emergency evacuation management.',
    href: '/sectors#sports-stadiums',
    badge: 'Specialized Sector',
  },
];

// Static About Search Index
export const STATIC_ABOUT: SearchResultItem[] = [
  {
    id: 'about-overview',
    title: 'About SEED Engineering Consultants',
    category: 'About',
    subtitle: 'Global MEP Engineering Consultancy',
    description: 'Established in 2005, SEED provides integrated MEP engineering design, supervision, sustainability consulting, BIM, and commissioning for landmark developments.',
    href: '/about',
    badge: 'Company Overview',
  },
  {
    id: 'about-leadership',
    title: 'Leadership & Management Team',
    category: 'About',
    subtitle: 'Sanu Mathew & Executive Leadership',
    description: 'Led by Founder & Managing Director Sanu Mathew alongside regional leaders in Dubai, Singapore, and India bringing 20+ years of engineering mastery.',
    href: '/about#leadership',
    badge: 'Leadership',
  },
  {
    id: 'about-awards',
    title: 'Awards & Recognitions',
    category: 'About',
    subtitle: 'Big Project ME & Powerlist Awards',
    description: 'Honoured with Big Project ME MEP Project of the Year (Wasl Tower), Top MEP Consultants Powerlist, and regional engineering excellence accolades.',
    href: '/about#awards',
    badge: 'Accolades',
  },
  {
    id: 'about-sustainability',
    title: 'Sustainable Energy Efficient Design Philosophy',
    category: 'About',
    subtitle: 'SEED Green Building Commitment',
    description: 'SEED stands for Sustainable Energy Efficient Design, committed to low-carbon HVAC, district cooling, solar thermal, and renewable integration.',
    href: '/about#sustainability',
    badge: 'Sustainability',
  },
  {
    id: 'about-global-footprint',
    title: 'Global Offices & Regional Design Hubs',
    category: 'About',
    subtitle: 'Dubai, Singapore, Mumbai, Kochi, Bengaluru, Gurugram, Pune',
    description: 'Operating across 7 global design hubs supporting complex mega-projects in the Middle East, Southeast Asia, Africa, and India.',
    href: '/about#offices',
    badge: 'Global Offices',
  },
];

// Static Media Search Index
export function getMediaSearchItems(): SearchResultItem[] {
  return fallbackPosts.map((post) => ({
    id: `media-${post.slug}`,
    title: post.title,
    category: 'Media',
    subtitle: `${post.category} • ${new Date(post.publishedAt).getFullYear()}`,
    description: post.excerpt || post.content.substring(0, 160) + '...',
    href: `/blog/${post.slug}`,
    badge: post.category,
  }));
}

/**
 * Perform server or client search across Supabase projects and static sections.
 */
export async function searchWebsiteContent(query: string): Promise<SearchResultItem[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const results: SearchResultItem[] = [];

  // 1. Search Supabase Projects (or fallback portfolio)
  try {
    const { data: dbProjects, error } = await supabase
      .from('projects')
      .select('id, title, slug, description, full_description, location, client_sector, services, project_scale, client')
      .or(`title.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,full_description.ilike.%${cleanQuery}%,location.ilike.%${cleanQuery}%,client_sector.ilike.%${cleanQuery}%,services.ilike.%${cleanQuery}%`)
      .limit(10);

    if (!error && dbProjects && dbProjects.length > 0) {
      dbProjects.forEach((p: any) => {
        results.push({
          id: `proj-${p.id || p.slug}`,
          title: p.title,
          category: 'Project',
          subtitle: `${p.client_sector || p.location || 'MEP Project'}${p.location ? ` • ${p.location}` : ''}`,
          description: p.description || p.full_description?.substring(0, 160) || `SEED engineering delivery for ${p.title}`,
          href: `/projects/${p.slug}`,
          badge: p.client_sector || 'Project',
        });
      });
    } else {
      // Fallback search over portfolio in lib/data.ts if DB returns no results or is unreachable
      const matchedPortfolio = portfolio.filter((p) => {
        const text = `${p.title} ${p.description} ${p.location} ${p.clientSector} ${p.services || ''} ${p.client || ''}`.toLowerCase();
        return text.includes(cleanQuery);
      });

      matchedPortfolio.forEach((p) => {
        results.push({
          id: `proj-fallback-${p.slug}`,
          title: p.title,
          category: 'Project',
          subtitle: `${p.clientSector || p.sector || 'MEP Project'} • ${p.location}`,
          description: p.description || `SEED MEP engineering for ${p.title} in ${p.location}.`,
          href: `/projects/${p.slug}`,
          badge: p.clientSector || p.sector || 'Project',
        });
      });
    }
  } catch (err) {
    console.warn('[SEED Search] Supabase search error, falling back to static portfolio:', err);
    const matchedPortfolio = portfolio.filter((p) => {
      const text = `${p.title} ${p.description} ${p.location} ${p.clientSector} ${p.services || ''} ${p.client || ''}`.toLowerCase();
      return text.includes(cleanQuery);
    });

    matchedPortfolio.forEach((p) => {
      results.push({
        id: `proj-fallback-${p.slug}`,
        title: p.title,
        category: 'Project',
        subtitle: `${p.clientSector || p.sector || 'MEP Project'} • ${p.location}`,
        description: p.description || `SEED MEP engineering for ${p.title} in ${p.location}.`,
        href: `/projects/${p.slug}`,
        badge: p.clientSector || p.sector || 'Project',
      });
    });
  }

  // 2. Search Services
  STATIC_SERVICES.forEach((item) => {
    const text = `${item.title} ${item.subtitle || ''} ${item.description} ${item.badge || ''}`.toLowerCase();
    if (text.includes(cleanQuery)) {
      results.push(item);
    }
  });

  // 3. Search Sectors
  STATIC_SECTORS.forEach((item) => {
    const text = `${item.title} ${item.subtitle || ''} ${item.description} ${item.badge || ''}`.toLowerCase();
    if (text.includes(cleanQuery)) {
      results.push(item);
    }
  });

  // 4. Search Media
  getMediaSearchItems().forEach((item) => {
    const text = `${item.title} ${item.subtitle || ''} ${item.description}`.toLowerCase();
    if (text.includes(cleanQuery)) {
      results.push(item);
    }
  });

  // 5. Search About
  STATIC_ABOUT.forEach((item) => {
    const text = `${item.title} ${item.subtitle || ''} ${item.description}`.toLowerCase();
    if (text.includes(cleanQuery)) {
      results.push(item);
    }
  });

  return results;
}
