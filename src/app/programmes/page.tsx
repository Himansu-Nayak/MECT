import React from "react";
import Link from "next/link";
import Image from "next/image";
import { createPageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatutoryStrip } from "@/components/layout/StatutoryStrip";
import { MECT_ORG } from "@/config/org";
import { FreeEducationSection } from "@/components/sections/FreeEducationSection";
import {
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Scissors,
  Droplets,
  Utensils,
  Heart,
  HeartHandshake,
  Briefcase,
  MapPin,
  Users,
  Info,
  Calendar,
} from "lucide-react";

export const metadata = createPageMetadata({
  title: "Our Work & Community Programmes",
  description:
    "Explore MECT's verified community programmes: education, women's livelihoods, sports, safe drinking water, food relief, community welfare, and higher education in Odisha.",
  path: "/programmes",
  ogImage: "/images/og-programmes.png",
});

interface ProgrammeSectionData {
  id: string;
  number: string;
  badge: string;
  tag: string;
  name: string;
  tagline: string;
  whatWeDo: string[];
  where: string;
  whoBenefits: string;
  howToHelp: string;
  recordedFigure: {
    value: string;
    label: string;
    note: string;
  };
  photos: Array<{
    src: string;
    alt: string;
    caption: string;
  }>;
  icon: React.ComponentType<{ className?: string }>;
}

