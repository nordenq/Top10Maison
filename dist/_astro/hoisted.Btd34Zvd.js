window.addEventListener("DOMContentLoaded",function(){if(!localStorage.getItem("cookieConsent")){const e=document.createElement("div");e.className="cookie-banner",e.innerHTML=`
            <p class="cookie-banner__text">
              This site uses cookies to improve performance and serve personalized ads.
              <a href="/legal/">Learn more about cookies and privacy</a>.
            </p>
            <div class="cookie-banner__actions">
              <button type="button" data-consent="accept">Got it!</button>
              <button type="button" data-consent="decline" class="cookie-banner__decline">Decline</button>
            </div>
          `;const a=e.querySelector('[data-consent="accept"]'),i=e.querySelector('[data-consent="decline"]');a?.addEventListener("click",function(){localStorage.setItem("cookieConsent","true"),e.remove()}),i?.addEventListener("click",function(){localStorage.setItem("cookieConsent","false"),e.remove()}),document.body.appendChild(e)}});const o=document.getElementById("site-header"),t=document.getElementById("mobile-menu-button"),n=document.getElementById("mobile-menu");function c(){o&&(o.dataset.scrolled=window.scrollY>12?"true":"false")}window.addEventListener("scroll",c);c();t?.addEventListener("click",function(){if(!n||!t)return;const e=!n.classList.contains("hidden");n.classList.toggle("hidden"),t.setAttribute("aria-expanded",(!e).toString())});
