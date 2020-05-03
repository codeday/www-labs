import React from 'react';
import { NextSeo } from 'next-seo';

export default () => (
  <NextSeo
    description="Due to the Covid-19 lockdown, many students are without summer internships which can help them further their journeys in CS. We're hosting a 100% online internship. We need the support of tech industry professionals to make it happen."
    openGraph={{
      images: [
        {
          url: "https://img.codeday.org/1200x700/q/p/qp1wmuzr9knezo9vtymbcc3ytopxv3fnzr6kdzvmh34wjamjd8dstokuj1sqae749j.jpg",
        }
      ]
    }}
  />
)
