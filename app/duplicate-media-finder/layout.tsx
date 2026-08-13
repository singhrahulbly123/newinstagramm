import ToolSeoContent from '../components/ToolSeoContent';
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}<div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6"><ToolSeoContent tool="duplicates" /></div></>; }
