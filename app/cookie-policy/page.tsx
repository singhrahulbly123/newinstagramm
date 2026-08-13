import type { Metadata } from 'next';
import { FooterContentPage } from '../components/FooterContentPage';
import { getFooterPage, makeFooterPageMetadata } from '../../lib/footerPages';

export const metadata: Metadata = makeFooterPageMetadata('cookie-policy');

export default function CookiePolicyPage() {
  return <FooterContentPage page={getFooterPage('cookie-policy')} />;
}

