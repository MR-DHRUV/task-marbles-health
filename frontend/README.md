## Description
I have used a simple approach to process the data and display it in table and charts. I have created a javascript function that pre-processes the data and extracts the required information. For the table, I have used the @nextui-org/react library to create a table and recharts library to create charts.

<strong>During the pre-processing step aggregated and yearly statistics are calculated and cached in a state to prevent re-iteration over the data.</strong>


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Local Development
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.