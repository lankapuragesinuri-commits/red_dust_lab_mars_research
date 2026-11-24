(() => {
  "use strict";
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const observations = [
    {title:"Initial readings", time:"02:50 PM", tag:"START / BASELINE", description:"Baseline observation at the beginning of the experiment.", r1:9.8, r2:4.8, main:0.8, status:{r1:"Generating measurable voltage",r2:"Generating measurable voltage",main:"Generating measurable voltage"}},
    {title:"Intermediate observation", time:"TIME UNVERIFIED", tag:"INTERMEDIATE / CHECK VIDEO", description:"The next recorded observation in the supplied sequence. Its exact timestamp has not yet been verified.", r1:9.0, r2:4.6, main:null, status:{r1:"Generating measurable voltage",r2:"Generating measurable voltage",main:"Very small output · not quantified"}},
    {title:"Third observation", time:"03:03 PM", tag:"MAIN PANEL / NO MEASURABLE OUTPUT", description:"The main solar panel was reported to have stopped producing measurable output by this observation.", r1:8.9, r2:4.5, main:0, status:{r1:"Generating measurable voltage",r2:"Generating measurable voltage",main:"No measurable output reported"}},
    {title:"Final observation", time:"03:06 PM", tag:"END / FINAL READINGS", description:"The final observation recorded Rover 01 and the main panel at 0 V / no measurable output, while Rover 02 remained at approximately 3.5 V.", r1:0, r2:3.5, main:0, status:{r1:"0 V · no measurable output",r2:"Approximate measured output",main:"0 V · no measurable output"}}
  ];
  const slider=$("#observationSlider");
  const play=$("#playReplay"), pause=$("#pauseReplay"), reset=$("#resetReplay");
  let current=0, timer=null;
  const formatVoltage = (v) => v === null ? "Very small<small>Unquantified</small>" : v === 0 ? "0 <small>V</small>" : `${v===3.5?"≈":""}${v.toFixed(1)} <small>V</small>`;
  const updateUnit=(key,value,status)=>{
    const valEl=$(`#${key}Value`), statusEl=$(`#${key}Status`), bar=$(`#${key}Bar`);
    valEl.innerHTML=formatVoltage(value);
    statusEl.textContent=status;
    bar.style.width=value===null?"3%":`${Math.max(0,Math.min(100,value/9.8*100))}%`;
    valEl.classList.toggle("is-zero",value===0);
    statusEl.classList.toggle("status-zero",value===0);
    bar.classList.toggle("bar-zero",value===0);
  };
  const render=(index)=>{
    current=Math.max(0,Math.min(observations.length-1,index));
    const item=observations[current];
    slider.value=String(current);
    $("#replayTitle").textContent=item.title;
    $("#replayDescription").textContent=item.description;
    $("#replayTime").innerHTML=item.time==="TIME UNVERIFIED"?"TIME <i>UNVERIFIED</i>":item.time.replace(" PM"," <i>PM</i>");
    $("#replayTag").textContent=item.tag;
    $("#sliderCounter").textContent=`STOP ${String(current+1).padStart(2,"0")} / 04`;
    updateUnit("rover01",item.r1,item.status.r1);
    updateUnit("rover02",item.r2,item.status.r2);
    updateUnit("main",item.main,item.status.main);
    $$('[data-jump]').forEach(btn=>btn.classList.toggle("jump-active",Number(btn.dataset.jump)===current));
    slider.setAttribute("aria-valuetext",`${item.title}, ${item.time}`);
  };
  const stop=()=>{if(timer!==null){clearInterval(timer);timer=null;} play.disabled=false; pause.disabled=true;};
  const advance=()=>{if(current>=observations.length-1){stop();return;} render(current+1); if(current>=observations.length-1) stop();};
  slider.addEventListener("input",()=>{stop();render(Number(slider.value));});
  $$('[data-jump]').forEach(btn=>btn.addEventListener("click",()=>{stop();render(Number(btn.dataset.jump));}));
  play.addEventListener("click",()=>{if(timer!==null)return; if(current===observations.length-1)render(0); play.disabled=true;pause.disabled=false;timer=setInterval(advance,reducedMotion?2600:2100);});
  pause.addEventListener("click",stop);
  reset.addEventListener("click",()=>{stop();render(0);});
  render(0);

  // Keep the conceptual slider strictly illustrative.
  const coverageRange=$("#coverageRange"), coverageValue=$("#coverageValue"), uncoveredValue=$("#uncoveredValue"), dustLayer=$("#dustLayer");
  const updateCoverage=()=>{if(!coverageRange||!dustLayer)return;const amount=Number(coverageRange.value);coverageValue.textContent=`${amount}%`;uncoveredValue.textContent=`${100-amount}%`;dustLayer.style.clipPath=`inset(0 ${100-amount}% 0 0)`;};
  coverageRange?.addEventListener("input",updateCoverage);updateCoverage();

  // Mobile navigation.
  const menu=$("#menuToggle"), nav=$("#mainNav");
  menu?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-label",open?"Close navigation":"Open navigation");});
})();
