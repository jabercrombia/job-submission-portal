import "./globals.css";
import { Roboto } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/next"
import Footer from "./components/ux/Footer";
import Header from "./components/ux/Header";

export const metadata = {
  title: "Job Submission Portal",
  description: `A modern job submission portal where users can easily upload resumes, fill out personal details, and match their skills to job descriptions. Built with Next.js and Python, the platform offers fast, secure, and accurate resume scanning and job matching. Ideal for candidates and recruiters looking for a streamlined application process.`,
  keywords: ['Next.js', 'React', 'JavaScript','postgresql'],
  authors: [{ name: 'Justin Abercrombia', url: 'http://www.github.com/jabercrombia' }],
  creator: 'Justin Abercrombia',
  openGraph: {
    images: '/screenshot/homepage.png',
  },
  icons: {
    icon: `${process.env.SITEURL}/favicon.ico`,  
  },
};

const roboto = Roboto({
  weight: ['100','300','400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" className={roboto.className}>
        <body>
            <GoogleAnalytics gaId={process.env.GOOGLE_TRACKIND_ID || ''} />
            <div className="flex flex-col min-h-screen">
              <Header/>
                <main className="flex-grow">
                  {children}
                </main>
              <Footer />
            </div>
            <Analytics />
        </body>
      </html>
    </>
  );
}
