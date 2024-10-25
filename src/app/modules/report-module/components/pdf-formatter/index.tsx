import React from "react";
import LogoIcon from "app/modules/home-module/components/Footer/asset/logo.svg";
export const modifyNode = (node: HTMLElement) => {
  node.style.padding = "20px";
  const topLogoContainer = document.createElement("div");
  topLogoContainer.id = "top-logo-container";
  topLogoContainer.style.display = "flex";
  topLogoContainer.style.justifyContent = "center";
  topLogoContainer.style.width = "100%";
  topLogoContainer.style.padding = "30px 0";
  topLogoContainer.style.visibility = "hidden";
  const text = document.createElement("p");
  text.textContent = "Report";
  const topLogo = document.createElement("img");
  topLogo.style.width = "225px";
  topLogo.style.height = "24px";
  topLogo.src = LogoIcon;
  topLogo.alt = "logo";
  topLogoContainer.appendChild(topLogo);

  const bottomLogoContainer = document.createElement("div");
  bottomLogoContainer.id = "bottom-logo-container";

  bottomLogoContainer.style.display = "flex";
  bottomLogoContainer.style.justifyContent = "flex-end";
  bottomLogoContainer.style.width = "100%";
  bottomLogoContainer.style.padding = "30px 0";
  bottomLogoContainer.style.visibility = "hidden";
  const bottomLogo = document.createElement("img");
  bottomLogo.src = LogoIcon;
  bottomLogo.alt = "logo";
  bottomLogo.style.width = "225x";
  bottomLogo.style.height = "24px";
  bottomLogoContainer.appendChild(bottomLogo);

  node.prepend(topLogoContainer);
  node.appendChild(bottomLogoContainer);

  return { node, topLogoContainer, bottomLogoContainer };
};
