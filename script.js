
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // 1. Sélection des éléments
    // ==============================

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const navItems = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const yearElement = document.getElementById("current-year");

    // ==============================
    // 2. Menu de navigation mobile
    // ==============================

    function fermerMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    }

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {
            const menuOuvert =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (menuOuvert) {
                fermerMenu();
            } else {
                navLinks.classList.add("open");
                menuToggle.setAttribute("aria-expanded", "true");
                menuToggle.setAttribute("aria-label", "Fermer le menu");
            }
        });

        // Fermer le menu après avoir choisi une rubrique.
        navItems.forEach((lien) => {
            lien.addEventListener("click", () => {
                fermerMenu();
            });
        });

        // Fermer le menu avec la touche Échap.
        document.addEventListener("keydown", (evenement) => {
            if (evenement.key === "Escape") {
                fermerMenu();
                menuToggle.focus();
            }
        });

        // Fermer le menu si l'utilisateur clique à l'extérieur.
        document.addEventListener("click", (evenement) => {
            const clicExterieur =
                !navLinks.contains(evenement.target) &&
                !menuToggle.contains(evenement.target);

            if (clicExterieur) {
                fermerMenu();
            }
        });

        // Réinitialiser le menu lorsque l'écran devient large.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                fermerMenu();
            }
        });
    }

    // ==============================
    // 3. Défilement fluide
    // ==============================

    document.querySelectorAll('a[href^="#"]').forEach((lien) => {
        lien.addEventListener("click", (evenement) => {
            const destination = lien.getAttribute("href");

            if (!destination || destination === "#") return;

            const sectionCible = document.querySelector(destination);

            if (!sectionCible) return;

            evenement.preventDefault();

            sectionCible.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            // Mettre à jour l'adresse de la page sans la recharger.
            if (window.location.hash !== destination) {
                history.pushState(null, "", destination);
            }
        });
    });

    // ==============================
    // 4. Apparition animée des éléments
    // ==============================

    const elementsAnimes = document.querySelectorAll(".reveal");

    const mouvementReduit = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if ("IntersectionObserver" in window && !mouvementReduit) {

        const observateur = new IntersectionObserver(
            (entrees, observer) => {
                entrees.forEach((entree) => {
                    if (entree.isIntersecting) {
                        entree.target.classList.add("visible");

                        // Ne plus observer un élément déjà affiché.
                        observer.unobserve(entree.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        elementsAnimes.forEach((element) => {
            observateur.observe(element);
        });

    } else {
        // Afficher directement le contenu si les animations
        // ne sont pas prises en charge ou doivent être réduites.
        elementsAnimes.forEach((element) => {
            element.classList.add("visible");
        });
    }

    // ==============================
    // 5. Mise à jour de l'année
    // ==============================

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ==============================
    // 6. Navigation active
    // ==============================

    if ("IntersectionObserver" in window) {

        const observateurSections = new IntersectionObserver(
            (entrees) => {
                entrees.forEach((entree) => {
                    if (!entree.isIntersecting) return;

                    const identifiant = entree.target.id;

                    navItems.forEach((lien) => {
                        const actif =
                            lien.getAttribute("href") === `#${identifiant}`;

                        lien.classList.toggle("active", actif);

                        if (actif) {
                            lien.setAttribute("aria-current", "location");
                        } else {
                            lien.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            observateurSections.observe(section);
        });
    }

});
