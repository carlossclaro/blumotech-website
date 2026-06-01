/**
 * Contact form uses FormSubmit standard POST (not /ajax/) to avoid CORS on blumotech.com.
 * After deploy: submit once on the live site and confirm the activation email.
 */
window.BLUMOTECH_CONFIG = {
  contactEmail: "sales@blumotech.com",
  formSubmitAction: "https://formsubmit.co/sales@blumotech.com",  /* Edit with your real client review when ready */
  testimonial: {
    quote:
      "Blumotech built our law firm website with professionalism and attention to detail — a clear, trustworthy presence for our practice in Ukraine.",
    author: "Law firm client",
    role: "gp.od.ua · Ukraine",
    projectUrl: "",
  },
};
