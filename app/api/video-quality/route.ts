import { execFile } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';
import ffprobe from 'ffprobe-static';
import { extractInstagramVideoUrl, normalizeInstagramUrl } from '../../../lib/download';

export const runtime = 'nodejs';
export const maxDuration = 30;
const execFileAsync = promisify(execFile);
const reelRegex = /^https?:\/\/(?:www\.)?instagram\.com\/(?:reel|reels|p|tv)\/[A-Za-z0-9_-]+(?:[/?].*)?$/i;
const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36', Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9', Referer: 'https://www.instagram.com/' };

function fpsFromRate(rate?: string) { if (!rate) return null; const parts=rate.split('/'); const numerator=Number(parts[0]); const denominator=Number(parts[1]||1); return numerator && denominator ? Math.round((numerator/denominator)*100)/100 : null; }
function numberOrNull(value: unknown) { const parsed=Number(value); return Number.isFinite(parsed)&&parsed>=0?parsed:null; }

export async function POST(request:Request){
  const body=await request.json().catch(()=>null); const originalUrl=typeof body?.url==='string'?body.url.trim():'';
  if(!reelRegex.test(originalUrl)) return NextResponse.json({error:'Paste a valid public Instagram Reel or video-post URL.'},{status:400});
  const pageUrl=normalizeInstagramUrl(originalUrl); let videoUrl='';
  for(const url of [pageUrl,`${pageUrl.replace(/\/+$/,'')}/embed/`]){const response=await fetch(url,{headers,cache:'no-store'}).catch(()=>null);if(!response?.ok)continue;videoUrl=extractInstagramVideoUrl(await response.text(),originalUrl)||'';if(videoUrl)break;}
  if(!videoUrl)return NextResponse.json({error:'No public video file was available for this link.'},{status:422});
  try{
    const {stdout}=await execFileAsync(ffprobe.path,['-v','error','-show_entries','stream=codec_type,codec_name,width,height,r_frame_rate,bit_rate:format=duration,size,bit_rate,format_name','-of','json',videoUrl],{timeout:25000,maxBuffer:1024*1024});
    const probe=JSON.parse(stdout) as {streams?:Array<Record<string,string|number>>;format?:Record<string,string|number>};
    const stream=probe.streams?.find(item=>item.codec_type==='video')||{}; const format=probe.format||{};
    const width=numberOrNull(stream.width),height=numberOrNull(stream.height),duration=numberOrNull(format.duration),size=numberOrNull(format.size),bitrate=numberOrNull(stream.bit_rate)||numberOrNull(format.bit_rate),fps=fpsFromRate(String(stream.r_frame_rate||''));
    return NextResponse.json({success:true,previewUrl:`/api/proxy?url=${encodeURIComponent(videoUrl)}`,metrics:{width,height,resolution:width&&height?`${width} × ${height}`:null,orientation:width&&height?(height>width?'Portrait':width>height?'Landscape':'Square'):null,durationSeconds:duration,fps,bitrateKbps:bitrate?Math.round(bitrate/1000):null,fileSizeBytes:size,codec:stream.codec_name||null,container:format.format_name||null}});
  }catch{return NextResponse.json({error:'The video was found, but its technical metadata could not be analyzed.'},{status:422});}
}
