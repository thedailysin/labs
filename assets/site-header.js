(()=>{
  const header=document.querySelector('header');
  if(!header)return;
  const isAbout=location.pathname.split('/').pop()==='about.html';
  header.className='shared-site-header';
  header.innerHTML=`<a class="shared-logo" href="index.html" aria-label="The Daily Sin home"><img src="assets/studio-seal.png" alt="Studio by The Daily Sin"></a><a class="shared-header-action ${isAbout?'shared-close':''}" ${isAbout?'id="close-about"':''} href="${isAbout?'index.html':'about.html'}" aria-label="${isAbout?'Close About page':'About me'}">${isAbout?'×':'About me'}</a>`;
  let frame=0;
  const updateHeader=()=>{
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>header.classList.toggle('is-scrolled',scrollY>12));
  };
  addEventListener('scroll',updateHeader,{passive:true});
  updateHeader();
  if(isAbout){
    header.querySelector('#close-about').addEventListener('click',event=>{
      if(history.length>1){event.preventDefault();history.back()}
    });
  }
})();