const PROGRAMMES_DATA: ProgrammeSectionData[] = [
  {
    id: "education",
    number: "01",
    badge: "Active Community Programme",
    tag: "Shiksha Setu",
    name: "Education & Learning Support",
    tagline: "Bridging secondary dropout gaps for underprivileged and tribal students in Balangir.",
    whatWeDo: [
      "Operate daily after-school remedial learning centres in rural villages to strengthen maths, science, and English fundamentals.",
      "Distribute free annual sets of textbooks, notebooks, study guides, and geometry boxes to disadvantaged students.",
      "Provide exam orientation and guidance for Class 10 board examinations and +2 stream admissions.",
      "Support quiet study spaces and peer-learning groups for students living in congested single-room dwellings.",
    ],
    where: "Balangir and Puintala blocks, Balangir District, Western Odisha.",
    whoBenefits: "Rural school students from daily-wage earner families, tribal households, and economically weaker sections (EWS).",
    howToHelp: "Volunteer as a weekend subject tutor, sponsor textbook sets for a village batch, or donate stationery supplies.",
    recordedFigure: {
      value: "350+ Entries",
      label: "Student Participation Entries (FY 2023–24)",
      note: "Recorded participation entries across academic sessions, not necessarily 350 unique students.",
    },
    photos: [
      {
        src: "/images/hero/mect-civic-pledge-classroom.jpg",
        alt: "MECT community classroom students participating in remedial study session",
        caption: "Community remedial classroom in Balangir district.",
      },
      {
        src: "/images/hero/illustrative-community-library-reading.webp",
        alt: "Students reviewing study materials in Balangir learning circle",
        caption: "Textbook and study guide distribution for rural students.",
      },
    ],
    icon: GraduationCap,
  },
  {
    id: "women-empowerment",
    number: "02",
    badge: "Vocational Livelihood",
    tag: "Swavalamban",
    name: "Women's Vocational Skills & Livelihood Training",
    tagline: "Equipping rural women with certified tailoring and apparel skills for independent household income.",
    whatWeDo: [
      "Conduct structured, multi-month vocational courses in garment stitching, modern pattern cutting, and decorative embroidery.",
      "Supply basic toolkits (tailoring scissors, measuring tapes, drafting materials) to trainees upon course completion.",
      "Teach practical bookkeeping, small order pricing, and digital payment basics for home-based tailoring services.",
      "Encourage collective order fulfillment for local school uniforms and village community garments.",
    ],
    where: "MECT Vocational Training Centre, Rugudipara, Balangir, Odisha.",
    whoBenefits: "Rural women, young widows, self-help group (SHG) members, and female heads of vulnerable households.",
    howToHelp: "Sponsor a sewing machine toolkit, fund vocational training supplies, or mentor women on micro-enterprise bookkeeping.",
    recordedFigure: {
      value: "120+ Enrolments",
      label: "Course Enrolments (FY 2021–23)",
      note: "Cumulative vocational course enrolments across training batches, not necessarily 120 uniquely certified women.",
    },
    photos: [
      {
        src: "/images/hero/mect-women-empowerment-seminar.webp",
        alt: "MECT women vocational training session in Balangir",
        caption: "Vocational skills workshop in Rugudipara, Balangir.",
      },
      {
        src: "/images/hero/illustrative-women-self-help-group.webp",
        alt: "Rural women reviewing textile work in self-help group",
        caption: "Self-reliance and vocational sewing group.",
      },
    ],
    icon: Scissors,
  },
  {
    id: "sports-extracurricular",
    number: "03",
    badge: "Youth Fitness & Civic Teamwork",
    tag: "Kreeda & Sanskruti",
    name: "Sports & Extracurricular Development",
    tagline: "Fostering physical health, athletic discipline, leadership, and regional cultural participation.",
    whatWeDo: [
      "Organize rural youth athletic meets, local football and volleyball friendly tournaments, and kho-kho / kabaddi matches.",
      "Distribute basic sports equipment (footballs, volleyball nets, athletic footwear, jerseys) to underserved rural teams.",
      "Promote cultural folk arts, debating, essay contests, and regional Odishan performing arts among youth.",
      "Conduct basic physical fitness, stretching, and nutrition awareness sessions in collaboration with local educators.",
    ],
    where: "School grounds and community playfields across Balangir and surrounding rural blocks.",
    whoBenefits: "Rural school-going youth, athletic young adults, and grassroots community sports clubs.",
    howToHelp: "Contribute sports kits, sponsor regional sports tournaments, or volunteer as a coach or athletic mentor.",
    recordedFigure: {
      value: "Community Meets",
      label: "Annual Youth Sports Meets",
      note: "Annual participatory tournaments; director planning notes reference 70% sports allocation subject to Board budget approval.",
    },
    photos: [
      {
        src: "/images/hero/mect-faculty-puintala-campus.jpg",
        alt: "MECT youth engagement and campus sports activities",
        caption: "Youth community sports and athletic meet in Western Odisha.",
      },
    ],
    icon: Award,
  },
  {
    id: "water",
    number: "04",
    badge: "Active Community Programme",
    tag: "Jal Seva",
    name: "Safe Water & Summer Hydration",
    tagline: "Protecting commuters and laborers from dehydration during severe summer heatwaves.",
    whatWeDo: [
      "Set up clean drinking water kiosks (Jal Seva Chhatras) during peak summer months when temperatures exceed 42°C in Western Odisha.",
      "Ensure daily hygienic cleaning, earthen pot refills, and covered potable water storage at high-footfall locations.",
      "Provide oral rehydration salts (ORS) packets and electrolyte solution to at-risk outdoor laborers and transit passengers.",
      "Promote clean water handling and hygiene awareness to help prevent waterborne seasonal illnesses.",
    ],
    where: "Bus terminals, hospital vicinities, main crossroads, and market centres in Balangir.",
    whoBenefits: "Daily-wage manual workers, rickshaw pullers, transit passengers, rural patients, and elderly citizens.",
    howToHelp: "Support a seasonal water kiosk, supply food-grade earthen storage pots, or volunteer for daily kiosk maintenance.",
    recordedFigure: {
      value: "10,000+ Instances",
      label: "Service Instances Recorded",
      note: "Recorded drinking water and relief service instances, not necessarily 10,000 unique individuals.",
    },
    photos: [
      {
        src: "/images/hero/mect-clean-water-hygiene-demo.webp",
        alt: "Clean drinking water distribution point during summer in Balangir",
        caption: "Jal Seva community drinking water station in Balangir.",
      },
    ],
    icon: Droplets,
  },
  {
    id: "food-relief",
    number: "05",
    badge: "Hospital & Destitute Relief",
    tag: "Jan Ahar",
    name: "Food Relief & Nutrition",
    tagline: "Providing warm, wholesome meals to impoverished patient attendants and destitute families.",
    whatWeDo: [
      "Distribute freshly prepared, hygienic meals (rice, dalma/dal, and mixed vegetable curry) outside district hospital wards.",
      "Support family attendants traveling from distant tribal villages who exhaust their resources on medicines and transport.",
      "Distribute emergency dry food rations (rice, pulses, flattened rice, oil, salt) during localized crises or heavy rains.",
      "Maintain strict cleanliness in meal preparation and volunteer hand-to-hand distribution with dignity.",
    ],
    where: "Balangir District Headquarters Hospital vicinity and adjoining transit shelters.",
    whoBenefits: "Underprivileged patient attendants, rural daily-wage laborers, disabled citizens, and destitute elders.",
    howToHelp: "Contribute grocery staples (rice, pulses, oil), sponsor a daily community meal drive, or volunteer in food distribution.",
    recordedFigure: {
      value: "Daily Drives",
      label: "Hygienic Hospital Meal Drives",
      note: "Fresh meal distributions organized outside hospital wards for attendants traveling from remote rural villages.",
    },
    photos: [
      {
        src: "/images/hero/mect-public-health-awareness.jpg",
        alt: "MECT community food relief and meal drive in Balangir",
        caption: "Community meal distribution for hospital patient attendants.",
      },
    ],
    icon: Utensils,
  },
  {
    id: "community-welfare",
    number: "06",
    badge: "Grassroots Assistance",
    tag: "Samaj Kalyan",
    name: "Community Welfare & Rural Relief",
    tagline: "Direct essentials, winter warmth drives, and citizen legal entitlement awareness.",
    whatWeDo: [
      "Conduct annual winter warmth drives distributing heavy blankets and warm clothing to elderly and homeless citizens.",
      "Provide emergency relief supplies (tarpaulins, dry rations, first-aid basics) during seasonal floods or sudden weather distress.",
      "Organize village legal awareness sessions helping rural citizens understand welfare schemes, pension rights, and ration cards.",
      "Coordinate with local gram panchayats to identify isolated families lacking social protection.",
    ],
    where: "Rural village settlements, tribal hamlets, and urban periphery clusters in Balangir district.",
    whoBenefits: "Vulnerable elders, widows, disabled persons, landless laborers, and families facing sudden adversity.",
    howToHelp: "Donate winter blankets, contribute emergency relief kits, or volunteer legal/social work guidance.",
    recordedFigure: {
      value: "Seasonal Aid",
      label: "Annual Blanket & Relief Drives",
      note: "Direct hand-to-hand distribution of blankets and essentials across remote village settlements.",
    },
    photos: [
      {
        src: "/images/hero/mect-legal-literacy-session.webp",
        alt: "MECT community welfare and citizen awareness camp in village",
        caption: "Community welfare and rural entitlement camp in Western Odisha.",
      },
    ],
    icon: HeartHandshake,
  },
  {
    id: "higher-education",
    number: "07",
    badge: "Educational Scholarships",
    tag: "Pratibha Fellowship",
    name: "Higher Education & Scholarships",
    tagline: "Merit-cum-need tuition fee grants and academic mentorship for higher technical and degree education.",
    whatWeDo: [
      "Formal institutional framework designed to bridge college tuition fees for meritorious students from poor households.",
      "Direct bank transfer policy: approved grants are paid directly to accredited college accounts via NEFT/RTGS, never via cash.",
      "Pair scholarship recipients with experienced volunteer mentors for career counseling and competitive entrance guidance.",
      "Maintain a strict zero-fee policy: MECT never charges application, registration, or processing fees.",
    ],
    where: "Accredited polytechnics, degree colleges, and universities across Odisha.",
    whoBenefits: "Financially challenged students pursuing higher technical, arts, science, and vocational degree programmes.",
    howToHelp: "Pledge an institutional scholarship seat, volunteer as an academic mentor, or sponsor competitive entrance study books.",
    recordedFigure: {
      value: "Up to 200",
      label: "Proposed Scholarship Target",
      note: "Proposed target for up to 200 students, subject to formal Board sanction and confirmed funding. Zero funded places currently active.",
    },
    photos: [
      {
        src: "/images/hero/mect-trustees-campus-walk.webp",
        alt: "MECT educational campus and student guidance walk",
        caption: "Educational campus guidance and student support.",
      },
    ],
    icon: BookOpen,
  },
];

