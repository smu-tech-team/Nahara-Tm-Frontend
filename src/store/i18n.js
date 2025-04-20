import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            heading: "Welcome to Our News Site",
            latestNews: "Latest News",
            readMore: "Read More",
            footer: "All rights reserved.",
        },
    },
    es: {
        translation: {
            heading: "Bienvenido a nuestro sitio de noticias",
            latestNews: "Últimas Noticias",
            readMore: "Leer Más",
            footer: "Todos los derechos reservados.",
        },
    },
    fr: {
        translation: {
            heading: "Bienvenue sur notre site d'actualités",
            latestNews: "Dernières Nouvelles",
            readMore: "Lire la Suite",
            footer: "Tous droits réservés.",
        },
    },
    // Add more languages as needed...
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en", // Fallback language
    interpolation: {
        escapeValue: false, // React already escapes values
    },
});

export default i18n;
