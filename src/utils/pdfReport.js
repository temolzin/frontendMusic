const BRAND = {
  logo: "/logovibeer-light.png",
  gradient: "linear-gradient(135deg,#1c2331 0%,#094FAB 58%,#26A69A 100%)",
  footer: "Vibeer powered by Root Heim Company",
};

export function createPdfHero({ title, subtitle, logo = BRAND.logo } = {}) {
  const hero = document.createElement("div");
  hero.style.cssText = `width:100%;box-sizing:border-box;background:${BRAND.gradient};color:#ffffff;text-align:center;padding:24px 24px 20px;`;

  const logoImg = document.createElement("img");
  logoImg.src = logo;
  logoImg.alt = "Vibeer";
  logoImg.style.cssText = "display:block;width:88px;height:auto;margin:0 auto 2px;filter:drop-shadow(0 6px 14px rgba(0,0,0,0.18));";

  const titleEl = document.createElement("div");
  titleEl.textContent = title || "";
  titleEl.style.cssText = "margin:4px 0 0;font-size:21px;line-height:1.2;font-weight:800;";

  const subtitleEl = document.createElement("div");
  subtitleEl.textContent = subtitle || "";
  subtitleEl.style.cssText = "margin:4px auto 0;max-width:520px;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.9);";

  hero.appendChild(logoImg);
  hero.appendChild(titleEl);
  hero.appendChild(subtitleEl);
  return hero;
}

export function createPdfWrapper() {
  const wrapper = document.createElement("div");
  wrapper.style.cssText =
    "position:absolute;top:0;left:-10000px;width:794px;box-sizing:border-box;background:#ffffff;font-family:Arial,Helvetica,sans-serif;";

  const style = document.createElement("style");
  style.textContent = `
    .apexcharts-canvas { display: block; margin: 0 auto !important; }
    .apexcharts-canvas svg { max-width: 100% !important; }
  `;
  wrapper.appendChild(style);
  document.body.appendChild(wrapper);
  return wrapper;
}

export function drawPdfFooter(pdf, { pageWidth, pageHeight, pageNumber, totalPages, text = BRAND.footer } = {}) {
  pdf.setFontSize(9);
  pdf.setTextColor("#667085");
  pdf.text(text, pageWidth / 2, pageHeight - 8, { align: "center" });
  if (pageNumber && totalPages) {
    pdf.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - 14, pageHeight - 8, { align: "right" });
  }
}
