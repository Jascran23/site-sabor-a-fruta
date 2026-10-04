import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';

const canvas=document.querySelector('.hero-canvas');
const host=document.querySelector('.hero-art');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if(canvas&&host){
  try{
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setClearColor(0x000000,0);

    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(34,1,.1,30);
    camera.position.z=7;
    const orbitGroup=new THREE.Group();
    scene.add(orbitGroup);
    scene.add(new THREE.AmbientLight(0xffffff,2.1));
    const keyLight=new THREE.DirectionalLight(0xffffff,2.4);
    keyLight.position.set(-2,3,5);
    scene.add(keyLight);

    const palette=[0x9edb69,0xf1d83a,0x168346,0xe99b32,0xe9f1d9];
    const fruitGeometry=new THREE.SphereGeometry(1,18,14);
    const fruitMeshes=[];
    for(let i=0;i<22;i++){
      const angle=(i/22)*Math.PI*2;
      const radius=2.12+(i%4)*.12;
      const size=.045+(i%5)*.012;
      const fruit=new THREE.Mesh(fruitGeometry,new THREE.MeshStandardMaterial({color:palette[i%palette.length],roughness:.58}));
      fruit.position.set(Math.cos(angle)*radius,Math.sin(angle)*1.45,(i%3)*-.14);
      fruit.scale.set(size*1.25,size,size);
      fruit.rotation.z=angle;
      orbitGroup.add(fruit);
      fruitMeshes.push(fruit);
    }

    const seedGeometry=new THREE.SphereGeometry(1,10,8);
    const seedMaterial=new THREE.MeshStandardMaterial({color:0xf5da43,roughness:.72});
    for(let i=0;i<7;i++){
      const seed=new THREE.Mesh(seedGeometry,seedMaterial);
      seed.position.set(-2.15+i*.15,-.35+Math.sin(i*1.4)*.12,.1);
      seed.scale.set(.075,.035,.045);
      seed.rotation.z=-.5+i*.16;
      orbitGroup.add(seed);
    }
    const orbit=new THREE.Mesh(new THREE.TorusGeometry(2.25,.008,4,120),new THREE.MeshBasicMaterial({color:0xa7d68a,transparent:true,opacity:.48}));
    orbit.scale.y=.68;
    orbitGroup.add(orbit);

    const resize=()=>{
      const width=Math.max(1,host.clientWidth);
      const height=Math.max(1,host.clientHeight);
      renderer.setSize(width,height,false);
      camera.aspect=width/height;
      camera.updateProjectionMatrix();
      const compact=width<500;
      orbitGroup.scale.setScalar(compact ? 0.78 : 1);
      orbitGroup.position.x=compact ? 0.03 : 0.05;
      renderer.render(scene,camera);
    };
    const resizeObserver=new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    if(!reduceMotion){
      window.addEventListener('load',()=>{
        if(window.gsap&&window.ScrollTrigger){
          window.gsap.to(orbitGroup.rotation,{y:Math.PI*1.5,x:.16,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
        }
      },{once:true});
    }

    let frame=0;
    let inView=false;
    const clock=new THREE.Clock();
    const draw=()=>{
      if(!reduceMotion){
        const time=clock.getElapsedTime();
        orbitGroup.position.y=Math.sin(time*.7)*.035;
        fruitMeshes.forEach((mesh,index)=>{mesh.position.z=(index%3)*-.14+Math.sin(time+index)*.035});
      }
      renderer.render(scene,camera);
    };
    const animate=()=>{
      if(!inView||document.hidden){frame=0;return}
      draw();
      frame=requestAnimationFrame(animate);
    };
    const observer=new IntersectionObserver(([entry])=>{
      inView=entry.isIntersecting;
      if(inView&&!reduceMotion&&!frame)frame=requestAnimationFrame(animate);
      else if(inView&&reduceMotion)draw();
      if(!inView&&frame){cancelAnimationFrame(frame);frame=0}
    },{rootMargin:'80px'});
    observer.observe(host);
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0}
      else if(!document.hidden&&inView&&!reduceMotion&&!frame)frame=requestAnimationFrame(animate);
      else if(!document.hidden&&inView&&reduceMotion)draw();
    });
  }catch(error){
    canvas.remove();
  }
}
