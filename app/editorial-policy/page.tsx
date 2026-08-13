import type { Metadata } from 'next';
import { FooterContentPage } from '../components/FooterContentPage';
import { getFooterPage, makeFooterPageMetadata } from '../../lib/footerPages';

export const metadata: Metadata = makeFooterPageMetadata('editorial-policy');

export default function EditorialPolicyPage() {
  return <FooterContentPage page={getFooterPage('editorial-policy')} />;
}

