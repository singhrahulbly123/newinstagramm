import Image from 'next/image';
import type { StoryProfile } from '../../types/story';

type Props = {
  profile: StoryProfile;
  sourceUrl: string;
  cached: boolean;
};

export default function StoryProfile({ profile, sourceUrl, cached }: Props) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700">
            <Image
              src={profile.avatarUrl}
              alt={`${profile.displayName} avatar`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-violet-600">Profile</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-slate-100">{profile.displayName}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">@{profile.username}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.5rem] bg-slate-50 p-4 text-center dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Stories</p>
            <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-100">{profile.storyCount}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4 text-center dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Followers</p>
            <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-100">{profile.followerCount ?? '—'}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4 text-center dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Following</p>
            <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-100">{profile.followingCount ?? '—'}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4 text-center dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Status</p>
            <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-100">{cached ? 'Cached' : 'Live'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold text-slate-950 dark:text-slate-100">Bio</p>
          <p className="mt-2 leading-7">{profile.biography || 'No public biography available.'}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold text-slate-950 dark:text-slate-100">Source</p>
          <p className="mt-2 break-all text-xs text-slate-600 dark:text-slate-400">{sourceUrl}</p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{profile.verified ? 'Verified creator profile' : 'Public profile'}</p>
        </div>
      </div>
    </section>
  );
}
