import { z, defineCollection } from 'astro:content';

const servicepageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    heroTitle: z.string(),
    heroDescription: z.string(),
    heroParagraph: z.string(),
    sertvicetitle: z.string(),
    sertvicedisc: z.string(),
    whychoosetitle: z.string(),
    whychoosedisc: z.string(),
    resultdriventitle: z.string(),
    resultdrivenimg: z.string(),
    resultdrivenparap1: z.string(),
    resultdrivenparap2: z.string(),
    resultdrivenparap3: z.string(),
    faqmaintitle: z.string(),
    industrytitle: z.string(),
    industrydisc: z.string(),
    features: z.array(z.object({
      title: z.string(),
      description: z.string()
    })),
    ourservices: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional(),
      alt: z.string().optional()
    })),
    whyChooseUs: z.array(z.object({
      number: z.number(),
      title: z.string(),
      description: z.string()
    })),

    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })),
    industries: z.array(z.object({
      title: z.string(),
      img: z.string(),
      categories: z.array(z.string())
    })),
    callToAction: z.object({
      title: z.string(),
      description: z.string()
    }),
    seo: z.object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      keywords: z.array(z.string()).optional()
    })
  })
});

export const collections = {
  'servicepage': servicepageCollection
};