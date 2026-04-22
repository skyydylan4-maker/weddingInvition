// ================= INIT =================
AOS.init({ once: true });

const RSVP_URL = "https://script.google.com/macros/s/AKfycbwQSI5DYCwtDsbSsZePHvN8O7kpyBWeZaI0nvGkqb4cUzuLC9Dkhd-XqVNLQISaRRE_/exec";

// ================= OPENING =================
const opening = document.getElementById("opening");
const btnOpen = document.getElementById("btn-open");
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

btnOpen.onclick = () => {
    opening.classList.add("hidden");
    music.play().catch(()=>{});
    musicToggle.classList.add("visible","playing");
};

// ================= MUSIC =================
let isPlaying = true;
musicToggle.onclick = () => {
    if(isPlaying){
        music.pause();
        musicToggle.classList.remove("playing");
    } else {
        music.play();
        musicToggle.classList.add("playing");
    }
    isPlaying = !isPlaying;
};

// ================= SCROLL =================
const progress = document.getElementById("scroll-progress");
window.onscroll = () => {
    let s = window.scrollY;
    let h = document.body.scrollHeight - window.innerHeight;
    progress.style.width = (s/h)*100 + "%";
};

// ================= COUNTDOWN =================
const target = new Date("2025-12-28").getTime();
setInterval(()=>{
    let now = new Date().getTime();
    let d = target - now;

    document.getElementById("cd-days").innerText = Math.floor(d/(1000*60*60*24));
    document.getElementById("cd-hours").innerText = Math.floor((d%(1000*60*60*24))/(1000*60*60));
    document.getElementById("cd-minutes").innerText = Math.floor((d%(1000*60*60))/(1000*60));
    document.getElementById("cd-seconds").innerText = Math.floor((d%(1000*60))/1000);
},1000);

// ================= PARTICLES =================
const particles = document.getElementById("particles");
for(let i=0;i<25;i++){
    let p = document.createElement("div");
    p.className="particle";
    p.style.left=Math.random()*100+"%";
    p.style.top=Math.random()*100+"%";
    p.style.width=p.style.height=(Math.random()*4+2)+"px";
    p.style.animationDelay=Math.random()*6+"s";
    particles.appendChild(p);
}

// ================= LIGHTBOX =================
const imgs = document.querySelectorAll(".gallery-item img");
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbClose = document.getElementById("lb-close");
const lbPrev = document.getElementById("lb-prev");
const lbNext = document.getElementById("lb-next");
const lbCounter = document.getElementById("lb-counter");

let idx=0;
const arr = [...imgs].map(i=>i.src);

imgs.forEach((img,i)=>{
    img.onclick=()=>{
        idx=i;
        showImg();
        lb.classList.add("active");
    }
});

function showImg(){
    lbImg.src=arr[idx];
    lbCounter.innerText=`${idx+1}/${arr.length}`;
}
lbClose.onclick=()=>lb.classList.remove("active");
lbPrev.onclick=()=>{idx=(idx-1+arr.length)%arr.length;showImg();}
lbNext.onclick=()=>{idx=(idx+1)%arr.length;showImg();}

// ================= MODAL =================
const modal = document.getElementById("success-modal");
document.getElementById("modal-close").onclick=()=>modal.classList.remove("active");

// ================= RSVP =================
const form = document.getElementById("rsvp-form");

form.addEventListener("submit", async(e)=>{
    e.preventDefault();

    const nama = document.getElementById("rsvp-name").value;
    const hadir = document.getElementById("rsvp-attendance").value;
    const jumlah = document.getElementById("rsvp-jumlah").value;
    const pesan = document.getElementById("rsvp-message").value;

    if(!nama || !hadir) return;

    const data = {nama, kehadiran:hadir, jumlah, pesan};

    const btn = document.getElementById("btn-submit");
    btn.disabled=true;

    try{
        await fetch(RSVP_URL,{
            method:"POST",
            body:JSON.stringify(data)
        });

        modal.classList.add("active");
        addWish(data);
        form.reset();

    }catch{
        alert("gagal cuyyy");
    }

    btn.disabled=false;
});

// ================= WISH =================
function addWish(item){
    const grid = document.getElementById("wishes-grid");
    const section = document.getElementById("wishes-section");

    const el = document.createElement("div");
    el.className="wish-card";
    el.innerHTML=`
        <div class="wish-name">${item.nama}</div>
        <div class="wish-attendance ${item.kehadiran}">${item.kehadiran}</div>
        <div class="wish-message">${item.pesan || "-"}</div>
        <div class="wish-meta">
            <span class="wish-guests">${item.jumlah} org</span>
        </div>
    `;

    grid.prepend(el);
    section.style.display="block";

    updateStats(item.kehadiran);
}

// ================= STATS =================
function updateStats(status){
    const total = document.getElementById("stat-total");
    const hadir = document.getElementById("stat-hadir");
    const tidak = document.getElementById("stat-tidak");

    total.innerText = +total.innerText + 1;

    if(status==="hadir") hadir.innerText = +hadir.innerText + 1;
    if(status==="tidak") tidak.innerText = +tidak.innerText + 1;
}

// ================= LOAD DATA =================
async function load(){
    try{
        const res = await fetch(RSVP_URL);
        const data = await res.json();
        data.forEach(addWish);
    }catch{
        console.log("fail load");
    }
}
load();

// ================= ANIMATION FIX =================
const observer = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            e.target.classList.add("show");
        }
    });
},{threshold:0.15});

document.querySelectorAll("section:not(#opening), .timeline-item, .event-card, .gallery-item, .wish-card")
.forEach(el=>{
    el.classList.add("hidden-anim");
    observer.observe(el);
});

// TEXT REVEAL
function splitText(el){
    if(!el) return;
    const text = el.innerText;
    el.innerHTML="";
    text.split("").forEach((c,i)=>{
        let s=document.createElement("span");
        s.innerText=c;
        s.style.opacity=0;
        s.style.display="inline-block";
        s.style.transform="translateY(20px)";
        s.style.transition=`all 0.4s ease ${i*0.02}s`;
        el.appendChild(s);
    });

    setTimeout(()=>{
        el.querySelectorAll("span").forEach(s=>{
            s.style.opacity=1;
            s.style.transform="translateY(0)";
        });
    },200);
}
splitText(document.querySelector(".hero-name"));

// RIPPLE FIX
document.querySelectorAll("button").forEach(btn=>{
    btn.style.position="relative";
    btn.style.overflow="hidden";

    btn.addEventListener("click",function(e){
        const circle=document.createElement("span");
        circle.style.position="absolute";
        circle.style.pointerEvents="none";
        circle.style.borderRadius="50%";
        circle.style.background="rgba(255,255,255,0.3)";
        circle.style.transform="scale(0)";
        circle.style.animation="ripple 0.6s linear";
        circle.style.left=e.offsetX+"px";
        circle.style.top=e.offsetY+"px";
        circle.style.width=circle.style.height="100px";

        this.appendChild(circle);
        setTimeout(()=>circle.remove(),600);
    });
});

// CARD TILT
document.querySelectorAll(".event-card, .wish-card").forEach(card=>{
    card.addEventListener("mousemove",(e)=>{
        let x = e.offsetX / card.offsetWidth - 0.5;
        let y = e.offsetY / card.offsetHeight - 0.5;
        card.style.transform = `rotateX(${y*8}deg) rotateY(${x*8}deg)`;
    });

    card.addEventListener("mouseleave",()=>{
        card.style.transform="rotateX(0) rotateY(0)";
    });
});