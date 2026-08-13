import type { Metadata } from 'next';
import { FooterContentPage } from '../components/FooterContentPage';
import { getFooterPage, makeFooterPageMetadata } from '../../lib/footerPages';

export const metadata: Metadata = makeFooterPageMetadata('terms-of-service');

export default function TermsOfServicePage() {
  return <FooterContentPage page={getFooterPage('terms-of-service')} />;
}