export default function ProgrammesPage() {
  return (
    <div className="flex flex-col w-full bg-cream text-ink">
      {/* 1. Page Hero */}
      <PageHero
        title="Our Work & Community Programmes"
        description="Explore MECT's verified community programmes: education, women's livelihoods, youth sports, safe drinking water, food relief, community welfare, and higher education across Odisha."
        breadcrumbs={[{ label: "Programmes" }]}
        actions={
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="#education">
              <Button variant="gold" size="sm">
                <span>Explore Programmes</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="dark-outline" size="sm">
                <Heart className="w-3.5 h-3.5 mr-1 text-cream fill-current" />
                <span>Support MECT</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* 2. Anchor Jump Bar */}
      <nav
        aria-label="Programme section navigation"
        className="sticky top-16 z-20 bg-forest-deep text-cream border-y border-sand/30 py-3 shadow-sm print:hidden"
      >
        <Container size="default">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-semibold">
            <span className="text-sand shrink-0 uppercase tracking-wider text-[10px] font-bold mr-1">
              Jump To:
            </span>
            {PROGRAMMES_DATA.map((prog) => (
              <a
                key={prog.id}
                href={`#${prog.id}`}
                className="shrink-0 px-3 py-1 rounded-full bg-forest text-cream/95 hover:bg-sand hover:text-forest-deep transition-colors"
              >
                {prog.name.split("&")[0].trim()}
              </a>
            ))}
            <a
              href="#free-education-200"
              className="shrink-0 px-3 py-1 rounded-full bg-sand text-forest-deep font-bold hover:bg-cream transition-colors"
            >
              200-Student Target
            </a>
          </div>
        </Container>
      </nav>

      {/* Flagship Section: Free Education Target for 200 Students */}
      <div id="free-education-200" className="scroll-mt-28">
        <FreeEducationSection />
      </div>

      {/* 3. The 7 Full Programme Sections */}
      <div className="py-12 space-y-20 md:space-y-28">
        {PROGRAMMES_DATA.map((prog, index) => {
          const Icon = prog.icon;
          const isEven = index % 2 === 0;

          return (
            <section
              key={prog.id}
              id={prog.id}
              className="scroll-mt-28 py-8 border-b border-border-warm last:border-b-0"
              aria-labelledby={`heading-${prog.id}`}
            >
              <Container size="default">
                <div className="space-y-10">
                  {/* Section Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand/30 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-forest">
                        {prog.number}
                      </span>
                      <Badge variant="contrast-gold">{prog.tag}</Badge>
                      <span className="text-xs text-forest font-bold font-sans uppercase tracking-wider">
                        {prog.badge}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-forest font-bold font-sans">
                      <ShieldCheck className="w-4 h-4 text-forest" />
                      <span>Documented MECT Programme</span>
                    </span>
                  </div>

                  {/* Headline & Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-forest text-cream flex items-center justify-center shrink-0 shadow-xs">
                          <Icon className="w-6 h-6 text-sand" />
                        </div>
                        <div>
                          <h2
                            id={`heading-${prog.id}`}
                            className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight"
                          >
                            {prog.name}
                          </h2>
                          <p className="text-sm font-semibold text-terracotta-dark font-sans mt-1">
                            {prog.tagline}
                          </p>
                        </div>
                      </div>

                      {/* What We Do */}
                      <div className="pt-2 space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-forest font-sans">
                          What We Do:
                        </h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm text-ink-muted">
                          {prog.whatWeDo.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Where & Who Benefits */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                        <div className="p-4 bg-sand/15 rounded-lg border border-sand/30 space-y-1">
                          <div className="flex items-center gap-1.5 text-forest text-xs font-bold uppercase tracking-wider">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Where We Work:</span>
                          </div>
                          <p className="text-xs sm:text-sm text-ink-muted">{prog.where}</p>
                        </div>

                        <div className="p-4 bg-sand/15 rounded-lg border border-sand/30 space-y-1">
                          <div className="flex items-center gap-1.5 text-forest text-xs font-bold uppercase tracking-wider">
                            <Users className="w-3.5 h-3.5" />
                            <span>Who Benefits:</span>
                          </div>
                          <p className="text-xs sm:text-sm text-ink-muted">{prog.whoBenefits}</p>
                        </div>
                      </div>

                      {/* How to Help */}
                      <div className="p-4 bg-cream rounded-lg border border-sand/40 space-y-2">
                        <div className="flex items-center gap-1.5 text-forest font-bold text-xs uppercase tracking-wider">
                          <Heart className="w-3.5 h-3.5 text-terracotta-dark" />
                          <span>How You Can Help:</span>
                        </div>
                        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                          {prog.howToHelp}
                        </p>
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <Link href="/donate">
                            <Button variant="gold" size="sm" className="font-bold">
                              <span>Support This Programme</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </Button>
                          </Link>
                          <Link href="/contact">
                            <Button variant="outline" size="sm">
                              <span>Inquire / Partner</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Photo & Recorded Activity Stat */}
                    <div className="lg:col-span-4 space-y-4">
                      {/* Recorded Activity Metric */}
                      <div className="p-5 bg-sand/20 rounded-xl border border-sand/40 text-center space-y-2 shadow-xs">
                        <span className="text-xs font-bold text-forest uppercase tracking-wider block">
                          {prog.recordedFigure.label}
                        </span>
                        <span className="font-serif text-3xl sm:text-4xl font-bold text-forest block">
                          {prog.recordedFigure.value}
                        </span>
                        <p className="text-[11px] text-ink-muted leading-relaxed font-sans pt-1 border-t border-sand/30">
                          <Info className="w-3 h-3 inline mr-1 text-forest shrink-0" />
                          {prog.recordedFigure.note}
                        </p>
                      </div>

                      {/* Real Programme Photos */}
                      <div className="space-y-3">
                        {prog.photos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            className="rounded-xl overflow-hidden border border-sand/40 shadow-xs bg-white"
                          >
                            <div className="relative aspect-[16/10] w-full bg-sand/10">
                              <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 380px"
                                className="object-cover"
                              />
                            </div>
                            <div className="p-2.5 bg-cream text-[11px] text-ink-muted border-t border-sand/20 italic">
                              {photo.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      {/* 4. Statutory Transparency Strip */}
      <StatutoryStrip />
    </div>
  );
}
