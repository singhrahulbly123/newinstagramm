import type { StoryItem } from '../../types/story';
import StoryCard from './StoryCard';

type Props = {
  stories: StoryItem[];
  onPreview: (item: StoryItem) => void;
  onDownload: (item: StoryItem) => void;
};

export default function StoryGrid({ stories, onPreview, onDownload }: Props) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {stories.map((item) => (
        <StoryCard key={item.id} item={item} onPreview={onPreview} onDownload={onDownload} />
      ))}
    </div>
  );
}
