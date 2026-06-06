import type { StoryProfile } from '../../types/story';

type Props = {
  profile: StoryProfile;
  sourceUrl: string;
  cached: boolean;
};

export default function StoryProfile({ profile, sourceUrl, cached }: Props) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <img src={profile.avatarUrl} alt={`${profile.displayName} avatar`} className="h-20 w-20 rounded-3xl border border-slate-200 object-cover" />
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-violet-600">Profile</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">{profile.displayName}</h2>
            <p className="mt-1 text-sm text-slate-600">@{profile.username}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[1.5rem] bg-slate-50 p-4 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Stories</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{profile.storyCount}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Followers</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{profile.followerCount ?? '—'}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Following</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{profile.followingCount ?? '—'}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Status</p>
            <p className="mt-2 text-xl font-semibold text-slate-950">{cached ? 'Cached' : 'Live'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-950">Bio</p>
          <p className="mt-2 leading-7">{profile.biography || 'No public biography available.'}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-950">Source</p>
          <p className="mt-2 break-all text-xs text-slate-600">{sourceUrl}</p>
          <p className="mt-4 text-sm text-slate-600">{profile.verified ? 'Verified creator profile' : 'Public profile'}</p>
        </div>
      </div>
    </section>
  );
}
