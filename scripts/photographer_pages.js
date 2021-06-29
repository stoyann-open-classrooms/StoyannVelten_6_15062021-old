import { Photographers } from "./Photographers.js";
import { MediumList } from "./MediumList.js";
import { Medium } from "./Medium.js";
import { displayBanner } from "./bannerPhotographer.js";
import { openModalForm, closeModalForm, validForm } from "./modale.js";
// import { openLightbox } from "./lightbox.js";

const linkToData = "data/FishEyeDataFR.json";
const urlParams = new URLSearchParams(window.location.search);
const mediaList = new MediumList();
let mediaFactory = new Medium();

let currentPhotographer;
let totalLikes = [];
let totalLikesPhotographer = [];

const main = document.querySelector(".main");

function createContent() {
  fetch(linkToData)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("erreur");
      }
    })

    .then((data) => createData(data))

    .then(displayPage);
}

function createData(data) {
  data.photographers.forEach((photographer) => {
    if (photographer.id === Number(urlParams.get("id"))) {
      currentPhotographer = new Photographers(
        photographer.name,
        photographer.id,
        photographer.city,
        photographer.country,
        photographer.tags,
        photographer.tagline,
        photographer.price,
        photographer.portrait
      );
    }
  });

  data.media.forEach((media) => {
    if (media.photographerId === currentPhotographer.id) {
      getLikes(media.likes);

      mediaList.addMedia(
        mediaFactory.createMedia(
          media.image?.split(".").pop() || media.video?.split(".").pop(),
          media.alt,
          media.date,
          media.id,
          media.image || media.video,
          media.likes,
          media.photographerId,
          media.tags,
          media.title,
          currentPhotographer.name.toLowerCase().replace(" ", "") + "/"
        )
      );
    }
  });
}
function displaymediaList() {
  const filters = [];
  const cardsMediaContainer = document.querySelector(".cards-media-container");

  document.querySelectorAll(".tag--selected").forEach((tagSelected) => {
    filters.push(tagSelected.textContent.replace("#", ""));
  });
  displaymediaList = mediaList.getMediaList(...filters);
  const totalLikesNb = document.querySelector(".total-likes");

  displaymediaList.forEach((media) => {
    console.log(media);
    const mediaElement = media.createImg();
    console.log(mediaElement);
    const cardsMedia = document.createElement("div");
    const cardsMediaImg = document.createElement("a");
    const cardsMediaFooter = document.createElement("div");
    const cardsMediaTitle = document.createElement("p");
    const cardsMediaHeaderLike = document.createElement("div");
    const cardsMediaCompteurLike = document.createElement("p");
    const heartLink = document.createElement("a");
    const heart = document.createElement("i");

    cardsMedia.classList.add("cards-media");
    cardsMediaImg.classList.add("cards-media-img");
    cardsMediaFooter.classList.add("cards-media-footer");
    cardsMediaTitle.classList.add("cards-media-title");
    cardsMediaHeaderLike.classList.add("header-like");
    cardsMediaCompteurLike.classList.add("compteur");
    heartLink.classList.add("heart-link");
    heart.classList.add("heart");
    heart.classList.add("far");
    heart.classList.add("fa-heart");
    cardsMediaImg.href = "#";

    cardsMediaTitle.textContent = `${media.title}`;
    cardsMediaCompteurLike.textContent = `${media.likes}`;

    cardsMediaContainer.append(cardsMedia);
    cardsMedia.append(cardsMediaImg, cardsMediaFooter);
    cardsMediaImg.append(mediaElement);
    cardsMediaFooter.append(cardsMediaTitle, cardsMediaHeaderLike);
    cardsMediaHeaderLike.append(cardsMediaCompteurLike, heartLink);
    heartLink.append(heart);
    console.log(cardsMedia);

    // compteur de likes
    heartLink.addEventListener("click", () => {
      if (heart.classList.contains("fas")) {
        media.likes--;
        heart.classList.remove("fas");
        heart.classList.add("far");
        cardsMediaCompteurLike.textContent = `${media.likes}`;
        totalLikesPhotographer--;
        totalLikesNb.textContent = `${totalLikesPhotographer} `;
      } else {
        media.likes++;
        heart.classList.remove("far");
        heart.classList.add("fas");
        cardsMediaCompteurLike.textContent = `${media.likes}`;
        totalLikesPhotographer++;

        totalLikesNb.textContent = `${totalLikesPhotographer} `;
      }
    });
  });
  console.log(displaymediaList);
}

function displayPage() {
  document.title += " - " + currentPhotographer.name;
  displayBanner(currentPhotographer);
  openModalForm(currentPhotographer);
  closeModalForm();
  validForm();
  // openLightbox();
  getTotalLikes(totalLikes);
  displaymediaList();
}

function getLikes(likes) {
  totalLikes.push(likes);
  return totalLikes;
}

function getTotalLikes(totalLikes) {
  let totalLikesPhotographer = 0;
  for (let i = 0; i < totalLikes.length; i++) {
    totalLikesPhotographer += totalLikes[i];
  }
  const totalLikesContainer = document.createElement("div");
  const totalLikesNb = document.createElement("div");
  const heart = document.createElement("i");

  heart.classList.add(`fas`);
  heart.classList.add(`fa-heart`);
  heart.classList.add(`heart`);

  totalLikesContainer.classList.add("total-likes-container");
  totalLikesNb.classList.add("total-likes");
  totalLikesNb.textContent = `${totalLikesPhotographer}`;

  main.append(totalLikesContainer);
  totalLikesContainer.append(totalLikesNb, heart);

  return totalLikesPhotographer;
}
createContent();
