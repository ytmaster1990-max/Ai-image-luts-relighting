 "use client";
import {useRef,useState} from "react";
import "./globals.css";

const tabs=["Basic","LUTs","Advanced","Relight","Upscale","Downscale","Export"];
const presets={
  Cinematic:"contrast(1.18) saturate(1.12) brightness(.96)",
  Moody:"contrast(1.2) saturate(.78) brightness(.86)",
  Golden:"sepia(.14) saturate(1.2) brightness(1.05)",
  Noir:"grayscale(1) contrast(1.3)",
  Cool:"hue-rotate(8deg) saturate(.9) brightness(.98)",
  Vivid:"saturate(1.35) contrast(1.08)"
};
export default function Home(){
 const [tab,setTab]=useState("Basic"),[src,setSrc]=useState(""),[fileName,setFileName]=useState("image");
 const [v,setV]=useState({brightness:100,contrast:100,saturate:100,blur:0,sepia:0,grayscale:0,hue:0});
 const [lut,setLut]=useState(""); const [scale,setScale]=useState(100); const [format,setFormat]=useState("image/png");
 const input=useRef();
 const filters=lut?presets[lut]:`brightness(${v.brightness}%) contrast(${v.contrast}%) saturate(${v.saturate}%) blur(${v.blur}px) sepia(${v.sepia}%) grayscale(${v.grayscale}%) hue-rotate(${v.hue}deg)`;
 const upload=e=>{const f=e.target.files?.[0];if(!f)return;setFileName(f.name.replace(/\.[^.]+$/,"")||"image");setSrc(URL.createObjectURL(f))};
 const reset=()=>{setV({brightness:100,contrast:100,saturate:100,blur:0,sepia:0,grayscale:0,hue:0});setLut("");setScale(100)};
 const download=async()=>{
  if(!src)return;
  const img=new Image();img.onload=()=>{const c=document.createElement("canvas"),ctx=c.getContext("2d");
   const s=scale/100;c.width=Math.max(1,Math.round(img.naturalWidth*s));c.height=Math.max(1,Math.round(img.naturalHeight*s));
   ctx.filter=filters;ctx.drawImage(img,0,0,c.width,c.height);
   const ext=format==="image/jpeg"?"jpg":format==="image/webp"?"webp":"png";const a=document.createElement("a");a.href=c.toDataURL(format,.95);a.download=`${fileName}-edited.${ext}`;a.click()
  };img.src=src
 };
 const slider=(key,label,min=0,max=200)=><div className="control"><div className="row"><span>{label}</span><b>{v[key]}</b></div><input type="range" min={min} max={max} value={v[key]} onChange={e=>{setLut("");setV({...v,[key]:+e.target.value})}}/></div>;
 const content={
 Basic:<>{slider("brightness","Brightness")} {slider("contrast","Contrast")} {slider("saturate","Saturation")}<div className="note">Browser-based, non-destructive preview.</div></>,
 LUTs:<><div className="chips">{Object.keys(presets).map(x=><button key={x} className={"chip "+(lut===x?"active":"")} onClick={()=>setLut(lut===x?"":x)}>{x}</button>)}</div><div className="note">Built-in creative looks. Custom .cube LUT parsing can be added as a backend/module upgrade.</div></>,
 Advanced:<>{slider("blur","Blur",0,20)}{slider("sepia","Sepia",0,100)}{slider("grayscale","Grayscale",0,100)}{slider("hue","Hue Rotate",0,360)}<div className="note">Architecture placeholder for curves, HSL, masks and selective edits.</div></>,
 Relight:<><div className="chips">{["Rim Light","Soft Rim","Strong Rim","Dual Rim","Backlight","Side Light","Top Light","God Rays","Volumetric","Sun Rays","Spotlight","Moonlight","Neon"].map(x=><button key={x} className="chip" onClick={()=>alert(`${x} selected. Realistic scene-aware relighting requires an AI API endpoint.`)}>{x}</button>)}</div><div className="note">AI-ready module. Connect this tab to a relighting model/API without changing the editor UI.</div></>,
 Upscale:<><div className="chips">{["2× AI Upscale","4× AI Upscale","8× AI Upscale","Face Enhance","Detail Recovery"].map(x=><button key={x} className="chip" onClick={()=>alert(`${x} requires an AI backend endpoint.`)}>{x}</button>)}</div><div className="note">Real AI upscaling belongs in a server/API route to avoid exposing provider keys.</div></>,
 Downscale:<><div className="control"><div className="row"><span>Output scale</span><b>{scale}%</b></div><input type="range" min="10" max="100" value={scale} onChange={e=>setScale(+e.target.value)}/></div><div className="note">Applied during export with aspect ratio preserved.</div></>,
 Export:<><div className="control"><label className="row"><span>Format</span></label><select className="field" value={format} onChange={e=>setFormat(e.target.value)}><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></div><button className="btn primary" onClick={download}>Export Image</button></>
 }[tab];
 return <main className="app">
  <header className="top"><div className="brand">✦ AI IMAGE EDITOR <span>STUDIO</span></div><div className="actions"><button className="btn" onClick={()=>input.current.click()}>Upload</button><button className="btn" onClick={reset}>Reset</button><button className="btn primary" onClick={download}>Export</button></div></header>
  <section className="shell"><nav className="tabs">{tabs.map(t=><button key={t} onClick={()=>setTab(t)} className={"tab "+(tab===t?"active":"")}>{t}</button>)}</nav>
  <section className="workspace">{src?<div className="stage"><img src={src} alt="Editing preview" style={{"--filters":filters}}/></div>:<div className="empty"><h2>Drop your image here</h2><p>Upload JPG, PNG or WebP to begin editing.</p><button className="btn primary" onClick={()=>input.current.click()}>Choose Image</button></div>}<input ref={input} className="upload" type="file" accept="image/*" onChange={upload}/></section>
  <aside className="panel"><h2>{tab}</h2>{content}</aside></section>
 </main>
}