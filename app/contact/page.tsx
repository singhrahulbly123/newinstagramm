import type { Metadata } from 'next';
import { FooterContentPage } from '../components/FooterContentPage';
import { getFooterPage, makeFooterPageMetadata } from '../../lib/footerPages';

export const metadata: Metadata = makeFooterPageMetadata('contact');

export default function ContactPage() {
  return <FooterContentPage page={getFooterPage('contact')} />;
}

