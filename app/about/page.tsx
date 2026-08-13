import type { Metadata } from 'next';
import { FooterContentPage } from '../components/FooterContentPage';
import { getFooterPage, makeFooterPageMetadata } from '../../lib/footerPages';

export const metadata: Metadata = makeFooterPageMetadata('about');

export default function AboutPage() {
  return <FooterContentPage page={getFooterPage('about')} />;
}

