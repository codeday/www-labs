import React from 'react';
import { NextSeo } from 'next-seo';

export default () => (
  <NextSeo
    description="Due to the Covid-19 lockdown, many students are without summer internships which can help them further their journeys in CS. We're hosting a 100% online internship. We need the support of tech industry professionals to make it happen."
    openGraph={{
      images: [
        {
          url: 'https://img.codeday.org/o/7/c/7cmscrccv78tysrpf3vtozre96bgg7a3emnqeq16iw7ytghuj296w6r9d8pnvahkfa.png',
        }
      ]
    }}
  />
)
