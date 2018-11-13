/* eslint-disable */
import { getOptimizeExperiments } from './optimize';

try {
  var db = indexedDB.open("test");
  // Check if Firefox Private Browsing is enabled
  // because the page hiding snippet doesn't work
  // properly in FF PB mode, see here:
  // https://www.en.advertisercommunity.com/t5/Google-Optimize-Implement/Optimize-Page-Hiding-Snippet-Unhide-delay-issue-in-Firefox/td-p/1106919
  db.onsuccess = function() {
    // Not in FF PB mode
    (function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
      h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
      (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
    })(window,document.documentElement,'async-hide','dataLayer',4000,
      {'GTM-KGKKPS4':true, 'GTM-NZGXNBL':true});

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-51507017-5', 'auto', {cookieDomain: 'auto', anonymizeIp: true});
    ga('require', 'GTM-NZGXNBL');
    ga('require', 'GTM-KGKKPS4');

    getOptimizeExperiments();
  };
} catch (e) {
  console.log(`Error initialising Optimize script: ${e.message}`);
}
/* eslint-enable */
